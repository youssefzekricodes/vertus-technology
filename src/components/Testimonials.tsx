"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/content/site";
import { SectionHeader } from "./SectionHeader";

export function Testimonials({ t }: { t: Dict }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const items = t.testimonials.items;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild?.clientWidth ?? 1;
      setIndex(Math.round(Math.abs(el.scrollLeft) / (w + 24)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const w = (el.firstElementChild?.clientWidth ?? 0) + 24;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollTo({ left: (rtl ? -1 : 1) * i * w, behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-36 border-t border-line/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={t.testimonials.title} />
      </div>
      <ul
        ref={trackRef}
        className="snap-row flex gap-6 overflow-x-auto px-5 md:px-[max(1.25rem,calc((100vw-80rem)/2+2rem))] pb-2"
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="w-[85vw] sm:w-100 shrink-0 rounded-2xl border border-line/60 bg-base-soft/40 p-8 flex flex-col"
          >
            <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true" className="text-solar/70 rtl:-scale-x-100">
              <path d="M0 22V13.6C0 5.8 4.5 1 12 0l1.3 3.4C8.5 4.8 6.4 7.2 6.2 10H12v12H0Zm16 0V13.6C16 5.8 20.5 1 28 0l-1.3 3.4" fill="currentColor" opacity="0.35" />
            </svg>
            <blockquote className="mt-5 text-ink/90 leading-relaxed grow">
              “{item.quote}”
            </blockquote>
            <footer className="mt-7 border-t border-line/50 pt-5">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-mist mt-1">
                {item.org} · {item.city}
              </p>
              <p className="text-xs text-accent mt-1.5">{item.type}</p>
            </footer>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center gap-2.5" role="tablist" aria-label={t.testimonials.title}>
        {items.map((item, i) => (
          <button
            key={item.name}
            aria-label={`${t.a11y.goToSlide} ${i + 1}`}
            aria-current={index === i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 data-cursor ${
              index === i ? "w-7 bg-solar" : "w-2 bg-line hover:bg-mist"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
