import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";

export function FaqBlock({ title, items }: { title?: string; items: { q: string; a: string }[] }) {
  return (
    <Section>
      {title && <SectionHeader title={title} />}
      <div className="mx-auto max-w-3xl divide-y divide-line/60 rounded-2xl border border-line/60 bg-base-soft/40">
        {items.map((it) => (
          <details key={it.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold">
              <h2 className="text-[1rem] md:text-lg">{it.q}</h2>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 text-mist leading-relaxed">{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
