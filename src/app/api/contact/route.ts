import { NextResponse } from "next/server";

/**
 * "Demander une étude" → Google Sheets (CRM prospects).
 *
 * The browser posts multipart/form-data here; this route validates it
 * server-side, filters spam, enriches it with CRM fields (id, date, status
 * NEW, source…) and forwards it as JSON to a Google Apps Script web app,
 * which appends a row to the sheet and stores attachments in Drive.
 * Set the endpoint in .env.local (never commit it):
 *
 *   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
 *
 * See README.md for the ready-to-paste Apps Script.
 */

const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MIN_ELAPSED_MS = 3000;

// Naive per-instance rate limit: 5 submissions / 10 min / IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function str(data: FormData, key: string, max = 200): string {
  const v = data.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(v: string): number | "" | null {
  if (!v) return "";
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function yesNo(v: string): "oui" | "non" | "" {
  return v === "oui" || v === "non" ? v : "";
}

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return bad("invalid_body");
  }

  // Honeypot filled → pretend success so bots learn nothing.
  if (str(data, "website")) return NextResponse.json({ ok: true });

  const elapsed = Number(str(data, "elapsedMs", 20));
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) return bad("too_fast", 425);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return bad("rate_limited", 429);

  const fields = {
    fullName: str(data, "fullName", 120),
    company: str(data, "company", 160),
    phone: str(data, "phone", 40),
    email: str(data, "email", 200),
    city: str(data, "city", 100),
    projectType: str(data, "projectType", 100),
    power: num(str(data, "power", 20)),
    consumption: num(str(data, "consumption", 20)),
    bill: num(str(data, "bill", 20)),
    surface: num(str(data, "surface", 20)),
    roof: str(data, "roof", 60),
    storage: yesNo(str(data, "storage", 3)),
    pumping: yesNo(str(data, "pumping", 3)),
    ev: yesNo(str(data, "ev", 3)),
    message: str(data, "message", 4000),
  };

  const invalid: string[] = [];
  for (const k of ["fullName", "phone", "email", "city", "projectType", "message"] as const) {
    if (!fields[k]) invalid.push(k);
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) invalid.push("email");
  if (fields.phone && !/^[+\d][\d\s.-]{6,}$/.test(fields.phone)) invalid.push("phone");
  for (const k of ["power", "consumption", "bill", "surface"] as const) if (fields[k] === null) invalid.push(k);
  if (str(data, "consent", 3) !== "yes") invalid.push("consent");

  const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) invalid.push("files");
  if (files.some((f) => !FILE_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES)) invalid.push("files");

  if (invalid.length) {
    return NextResponse.json({ ok: false, error: "validation", fields: [...new Set(invalid)] }, { status: 400 });
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      name: f.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120),
      type: f.type,
      size: f.size,
      base64: Buffer.from(await f.arrayBuffer()).toString("base64"),
    }))
  );

  const prospect = {
    // CRM
    id: `VT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    date: new Date().toISOString(),
    status: "NEW",
    source: str(data, "utm_source", 100) || "site web",
    medium: str(data, "utm_medium", 100),
    campaign: str(data, "utm_campaign", 100),
    page: str(data, "page", 200),
    referrer: str(data, "referrer", 300),
    locale: str(data, "locale", 2) === "ar" ? "ar" : "fr",
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    consent: true,
    // Lead
    ...fields,
    attachments,
  };

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    // Misconfiguration must never look like a success: log the lead and fail.
    console.error("[contact] GOOGLE_SHEETS_WEBHOOK_URL is not set (.env.local / hosting env). Lead NOT stored:", {
      ...prospect,
      attachments: attachments.map(({ name, size }) => ({ name, size })),
    });
    return bad("not_configured", 503);
  }

  const send = async (payload: typeof prospect): Promise<{ ok: true } | { ok: false; error: string }> => {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script replies with a redirect; follow it.
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) return { ok: false, error: `sheets_status_${res.status}` };
    // Apps Script answers 200 even when the script throws: check its JSON.
    const text = await res.text();
    let reply: { ok?: boolean; status?: string; error?: string } | null = null;
    try {
      reply = JSON.parse(text);
    } catch {
      return { ok: false, error: `sheets_non_json: ${text.replace(/<[^>]+>/g, " ").slice(0, 200)}` };
    }
    if (reply?.ok === false || reply?.status === "error" || reply?.error) {
      return { ok: false, error: String(reply?.error ?? JSON.stringify(reply)).slice(0, 400) };
    }
    return { ok: true };
  };

  try {
    let result = await send(prospect);

    // Script without Drive permission: nothing was written. Retry without the
    // files so the lead itself is never lost, and say so in the message.
    if (!result.ok && /DriveApp/i.test(result.error) && prospect.attachments.length) {
      console.warn("[contact] Drive not authorised in Apps Script; retrying without attachments", prospect.id);
      result = await send({
        ...prospect,
        message: `${prospect.message}\n\n[${prospect.attachments.length} pièce(s) jointe(s) non enregistrée(s) : ${prospect.attachments
          .map((f) => f.name)
          .join(", ")} — autoriser Google Drive dans le script]`,
        attachments: [],
      });
    }

    // Script without Gmail permission: every version of the script writes the
    // row BEFORE sending the alert, so the lead is stored — only the e-mail failed.
    if (!result.ok && /MailApp|send_mail/i.test(result.error)) {
      console.warn("[contact] lead stored but the e-mail alert failed (authorise Gmail in Apps Script)", prospect.id);
      return NextResponse.json({ ok: true, id: prospect.id, stored: true, notified: false });
    }

    if (!result.ok) throw new Error(result.error);
    console.info("[contact] lead stored", prospect.id);
    return NextResponse.json({ ok: true, id: prospect.id, stored: true });
  } catch (err) {
    console.error("[contact] forwarding failed:", err, { id: prospect.id, email: prospect.email });
    return bad("upstream", 502);
  }
}
