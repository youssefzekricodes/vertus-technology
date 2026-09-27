"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Locale, Page } from "@/content/types";
import type { Ui } from "@/content/ui";
import { path } from "@/lib/routes";
import { whatsappHref } from "@/content/company";
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

/**
 * A soft cumulus cloud built from a few overlapping puffs. It drifts on its own
 * and shifts against the cursor — bigger (nearer) clouds move more (parallax).
 */
function Cloud({
  top,
  left,
  scale,
  speed,
  opacity,
  mx,
  my,
}: {
  top: string;
  left: string;
  scale: number;
  speed: number;
  opacity: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useTransform(mx, (v) => v * -38 * scale);
  const y = useTransform(my, (v) => v * -16 * scale);
  return (
    <motion.div className="absolute" style={{ top, left, x, y }}>
      <div
        className="cloud"
        style={{ position: "relative", width: 260 * scale, height: 90 * scale, opacity, ["--cloud-speed" as string]: `${speed}s` }}
      >
        <span style={{ left: "0%", top: "38%", width: "46%", height: "62%" }} />
        <span style={{ left: "20%", top: "8%", width: "42%", height: "86%" }} />
        <span style={{ left: "44%", top: "0%", width: "38%", height: "96%" }} />
        <span style={{ left: "62%", top: "30%", width: "38%", height: "68%" }} />
      </div>
    </motion.div>
  );
}

const CLOUDS = [
  { top: "9%", left: "6%", scale: 1.25, speed: 70, opacity: 0.95 },
  { top: "20%", left: "58%", scale: 0.85, speed: 55, opacity: 0.8 },
  { top: "5%", left: "38%", scale: 0.6, speed: 85, opacity: 0.7 },
  { top: "28%", left: "-4%", scale: 0.7, speed: 62, opacity: 0.65 },
  { top: "14%", left: "80%", scale: 1, speed: 75, opacity: 0.85 },
];

export function Hero({ hero, ui, locale }: { hero: Page["hero"]; ui: Ui; locale: Locale }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"pending" | "high" | "low" | "static">("pending");
  const [visible, setVisible] = useState(true);

  // Cursor position (-1…1), smoothed by a spring for silky parallax.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mx = useSpring(pointerX, { stiffness: 45, damping: 18, mass: 0.8 });
  const my = useSpring(pointerY, { stiffness: 45, damping: 18, mass: 0.8 });
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, pointerX, pointerY]);

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
    <>
    <section
      id="accueil"
      ref={ref}
      data-theme="light"
      className="hero-sky relative h-[100svh] min-h-[620px] overflow-hidden"
    >
      {/* CSS clouds for the still version; the 3D scene has its own 360° clouds */}
      {(mode === "static" || mode === "pending") && (
        <div className="absolute inset-0" aria-hidden="true">
          {CLOUDS.map((c, i) => (
            <Cloud key={i} {...c} mx={mx} my={my} />
          ))}
        </div>
      )}
      {/* 3D scene / fallback */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { opacity: sceneOpacity, y: sceneY }}
        aria-hidden="true"
      >
        {/* Stays mounted once loaded (no rebuild when scrolling back); only the
            render loop pauses while the hero is off-screen. */}
        {mode !== "static" && mode !== "pending" && <Hero3D quality={mode} paused={!visible} />}
        {(mode === "static" || mode === "pending") && (
          <div className="absolute inset-0">
            {/* sun */}
            <div className="absolute end-[12%] top-[9%] h-36 w-36 rounded-full bg-[radial-gradient(circle,#ffe277_0%,#ffe277_78%,#ffd23f_80%)] shadow-[0_0_50px_14px_rgba(255,210,63,0.55),0_0_140px_50px_rgba(255,200,60,0.25)]" />
            {/* fields */}
            <div className="absolute bottom-0 inset-x-0 h-[30%] bg-gradient-to-b from-[#8fbf72] via-[#6fa257] to-[#5b8f47]" />
          </div>
        )}
      </motion.div>

      {/* the incoming technology grid */}
      <motion.div
        className="absolute inset-0 grid-lines"
        style={reduced ? { opacity: 0 } : { opacity: gridOpacity }}
        aria-hidden="true"
      />

      {/* readability: a soft haze of light behind the headline */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_48%_36%_at_50%_48%,rgba(240,248,255,0.78),rgba(240,248,255,0.35)_55%,transparent_80%)]"
        aria-hidden="true"
      />

      {/* content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[14vh] pt-16 text-center"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-accent shadow-[0_8px_24px_-12px_rgba(12,34,64,0.35)] backdrop-blur-md md:text-sm"
          dir="ltr"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="display max-w-5xl text-4xl text-[#0a1f3d] drop-shadow-[0_2px_18px_rgba(255,255,255,0.65)] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {hero.h1}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-7 max-w-xl font-medium leading-relaxed text-[#27405f] md:text-lg"
        >
          {hero.lead}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href={path(locale, "study")} track="cta_study_click">
            {ui.cta.study}
          </Button>
          <Button
            href={whatsappHref(ui.contact.whatsappText)}
            variant="ghost"
            external
            track="whatsapp_click"
            className="!border-white !bg-white/90 !text-[#0a1f3d] shadow-[0_10px_30px_-12px_rgba(10,31,61,0.45)] hover:!bg-white"
          >
            {ui.cta.expert}
          </Button>
        </motion.div>
        {hero.message && (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-8 rounded-full bg-[#0a1f3d]/80 px-5 py-2 text-sm tracking-wide text-white backdrop-blur-md md:text-[1rem]"
          >
            {hero.message}
          </motion.p>
        )}
      </motion.div>

      {/* scroll hint */}
      <motion.a
        href="#presentation"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs font-medium tracking-widest text-white drop-shadow hover:text-[#eafff4] transition-colors"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={reduced ? undefined : { opacity: contentOpacity }}
      >
        {ui.cta.more}
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" />
          <circle cx="7" cy="7" r="2" fill="var(--color-energy)">
            <animate attributeName="cy" values="7;13;7" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.a>
    </section>
    </>
  );
}
