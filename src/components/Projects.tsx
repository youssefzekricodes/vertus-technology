"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/a11y";
import type { Locale, Project } from "@/content/types";
import type { Ui } from "@/content/ui";
import { path } from "@/lib/routes";
import { SectionHeader } from "./SectionHeader";
import { Icon } from "./Icons";

// Loop mode needs comfortably more slides than are visible at once.
const MIN_LOOP_SLIDES = 8;

export function ProjectCard({ p, ui, detailed = false }: { p: Project; ui: Ui; detailed?: boolean }) {
  const l = ui.projects.labels;
  return (
    <article className="group relative h-full rounded-2xl overflow-hidden border border-line/60 bg-base-soft/70 transition-colors duration-300 hover:border-energy/50">
      <div className="relative aspect-16/10 overflow-hidden bg-base-deep">
        <Image
          src={p.image}
          alt={`${p.name} — ${p.city}`}
          fill
          sizes="(min-width: 1440px) 38vw, (min-width: 1024px) 43vw, (min-width: 640px) 62vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        <span className="absolute top-4 start-4 rounded-full glass border border-line/60 px-3 py-1 text-xs font-semibold text-ink" dir="ltr">
          {p.power}
        </span>
      </div>
      <div className="p-6 md:p-7">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="mt-1 text-sm text-mist">
          {p.city} · {p.type}
        </p>
        {detailed ? (
          <dl className="mt-5 grid gap-3 text-sm">
            <div>
              <dt className="text-mist">{l.sector}</dt>
              <dd>{p.sector}</dd>
            </div>
            <div>
              <dt className="text-mist">{l.problem}</dt>
              <dd className="leading-relaxed">{p.problem}</dd>
            </div>
            <div>
              <dt className="text-mist">{l.solution}</dt>
              <dd className="leading-relaxed">{p.solution}</dd>
            </div>
            {p.result && (
              <div>
                <dt className="text-mist">{l.result}</dt>
                <dd className="leading-relaxed">{p.result}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-mist leading-relaxed">{p.solution}</p>
        )}
      </div>
    </article>
  );
}

/** Home teaser: infinite auto-playing carousel linking to the full page. */
export function ProjectsCarousel({
  projects,
  ui,
  locale,
  title,
  lead,
}: {
  projects: Project[];
  ui: Ui;
  locale: Locale;
  title?: string;
  lead?: string;
}) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reduced = useReducedMotion();
  const canLoop = projects.length > 1;

  const slides = useMemo(() => {
    if (!canLoop) return projects;
    const out = [...projects];
    while (out.length < MIN_LOOP_SLIDES) out.push(...projects);
    return out;
  }, [projects, canLoop]);

  const arrow =
    "absolute top-[34%] z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full glass border border-line/70 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-[border-color,color,transform] duration-300 hover:border-energy hover:text-accent active:scale-95";

  return (
    <section className="py-20 md:py-28 border-t border-line/50 bg-base-soft/30">
      <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-wrap items-end justify-between gap-6">
        {title && <SectionHeader title={title} sub={lead} />}
        <Link href={path(locale, "projects")} className="mb-14 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
          {ui.cta.allProjects}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="relative">
        <Swiper
          key={ui.dir}
          dir={ui.dir}
          modules={[Autoplay, A11y]}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          loop={canLoop}
          speed={700}
          grabCursor
          spaceBetween={24}
          slidesPerView={1.12}
          breakpoints={{ 640: { slidesPerView: 1.6 }, 1024: { slidesPerView: 2.3 }, 1440: { slidesPerView: 2.6 } }}
          autoplay={canLoop && !reduced ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          a11y={{ prevSlideMessage: ui.a11y.prev, nextSlideMessage: ui.a11y.next }}
          className="!px-5 md:!px-[max(1.25rem,calc((100vw-80rem)/2+2rem))] !pb-4"
        >
          {slides.map((p, i) => (
            <SwiperSlide key={`${p.id}-${i}`} className="!h-auto">
              <ProjectCard p={p} ui={ui} />
            </SwiperSlide>
          ))}
        </Swiper>
        {canLoop && (
          <>
            <button type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label={ui.a11y.prev} className={`${arrow} start-3 md:start-6`}>
              <Icon name="arrow" className="-scale-x-100" />
            </button>
            <button type="button" onClick={() => swiperRef.current?.slideNext()} aria-label={ui.a11y.next} className={`${arrow} end-3 md:end-6`}>
              <Icon name="arrow" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/** Full projects page: filterable grid with the complete project sheet. */
export function ProjectsGrid({ projects, ui }: { projects: Project[]; ui: Ui }) {
  const [filter, setFilter] = useState("all");
  const items = projects.filter((p) => filter === "all" || p.segment === filter);
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap gap-2.5 mb-10" role="group" aria-label={ui.projects.filters[0].label}>
          {ui.projects.filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-full border px-4.5 py-2 text-sm transition-colors duration-300 ${
                filter === f.key ? "border-energy bg-energy/10 text-accent" : "border-line/70 text-mist hover:border-energy/50 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ul className="grid gap-6 md:grid-cols-2">
          {items.map((p) => (
            <li key={p.id}>
              <ProjectCard p={p} ui={ui} detailed />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
