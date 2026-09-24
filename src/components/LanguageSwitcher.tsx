import Link from "next/link";
import type { Dict, Locale } from "@/content/site";

export function LanguageSwitcher({ locale, t }: { locale: Locale; t: Dict }) {
  const target = locale === "ar" ? "/" : "/ar";
  return (
    <Link
      href={target}
      aria-label={t.a11y.switchLang}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold tracking-wider text-ink/80 hover:border-solar hover:text-accent transition-colors data-cursor"
    >
      <span aria-hidden="true" className={locale === "fr" ? "text-accent" : ""}>FR</span>
      <span aria-hidden="true" className="text-line">/</span>
      <span aria-hidden="true" className={locale === "ar" ? "text-accent" : ""}>AR</span>
    </Link>
  );
}
