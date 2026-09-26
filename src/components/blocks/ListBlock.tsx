import Link from "next/link";
import type { Item, Locale } from "@/content/types";
import { path } from "@/lib/routes";
import { Icon3D } from "../Icon3D";
import { Icon } from "../Icons";
import { Reveal } from "../Reveal";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";

function normalize(item: Item) {
  return typeof item === "string" ? { title: item } : item;
}

export function ListBlock({
  title,
  lead,
  items,
  variant = "checks",
  locale,
  moreLabel,
}: {
  title: string;
  lead?: string;
  items: Item[];
  variant?: "cards" | "checks";
  locale: Locale;
  moreLabel: string;
}) {
  const list = items.map(normalize);

  if (variant === "cards") {
    return (
      <Section tone="soft">
        <SectionHeader title={title} sub={lead} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((it, i) => {
            const inner = (
              <>
                {it.icon && <Icon3D name={it.icon} size={68} className="-ms-2 -mt-2 mb-4" />}
                <h3 className="text-lg font-semibold">{it.title}</h3>
                {it.desc && <p className="mt-2.5 text-sm text-mist leading-relaxed">{it.desc}</p>}
                {it.href && (
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    {moreLabel}
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                )}
              </>
            );
            const cls =
              "group block h-full rounded-2xl border border-line/60 bg-base-soft/70 p-7 transition-colors duration-300 hover:border-energy/60";
            return (
              <Reveal as="li" key={it.title} delay={(i % 3) * 0.06}>
                {it.href ? (
                  <Link href={path(locale, it.href)} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Section>
    );
  }

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeader title={title} sub={lead} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((it, i) => (
            <Reveal as="li" key={it.title} delay={(i % 2) * 0.05}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-line/60 bg-base-soft/40 p-5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-energy/15 text-accent">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium leading-snug">{it.title}</p>
                  {it.desc && <p className="mt-1.5 text-sm text-mist">{it.desc}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
