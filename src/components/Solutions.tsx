"use client";

import { useRef } from "react";
import type { Dict } from "@/content/site";
import { Icon3D, type Icon3DName } from "./Icon3D";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

function SolutionCard({
  icon,
  index,
  title,
  desc,
}: {
  icon: Icon3DName;
  index: number;
  title: string;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt, pointer devices only
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative h-full rounded-2xl border border-line/60 bg-base-soft/50 p-7 md:p-8 transition-[border-color,background,transform] duration-300 hover:border-solar/50 hover:bg-base-soft will-change-transform data-cursor"
    >
      <div className="flex items-start justify-between">
        <Icon3D
          name={icon}
          size={72}
          className="-ms-2 -mt-2 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-105"
        />
        <span className="text-sm text-line font-semibold tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-7 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-mist leading-relaxed">{desc}</p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-solar/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
}

export function Solutions({ t }: { t: Dict }) {
  return (
    <section id="solutions" className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={t.solutions.title} sub={t.solutions.sub} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none">
          {t.solutions.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.08}>
              <SolutionCard icon={s.icon as Icon3DName} index={i} title={s.title} desc={s.desc} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
