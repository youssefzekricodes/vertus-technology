import type { Dict, Locale } from "@/content/site";
import { company } from "@/content/site";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

const socials = [
  {
    name: "LinkedIn",
    href: company.social.linkedin,
    path: "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8.1h4.56V23H.22V8.1ZM8.34 8.1h4.37v2.03h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H8.34V8.1Z",
  },
  {
    name: "Facebook",
    href: company.social.facebook,
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.12 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z",
  },
  {
    name: "Instagram",
    href: company.social.instagram,
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-11.85a1.44 1.44 0 1 0 1.43 1.44 1.44 1.44 0 0 0-1.43-1.44Z",
  },
];

export function Footer({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <footer className="border-t border-line/60 bg-base-deep">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 text-mist">{t.footer.tagline}</p>
          <div className="mt-6 flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="text-mist hover:text-accent transition-colors data-cursor"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav aria-label={t.footer.navTitle}>
          <h3 className="text-sm font-semibold text-ink mb-5">{t.footer.navTitle}</h3>
          <ul className="space-y-3">
            {t.nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-mist hover:text-accent transition-colors text-sm">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-ink mb-5">{t.footer.contactTitle}</h3>
          <ul className="space-y-3 text-sm text-mist">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-accent transition-colors" dir="ltr">
                {company.email}
              </a>
            </li>
            <li dir="ltr" className={locale === "ar" ? "text-end" : ""}>
              <span className={locale === "ar" ? "inline-block" : ""}>{company.phone}</span>
            </li>
            <li>{locale === "ar" ? "تونس" : company.country}</li>
          </ul>
          <div className="mt-6">
            <LanguageSwitcher locale={locale} t={t} />
          </div>
        </div>
      </div>
      <div className="border-t border-line/40">
        <p className="mx-auto max-w-7xl px-5 md:px-8 py-6 text-xs text-mist">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
