import type { Dict } from "@/content/site";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

export function CTA({ t }: { t: Dict }) {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      {/* cinematic solar backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_115%,rgba(246,195,92,0.5),rgba(240,168,27,0.14)_45%,transparent_75%)]"
      />
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={(i * 37) % 100} cy={100 - ((i * 23) % 60)} r="0.35" fill="#f6c35c">
            <animate
              attributeName="cy"
              values={`${100 - ((i * 23) % 60)};${30 - ((i * 7) % 20)}`}
              dur={`${7 + (i % 5)}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;0.9;0" dur={`${7 + (i % 5)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="display text-4xl md:text-6xl">{t.cta.title}</h2>
          <p className="mt-7 text-lg text-mist leading-relaxed max-w-2xl mx-auto">{t.cta.body}</p>
          <div className="mt-11 flex flex-wrap justify-center gap-4">
            <Button href="#contact">{t.cta.primary}</Button>
            <Button href="#contact" variant="ghost">
              {t.cta.secondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
