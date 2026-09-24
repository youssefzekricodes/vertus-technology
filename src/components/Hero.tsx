"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Dict } from "@/content/site";
import { Button } from "./Button";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero({ t }: { t: Dict }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"pending" | "high" | "low" | "static">("pending");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced || !webglAvailable()) {
      setMode("static");
      return;
    }
    const small = window.matchMedia("(max-width: 768px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    setMode(small || weak ? "low" : "high");
  }, [reduced]);

  // Pause the WebGL scene entirely once the hero has scrolled away.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cinematic exit: the scene dims and sinks while a grid of "network" lines
  // takes over — the sun's energy becoming the company's technology.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const gridOpacity = useTransform(scrollYProgress, [0.25, 0.8], [0, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      id="accueil"
      ref={ref}
      data-theme="dark"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-base"
    >
      {/* 3D scene / fallback */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { opacity: sceneOpacity, y: sceneY }}
        aria-hidden="true"
      >
        {mode !== "static" && mode !== "pending" && visible && <Hero3D quality={mode} />}
        {(mode === "static" || mode === "pending") && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_18%,rgba(246,195,92,0.32),rgba(240,168,27,0.08)_45%,transparent_75%)]" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-base-deep to-transparent" />
          </div>
        )}
      </motion.div>

      {/* the incoming technology grid */}
      <motion.div
        className="absolute inset-0 grid-lines"
        style={reduced ? { opacity: 0 } : { opacity: gridOpacity }}
        aria-hidden="true"
      />

      {/* readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-base/55 via-transparent to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-base to-transparent" aria-hidden="true" />

      {/* content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-accent tracking-[0.3em] text-xs md:text-sm mb-6"
          dir="ltr"
        >
          VERTUS TECHNOLOGY
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="display text-5xl md:text-7xl lg:text-8xl max-w-5xl"
        >
          {t.hero.tagline}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-7 max-w-xl text-mist text-base md:text-lg leading-relaxed"
        >
          {t.hero.sub}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="#solutions">{t.hero.ctaPrimary}</Button>
          <Button href="#contact" variant="ghost">
            {t.hero.ctaSecondary}
          </Button>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.a
        href="#societe"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-mist text-xs tracking-widest hover:text-accent transition-colors"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={reduced ? undefined : { opacity: contentOpacity }}
      >
        {t.hero.scrollHint}
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" />
          <circle cx="7" cy="7" r="2" fill="var(--color-solar)">
            <animate attributeName="cy" values="7;13;7" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.a>
    </section>
  );
}
