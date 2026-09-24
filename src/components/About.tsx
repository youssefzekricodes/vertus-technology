"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Dict } from "@/content/site";
import { Reveal } from "./Reveal";
import Image from "next/image";

export function About({ t }: { t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="py-24 md:py-36 border-t border-line/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="display text-4xl md:text-6xl">{t.about.title}</h2>
          <p className="mt-7 text-lg text-mist leading-relaxed">{t.about.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 items-center">
          <Reveal className="relative rounded-2xl overflow-hidden border border-line/60">
            <motion.div
              className="relative aspect-8/5"
              style={reduced ? undefined : { y, scale: 1.12 }}
            >
              <Image
                src={t.about.image}
                alt={t.about.imageAlt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </Reveal>
          <div className="space-y-8">
            {t.about.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="border-s-2 border-solar/60 ps-6">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-mist leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
