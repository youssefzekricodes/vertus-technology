"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { otherLocalePath } from "@/lib/routes";

/** Switches language while staying on the equivalent page. */
export function LanguageSwitcher({ locale, ui }: { locale: Locale; ui: Ui }) {
  const pathname = usePathname() || "/";
  return (
    <Link
      href={otherLocalePath(locale, pathname)}
      hrefLang={locale === "ar" ? "fr" : "ar"}
      aria-label={ui.a11y.switchLang}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold tracking-wider text-ink/80 hover:border-energy hover:text-accent transition-colors"
    >
      <span aria-hidden="true" className={locale === "fr" ? "text-accent" : ""}>FR</span>
      <span aria-hidden="true" className="text-line">/</span>
      <span aria-hidden="true" className={locale === "ar" ? "text-accent" : ""}>AR</span>
    </Link>
  );
}
