"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/a11y";
import type { Dict } from "@/content/site";
import { SectionHeader } from "./SectionHeader";
import { Icon } from "./Icons";

// Loop mode needs comfortably more slides than are visible at once.
const MIN_LOOP_SLIDES = 8;

export function Projects({ t }: { t: Dict }) {
  const [filter, setFilter] = useState("all");
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reduced = useReducedMotion();

  const items = t.projects.items.filter(
    (p) => filter === "all" || p.type === filter,
  );
  const canLoop = items.length > 1;

  const slides = useMemo(() => {
    if (!canLoop) return items;
    const out = [...items];
    while (out.length < MIN_LOOP_SLIDES) out.push(...items);
    return out;
  }, [items, canLoop]);

  return (
    <section
      id="projets"
      className="py-24 md:py-36 border-y border-line/50 bg-base-soft/30"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeader title={t.projects.title} sub={t.projects.sub} />
        </div>

        <div
          className="flex flex-wrap gap-2.5 mb-10"
          role="group"
          aria-label={t.projects.title}
        >
          {t.projects.filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-full border px-4.5 py-2 text-sm transition-colors duration-300 data-cursor ${
                filter === f.key
                  ? "border-solar bg-solar/10 text-accent"
                  : "border-line/70 text-mist hover:border-solar/50 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Swiper
          // Remount per filter: loop clones are built once at init.
          key={`${filter}-${t.dir}`}
          dir={t.dir}
          modules={[Autoplay, A11y]}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          loop={canLoop}
          speed={700}
          grabCursor
          spaceBetween={24}
          slidesPerView={1.12}
          breakpoints={{
            640: { slidesPerView: 1.6 },
            1024: { slidesPerView: 2.3 },
            1440: { slidesPerView: 2.6 },
          }}
          autoplay={
            canLoop && !reduced
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          a11y={{
            prevSlideMessage: t.a11y.prev,
            nextSlideMessage: t.a11y.next,
          }}
          className="!px-5 md:!px-[max(1.25rem,calc((100vw-80rem)/2+2rem))] !pb-4"
        >
          {slides.map((p, i) => (
            <SwiperSlide
              key={`${p.typeLabel}-${p.city}-${i}`}
              className="!h-auto"
            >
              <article className="group relative h-full rounded-2xl overflow-hidden border border-line/60 bg-base-soft/60 transition-colors duration-300 hover:border-solar/50">
                <div className="relative aspect-16/10 overflow-hidden bg-base-deep">
                  <Image
                    src={p.image}
                    alt={`${p.typeLabel} — ${p.city}`}
                    fill
                    sizes="(min-width: 1440px) 38vw, (min-width: 1024px) 43vw, (min-width: 640px) 62vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                  <span
                    className="absolute top-4 start-4 rounded-full glass border border-line/60 px-3 py-1 text-xs font-semibold text-ink"
                    dir="ltr"
                  >
                    {p.capacity}
                  </span>
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-lg font-semibold">{p.typeLabel}</h3>
                  <p className="mt-1 text-sm text-mist">
                    {p.city} · {t.projects.capacityLabel}
                  </p>
                  <p className="mt-4 text-sm text-mist leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        {canLoop && (
          <>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label={t.a11y.prev}
              className="absolute top-[34%] z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full glass border border-line/70 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-[border-color,color,transform] duration-300 hover:border-solar hover:text-accent active:scale-95 data-cursor start-3 md:start-6"
            >
              <Icon name="arrow" className="-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label={t.a11y.next}
              className="absolute top-[34%] z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full glass border border-line/70 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-[border-color,color,transform] duration-300 hover:border-solar hover:text-accent active:scale-95 data-cursor end-3 md:end-6"
            >
              <Icon name="arrow" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
