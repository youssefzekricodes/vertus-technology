import type { Dict } from "@/content/site";
import { Reveal } from "./Reveal";
import { Icon3D, type Icon3DName } from "./Icon3D";

const icons: Icon3DName[] = ["gear", "shield", "bulb", "bubble"];

export function WhyVertus({ t }: { t: Dict }) {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20 items-start">
        <Reveal className="lg:sticky lg:top-28">
          <h2 className="display-sub text-3xl md:text-5xl">{t.why.title}</h2>
          <div className="mt-8 h-px w-24 bg-solar" aria-hidden="true" />
        </Reveal>

        {/* staggered editorial column instead of a 4-up grid */}
        <div className="space-y-6">
          {t.why.items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.06}
              className={i % 2 === 1 ? "md:ms-16" : "md:me-16"}
            >
              <article className="group flex items-start gap-6 rounded-2xl border border-line/60 bg-base-soft/40 p-7 hover:border-solar/40 transition-colors duration-300">
                <Icon3D
                  name={icons[i % icons.length]}
                  size={60}
                  className="shrink-0 -my-1 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105"
                />
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2.5 text-mist leading-relaxed">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
