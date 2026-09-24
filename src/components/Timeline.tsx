"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Dict } from "@/content/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

export function Timeline({ t }: { t: Dict }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="expertise" className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={t.expertise.title} sub={t.expertise.sub} />

        <ol ref={ref} className="relative ms-4 md:ms-0 md:max-w-3xl md:mx-auto list-none">
          {/* base rail + energy fill */}
          <span className="absolute start-0 top-2 bottom-2 w-px bg-line/70" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            className="absolute start-0 top-2 bottom-2 w-px origin-top bg-solar"
            style={reduced ? undefined : { scaleY: lineScale }}
          />
          {t.expertise.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.05} className="relative ps-10 md:ps-14 pb-12 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute start-0 top-1 -translate-x-1/2 rtl:translate-x-1/2 grid h-8 w-8 place-items-center rounded-full border border-solar/60 bg-base text-xs font-semibold text-accent tabular-nums"
                dir="ltr"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-mist leading-relaxed max-w-lg">{s.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
