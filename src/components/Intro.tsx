import type { Dict } from "@/content/site";
import { Reveal } from "./Reveal";

export function Intro({ t }: { t: Dict }) {
  return (
    <section id="societe" className="relative py-28 md:py-40 overflow-hidden">
      {/* decorative energy line running through the section */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full text-solar/25 pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <path
          d="M-20 80 H 320 L 380 140 H 700 L 760 200 H 1020"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 6"
          className="motion-safe:animate-flow"
        />
        <circle cx="320" cy="80" r="3" fill="var(--color-solar)" opacity="0.6" />
        <circle cx="700" cy="140" r="3" fill="var(--color-solar)" opacity="0.6" />
      </svg>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-4xl">
          <h2 className="display text-4xl md:text-6xl lg:text-7xl">{t.intro.heading}</h2>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 max-w-2xl ms-auto">
          <p className="text-lg md:text-xl text-mist leading-relaxed">{t.intro.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
