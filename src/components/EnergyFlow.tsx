"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dict } from "@/content/site";
import { Icon3D, type Icon3DName } from "./Icon3D";
import { SectionHeader } from "./SectionHeader";

const stageIcons: Record<string, Icon3DName> = {
  sun: "sun",
  panels: "panel",
  inverter: "inverter",
  smart: "smart",
  home: "home",
  battery: "battery",
};

/** Animated energy link drawn between stages. */
function Link({ vertical = false }: { vertical?: boolean }) {
  return (
    <svg
      className={vertical ? "h-10 w-6 mx-auto" : "hidden md:block w-full h-6 flex-1 min-w-8"}
      viewBox={vertical ? "0 0 24 40" : "0 0 100 24"}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1={vertical ? 12 : 0}
        y1={vertical ? 0 : 12}
        x2={vertical ? 12 : 100}
        y2={vertical ? 40 : 12}
        stroke="var(--color-solar)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        className="motion-safe:animate-flow"
      />
    </svg>
  );
}

export function EnergyFlow({ t }: { t: Dict }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const steps = t.flow.steps;

  return (
    <section className="py-24 md:py-36 border-y border-line/50 bg-night/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={t.flow.title} sub={t.flow.sub} />

        {/* desktop: horizontal chain · mobile: vertical chain */}
        <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="contents">
              {i > 0 && (
                <>
                  <Link />
                  <div className="md:hidden">
                    <Link vertical />
                  </div>
                </>
              )}
              <button
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`group flex md:flex-col items-center gap-4 md:gap-3 rounded-2xl border px-5 py-4 md:px-6 md:py-5 transition-colors duration-300 data-cursor ${
                  active === i
                    ? "border-solar/70 bg-base-soft text-accent"
                    : "border-line/60 bg-base-soft/40 text-ink/80 hover:border-solar/40"
                }`}
              >
                <Icon3D
                  name={stageIcons[s.key]}
                  size={48}
                  className={`transition-transform duration-500 ease-out ${
                    active === i ? "scale-110 -translate-y-0.5" : "group-hover:scale-105"
                  }`}
                />
                <span className="text-sm font-semibold whitespace-nowrap">{s.title}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 min-h-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl text-mist leading-relaxed border-s-2 border-solar/60 ps-5"
            >
              <span className="block text-ink font-semibold mb-1.5">
                {steps[active].title}
              </span>
              {steps[active].desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
