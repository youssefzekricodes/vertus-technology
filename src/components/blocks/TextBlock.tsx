import Link from "next/link";
import type { Locale, PageKey } from "@/content/types";
import { path } from "@/lib/routes";
import { Reveal } from "../Reveal";

/**
 * Editorial section: text on one side; on the other, the related topics laid
 * out as the cells of a photovoltaic panel (each cell links to its page).
 */
export function TextBlock({
  title,
  text,
  tags,
  locale,
}: {
  title: string;
  text: string[];
  tags?: { label: string; href: PageKey }[];
  locale: Locale;
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="display-sub text-3xl md:text-[2.6rem] md:leading-[1.1]">{title}</h2>
          <div className="mt-8 max-w-[62ch] space-y-5 text-[1rem] leading-relaxed text-mist md:text-[1.06rem]">
            {text.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        {tags && tags.length > 0 && (
          <Reveal delay={0.1}>
            {/* aluminium frame → glass → cells */}
            <div className="rounded-[1.6rem] bg-gradient-to-br from-[#d9e1ea] to-[#aebccb] p-2 shadow-[0_30px_60px_-30px_rgba(12,34,64,0.55)]">
              <ul className="grid grid-cols-2 gap-1.5 rounded-[1.15rem] bg-[#0b2a5c] p-1.5 sm:grid-cols-3">
                {tags.map((t) => (
                  <li key={t.label}>
                    <Link
                      href={path(locale, t.href)}
                      className="group relative flex h-full min-h-[4.25rem] items-end overflow-hidden rounded-lg bg-gradient-to-br from-[#2f6fcf] to-[#163f86] p-3 text-sm font-medium leading-tight text-white transition-colors duration-300 hover:from-[#22c47a] hover:to-[#0f8a4a] focus-visible:from-[#22c47a] focus-visible:to-[#0f8a4a]"
                    >
                      {/* busbars + a glint, like a real cell */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_32%,rgba(255,255,255,0.14)_32.5%,transparent_33.5%,transparent_65.5%,rgba(255,255,255,0.14)_66%,transparent_67%)]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-y-4 -start-1/2 w-1/3 rotate-12 bg-white/15 blur-md transition-transform duration-700 group-hover:translate-x-[320%] rtl:group-hover:-translate-x-[320%]"
                      />
                      <span className="relative">{t.label}</span>
                    </Link>
                  </li>
                ))}
                {/* blank cells complete the panel on 2- and 3-column layouts */}
                {Array.from({ length: (6 - (tags.length % 6)) % 6 }).map((_, i) => (
                  <li
                    key={`blank-${i}`}
                    aria-hidden="true"
                    className={`min-h-[4.25rem] rounded-lg bg-gradient-to-br from-[#2a64bd] to-[#143a7c] opacity-80 ${
                      (tags.length + i) % 2 === 1 || i < (2 - (tags.length % 2)) % 2 ? "" : "hidden sm:block"
                    }`}
                  />
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
