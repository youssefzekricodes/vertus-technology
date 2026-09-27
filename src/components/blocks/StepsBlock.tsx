"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Item } from "@/content/types";
import { SectionHeader } from "../SectionHeader";

/** A step node that switches on when the energy line reaches it. */
function Node({ index, count, progress, reduced }: { index: number; count: number; progress: MotionValue<number>; reduced: boolean }) {
  const at = count > 1 ? index / (count - 1) : 0;
  const on = useTransform(progress, [Math.max(at - 0.04, 0), at + 0.001], [0, 1]);
  return (
    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-base-soft text-xs font-semibold text-mist tabular-nums" dir="ltr">
      {String(index + 1).padStart(2, "0")}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center rounded-full bg-energy text-on-energy shadow-[0_0_0_5px_rgba(34,196,122,0.18)]"
        style={{ opacity: reduced ? 1 : on }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
    </span>
  );
}

/**
 * The method as a power line: horizontal on large screens, vertical on phones.
 * The line fills with energy as you scroll and each step switches on in turn.
 */
export function StepsBlock({ title, lead, steps }: { title: string; lead?: string; steps: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const list = steps.map((s) => (typeof s === "string" ? { title: s } : s));
  const fill = reduced ? 1 : scrollYProgress;

  return (
    <section className="bg-base-soft/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={title} sub={lead} />
        <ol
          ref={ref}
          className="relative grid list-none gap-9 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-4"
          style={{ ["--n" as string]: list.length }}
        >
          {/* track: vertical on phones, horizontal on large screens */}
          <span aria-hidden="true" className="absolute start-[17px] top-4 bottom-4 w-0.5 rounded bg-line lg:hidden" />
          <motion.span
            aria-hidden="true"
            className="absolute start-[17px] top-4 bottom-4 w-0.5 origin-top rounded bg-gradient-to-b from-tech to-energy lg:hidden"
            style={{ scaleY: fill }}
          />
          <span aria-hidden="true" className="absolute inset-x-[calc(100%/(2*var(--n)))] top-[17px] hidden h-0.5 rounded bg-line lg:block" />
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-[calc(100%/(2*var(--n)))] top-[17px] hidden h-0.5 origin-left rounded bg-gradient-to-r from-tech to-energy lg:block rtl:origin-right rtl:bg-gradient-to-l"
            style={{ scaleX: fill }}
          />

          {list.map((s, i) => (
            <li key={s.title} className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center">
              <Node index={i} count={list.length} progress={scrollYProgress} reduced={reduced} />
              <div className="pt-1.5 lg:pt-0">
                <h3 className="text-[1.05rem] font-semibold leading-snug lg:text-[1rem]">{s.title}</h3>
                {s.desc && <p className="mt-1.5 max-w-lg leading-relaxed text-mist lg:text-sm">{s.desc}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
