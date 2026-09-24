import type { Dict } from "@/content/site";
import { Reveal } from "./Reveal";

export function Founder({ t }: { t: Dict }) {
  return (
    <section className="py-24 md:py-36 border-t border-line/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20 items-start">
        <Reveal>
          <p className="text-accent text-sm font-semibold">{t.founder.role}</p>
          <h2 className="display-sub mt-3 text-4xl md:text-6xl">{t.founder.name}</h2>
          <div className="mt-8 h-px w-24 bg-solar" aria-hidden="true" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg md:text-xl text-mist leading-relaxed max-w-2xl">{t.founder.bio}</p>
          <blockquote className="mt-10 border-s-2 border-solar/60 ps-6 text-xl md:text-2xl display-sub text-ink/90 max-w-2xl">
            “{t.founder.quote}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
