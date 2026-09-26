"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../Reveal";

export function IntroBlock({
  title,
  text,
  image,
}: {
  title?: string;
  text: string[];
  image?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} id="presentation" className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-12 lg:grid-cols-2 items-center">
        <Reveal>
          {title && <h2 className="display text-3xl md:text-5xl">{title}</h2>}
          <div className="mt-7 space-y-5">
            {text.map((p, i) => (
              <p key={i} className="text-lg text-mist leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
        {image && (
          <Reveal className="relative rounded-2xl overflow-hidden border border-line/60">
            <motion.div className="relative aspect-8/5" style={reduced ? undefined : { y, scale: 1.1 }}>
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </motion.div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
