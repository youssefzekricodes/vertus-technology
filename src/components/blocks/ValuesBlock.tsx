"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Icon3DName } from "../Icon3D";
import { Icon3D } from "../Icon3D";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { SectionHeader } from "../SectionHeader";

type Value = { title: string; desc: string; icon: Icon3DName };
type Wire = { x1: number; y1: number; x2: number; y2: number; vertical: boolean };

const STEP_MS = 900; // current travels one wire, then lights the next card
const PAUSE_MS = 900;

/**
 * Values wired together like a circuit. Cables run card to card (row by row,
 * alternating direction). Current surges through each wire in turn and the
 * next card's indicator switches on as it arrives; a gentle flow keeps moving
 * in every wire in between.
 */
export function ValuesBlock({ title, lead, items }: { title: string; lead?: string; items: Value[] }) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const surges = useRef<(SVGLineElement | null)[]>([]);
  const [geo, setGeo] = useState<{ w: number; h: number; wires: Wire[]; order: number[] } | null>(null);

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    const pts = cards.current.map((el, i) => {
      const r = el!.getBoundingClientRect();
      const left = r.left - box.left;
      const top = r.top - box.top;
      return { i, x: left + r.width / 2, y: top + r.height / 2, left, right: left + r.width, top, bottom: top + r.height };
    });
    // rows, snaking: every other row runs the opposite way
    const rows: (typeof pts)[] = [];
    for (const p of pts) {
      const row = rows.find((r) => Math.abs(r[0].y - p.y) < 8);
      if (row) row.push(p);
      else rows.push([p]);
    }
    rows.sort((a, b) => a[0].y - b[0].y);
    rows.forEach((r, ri) => r.sort((a, b) => (ri % 2 === 0 ? a.x - b.x : b.x - a.x)));
    const order = rows.flat();

    const wires: Wire[] = [];
    for (let k = 1; k < order.length; k++) {
      const a = order[k - 1];
      const b = order[k];
      if (Math.abs(a.y - b.y) < 8) {
        const forward = b.x > a.x;
        wires.push({ x1: forward ? a.right : a.left, y1: a.y, x2: forward ? b.left : b.right, y2: b.y, vertical: false });
      } else {
        wires.push({ x1: a.x, y1: a.bottom, x2: b.x, y2: b.top, vertical: true });
      }
    }
    setGeo({ w: box.width, h: box.height, wires, order: order.map((p) => p.i) });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  // One orchestrated loop (Web Animations API): card → wire → card → …
  useEffect(() => {
    if (!geo || reduced) return;
    const n = geo.order.length;
    const cycle = n * STEP_MS + PAUSE_MS;
    const at = (ms: number) => ms / cycle;
    const anims: Animation[] = [];

    geo.order.forEach((cardIndex, k) => {
      const led = cards.current[cardIndex]?.querySelector<HTMLElement>("[data-led]");
      const card = cards.current[cardIndex];
      const on = k * STEP_MS;
      if (led) {
        anims.push(
          led.animate(
            [
              { opacity: 0.25, transform: "scale(1)", boxShadow: "0 0 0 0 rgba(34,196,122,0)", offset: 0 },
              { opacity: 0.25, transform: "scale(1)", boxShadow: "0 0 0 0 rgba(34,196,122,0)", offset: at(on) },
              { opacity: 1, transform: "scale(1.4)", boxShadow: "0 0 14px 4px rgba(34,196,122,0.6)", offset: at(on + 120) },
              { opacity: 0.55, transform: "scale(1)", boxShadow: "0 0 6px 1px rgba(34,196,122,0.3)", offset: at(on + 900) },
              { opacity: 0.25, transform: "scale(1)", boxShadow: "0 0 0 0 rgba(34,196,122,0)", offset: 1 },
            ],
            { duration: cycle, iterations: Infinity }
          )
        );
      }
      if (card) {
        anims.push(
          card.animate(
            [
              { borderColor: "var(--color-line)", offset: 0 },
              { borderColor: "var(--color-line)", offset: at(on) },
              { borderColor: "rgba(34,196,122,0.7)", offset: at(on + 150) },
              { borderColor: "var(--color-line)", offset: at(on + 1100) },
              { borderColor: "var(--color-line)", offset: 1 },
            ],
            { duration: cycle, iterations: Infinity }
          )
        );
      }
      // surge through the wire leaving this card
      const line = surges.current[k];
      if (line && k < n - 1) {
        const len = Math.hypot(geo.wires[k].x2 - geo.wires[k].x1, geo.wires[k].y2 - geo.wires[k].y1);
        const dash = Math.max(len * 0.7, 24);
        line.style.strokeDasharray = `${dash} ${len + dash}`;
        const start = on + 180;
        anims.push(
          line.animate(
            [
              { strokeDashoffset: dash, opacity: 0, offset: 0 },
              { strokeDashoffset: dash, opacity: 0, offset: at(start) },
              { strokeDashoffset: dash, opacity: 1, offset: at(start + 1) },
              { strokeDashoffset: -len, opacity: 1, offset: at(start + STEP_MS - 250) },
              { strokeDashoffset: -len, opacity: 0, offset: at(start + STEP_MS - 249) },
              { strokeDashoffset: -len, opacity: 0, offset: 1 },
            ],
            { duration: cycle, iterations: Infinity }
          )
        );
      }
    });
    return () => anims.forEach((a) => a.cancel());
  }, [geo, reduced]);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title={title} sub={lead} />
        <div ref={wrap} className="relative">
          <ul className="relative grid gap-x-16 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v, i) => (
              <li
                key={v.title}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="relative rounded-[1.4rem] border border-line bg-base-soft p-7 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-28px_rgba(10,26,46,0.35)]"
              >
                <span
                  data-led
                  aria-hidden="true"
                  className="absolute end-5 top-5 h-2.5 w-2.5 rounded-full bg-energy opacity-25"
                />
                <Icon3D name={v.icon} size={76} className="-ms-2 -mt-2 mb-3" />
                <h3 className="text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-mist">{v.desc}</p>
              </li>
            ))}
          </ul>

          {geo && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={geo.w}
              height={geo.h}
              viewBox={`0 0 ${geo.w} ${geo.h}`}
            >
              <defs>
                <filter id="vt-glow" x="-50%" y="-200%" width="200%" height="500%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {geo.wires.map((w, k) => (
                <g key={k}>
                  {/* sheath, core, gentle continuous flow, then the surge */}
                  <line x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} stroke="#9fb2c6" strokeOpacity="0.55" strokeWidth="11" strokeLinecap="round" />
                  <line x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} stroke="var(--color-base-soft)" strokeWidth="7" strokeLinecap="round" />
                  <line
                    x1={w.x1}
                    y1={w.y1}
                    x2={w.x2}
                    y2={w.y2}
                    stroke="#22c47a"
                    strokeOpacity={reduced ? 0.5 : 0.35}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={reduced ? undefined : "3 7"}
                    className={reduced ? undefined : "vt-flow"}
                  />
                  <line
                    ref={(el) => {
                      surges.current[k] = el;
                    }}
                    x1={w.x1}
                    y1={w.y1}
                    x2={w.x2}
                    y2={w.y2}
                    stroke="#22c47a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#vt-glow)"
                    style={{ opacity: 0 }}
                  />
                  {/* plugs where the cable meets each card */}
                  {[
                    [w.x1, w.y1],
                    [w.x2, w.y2],
                  ].map(([x, y], j) => (
                    <g key={j} transform={`translate(${x} ${y})${w.vertical ? " rotate(90)" : ""}`}>
                      <rect x="-9" y="-7" width="18" height="14" rx="4" fill="var(--color-base-soft)" stroke="#9fb2c6" strokeWidth="1.5" />
                      <rect x="-3.5" y="-2" width="7" height="4" rx="1.5" fill="#c98a4b" fillOpacity="0.75" />
                    </g>
                  ))}
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
