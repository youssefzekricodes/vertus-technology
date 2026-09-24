"use client";

import { useEffect, useRef } from "react";

/** Small glowing dot that follows the pointer and grows over interactive elements. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = ref.current;
    if (!dot) return;

    let raf = 0;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as Element | null;
      const interactive = el?.closest("a, button, [role=button], input, select, textarea, .data-cursor");
      dot.classList.toggle("is-active", !!interactive);
    };
    const loop = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden="true" />;
}
