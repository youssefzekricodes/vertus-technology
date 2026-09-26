import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ArabicShaper } from "arabic-persian-reshaper";
import { company } from "@/content/company";
import { getArticle } from "@/content/articles";
import { getPage } from "@/content/pages";
import { getUi } from "@/content/ui";
import type { Locale, PageKey } from "@/content/types";
import { keyFromSlug, routes } from "./routes";

/** Shared Open Graph / Twitter image (1200×630 PNG) for every page. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "src/assets/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "Archivo-ExtraBold.ttf")),
  readFile(join(fontDir, "Archivo-Medium.ttf")),
  readFile(join(fontDir, "IBMPlexSansArabic-Bold.ttf")),
]);

/** Title + eyebrow for a URL (home, page or article). */
export function ogText(locale: Locale, slug?: string[]): { eyebrow: string; title: string } {
  const ui = getUi(locale);
  if (!slug?.length) return { eyebrow: company.name, title: getPage(locale, "home").hero.h1 };
  if (slug.length === 2 && slug[0] === routes.news) {
    const a = getArticle(locale, slug[1]);
    if (a) return { eyebrow: a.category, title: a.title };
  }
  const key: PageKey = keyFromSlug(slug.join("/")) ?? "home";
  const page = getPage(locale, key);
  return { eyebrow: page.hero.eyebrow ?? ui.signature, title: page.hero.h1 };
}

/**
 * Satori has no bidi support: Arabic letters are shaped but words come out
 * left-to-right. Lay words out explicitly, right to left, wrapping naturally.
 */
function Words({ text, rtl, style }: { text: string; rtl: boolean; style: React.CSSProperties }) {
  if (!rtl) return <span style={style}>{text}</span>;
  return (
    <div
      style={{
        ...style,
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        columnGap: "0.28em",
      }}
    >
      {ArabicShaper.convertArabic(text)
        .split(/\s+/)
        .map((w, i) => (
          // Pre-shaped presentation forms: glyph widths are measured correctly.
          <span key={i}>{[...w].reverse().join("")}</span>
        ))}
    </div>
  );
}

export async function renderOg(locale: Locale, slug?: string[]) {
  const { eyebrow, title } = ogText(locale, slug);
  const [extraBold, medium, arabic] = await fonts;
  const rtl = locale === "ar";
  const titleSize = title.length > 70 ? 56 : title.length > 45 ? 66 : 78;
  const host = company.domain.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #07121f 0%, #0c2240 60%, #07121f 100%)",
          color: "#eef3f8",
          fontFamily: rtl ? "Plex Arabic" : "Archivo",
          position: "relative",
        }}
      >
        {/* green energy glow */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(34,196,122,0.35), rgba(34,196,122,0) 65%)",
          }}
        />
        {/* solar panel grid hint */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #22c47a, #3b8ce6)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="6 15 52 52">
            <path d="M56 26 L44 26 L26 56 L38 56 Z" fill="#eef3f8" />
            <path d="M8 26 L20 26 L38 56 L26 56 Z" fill="#22c47a" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo" }}>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6 }}>VERTUS</span>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 9, color: "#8d9bb0" }}>TECHNOLOGY</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: rtl ? "flex-end" : "flex-start",
            textAlign: rtl ? "right" : "left",
            maxWidth: 1000,
            alignSelf: rtl ? "flex-end" : "flex-start",
          }}
        >
          <Words
            text={eyebrow}
            rtl={rtl}
            style={{ fontSize: 26, fontWeight: rtl ? 700 : 500, color: "#3fd68f", marginBottom: 18 }}
          />
          <Words
            text={title}
            rtl={rtl}
            style={{ fontSize: titleSize, fontWeight: rtl ? 700 : 800, lineHeight: rtl ? 1.35 : 1.1, letterSpacing: rtl ? 0 : -1 }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Archivo",
            fontSize: 22,
            fontWeight: 500,
            color: "#8d9bb0",
          }}
        >
          <span>{company.signature}</span>
          <span style={{ color: "#eef3f8" }}>{host}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: extraBold, weight: 800, style: "normal" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
        { name: "Plex Arabic", data: arabic, weight: 700, style: "normal" },
      ],
    }
  );
}
