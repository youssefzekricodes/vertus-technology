import { Archivo, IBM_Plex_Sans_Arabic } from "next/font/google";
import type { Locale } from "@/content/types";
import { getUi } from "@/content/ui";
import { path } from "@/lib/routes";
import { themeScript } from "@/lib/theme";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";
import "./globals.css";

// One variable Latin family + two Arabic weights: limited font payload.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const ui = getUi(locale);
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme="dark"
      className={`${archivo.variable} ${plexArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-energy focus:px-5 focus:py-2.5 focus:text-on-energy"
          >
            {ui.a11y.skip}
          </a>
          <Navbar ui={ui} locale={locale} />
          <main id="main">{children}</main>
          <Footer ui={ui} locale={locale} />
          <FloatingContact ui={ui} />
          <CookieConsent
            text={ui.cookies.text}
            accept={ui.cookies.accept}
            decline={ui.cookies.decline}
            more={ui.cookies.more}
            privacyHref={path(locale, "privacy")}
          />
        </Providers>
      </body>
    </html>
  );
}
