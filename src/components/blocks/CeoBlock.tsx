import type { Ui } from "@/content/ui";
import { Reveal } from "../Reveal";

/** "Mot du CEO" — message without name or portrait. */
export function CeoBlock({ ui }: { ui: Ui }) {
  return (
    <section className="py-20 md:py-28 border-t border-line/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20 items-start">
        <Reveal>
          <h2 className="display-sub text-4xl md:text-6xl">{ui.ceo.title}</h2>
          <div className="mt-8 h-px w-24 bg-energy" aria-hidden="true" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-5">
            {ui.ceo.body.map((p, i) => (
              <p key={i} className="text-lg md:text-xl text-mist leading-relaxed max-w-2xl">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="mt-10 border-s-2 border-energy/70 ps-6 max-w-2xl">
            <p className="text-xl md:text-2xl display-sub text-ink/90">“{ui.ceo.quote}”</p>
            <footer className="mt-4 text-sm text-mist">{ui.ceo.signature}</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
