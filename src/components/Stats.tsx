import type { Dict } from "@/content/site";
import { AnimatedCounter } from "./AnimatedCounter";
import { Reveal } from "./Reveal";

export function Stats({ t }: { t: Dict }) {
  return (
    <section className="relative border-y border-line/50 bg-base-soft/40">
      <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
      <dl className="relative mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {t.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className={i > 0 ? "lg:border-s lg:border-line/50 lg:ps-8" : ""}>
              <dd className="display text-4xl md:text-5xl text-accent">
                <AnimatedCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={"decimals" in s ? (s.decimals as number) : 0}
                />
              </dd>
              <dt className="mt-3 text-sm text-mist">{s.label}</dt>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
