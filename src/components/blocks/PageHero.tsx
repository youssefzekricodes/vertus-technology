import Link from "next/link";
import type { Page } from "@/content/types";

export type Crumb = { href?: string; label: string };

export function PageHero({ hero, crumbs, crumbLabel }: { hero: Page["hero"]; crumbs: Crumb[]; crumbLabel: string }) {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24 border-b border-line/50">
      <div className="absolute inset-0 grid-lines opacity-70" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -top-40 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(59,140,230,0.22),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <nav aria-label={crumbLabel} className="mb-8 text-sm text-mist">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-line">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink/80">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {hero.eyebrow && <p className="text-accent text-sm font-semibold mb-4">{hero.eyebrow}</p>}
        <h1 className="display text-4xl sm:text-5xl md:text-6xl max-w-4xl">{hero.h1}</h1>
        {hero.lead && <p className="mt-7 max-w-2xl text-lg md:text-xl text-mist leading-relaxed">{hero.lead}</p>}
      </div>
    </section>
  );
}
