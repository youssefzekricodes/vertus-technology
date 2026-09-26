"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Item } from "@/content/types";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

/** Numbered process with an energy line that fills as you scroll. */
export function StepsBlock({ title, lead, steps }: { title: string; lead?: string; steps: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const list = steps.map((s) => (typeof s === "string" ? { title: s } : s));

  return (
    <section className="py-20 md:py-28 border-t border-line/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 self-start">
          <SectionHeader title={title} sub={lead} />
        </div>
        <ol ref={ref} className="relative ms-4 list-none">
          <span className="absolute start-0 top-2 bottom-2 w-px bg-line/70" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            className="absolute start-0 top-2 bottom-2 w-px origin-top bg-energy"
            style={reduced ? undefined : { scaleY: scale }}
          />
          {list.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.03} className="relative ps-12 pb-9 last:pb-0">
              <span
                aria-hidden="true"
                dir="ltr"
                className="absolute start-0 top-0 -translate-x-1/2 rtl:translate-x-1/2 grid h-8 w-8 place-items-center rounded-full border border-energy/60 bg-base text-xs font-semibold text-accent tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="pt-1 text-lg font-semibold">{s.title}</h3>
              {s.desc && <p className="mt-1.5 text-mist leading-relaxed max-w-lg">{s.desc}</p>}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
