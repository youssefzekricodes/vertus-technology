import { NextResponse } from "next/server";

/**
 * Contact form → Google Sheets.
 *
 * The frontend never sees Google credentials: this route forwards the
 * submission server-side to a Google Apps Script "web app" endpoint that
 * appends a row to the sheet. Set the endpoint in .env.local:
 *
 *   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
 *
 * See README.md for the ready-to-paste Apps Script.
 */

type Payload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
};

const MAX = 2000;

function clean(v: unknown, max = MAX): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const row = {
    date: new Date().toISOString(),
    firstName: clean(body.firstName, 100),
    lastName: clean(body.lastName, 100),
    email: clean(body.email, 200),
    phone: clean(body.phone, 50),
    company: clean(body.company, 200),
    projectType: clean(body.projectType, 50),
    message: clean(body.message),
  };

  if (
    !row.firstName ||
    !row.lastName ||
    !row.message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) ||
    !/^[+\d][\d\s.-]{6,}$/.test(row.phone)
  ) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    // Not configured yet: log so submissions are not silently lost in dev.
    console.warn("[contact] GOOGLE_SHEETS_WEBHOOK_URL not set; submission:", row);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script replies with a redirect; follow it.
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`sheets_status_${res.status}`);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[contact] forwarding failed:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
