import { Reveal } from "../Reveal";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";

export function TableBlock({ title, head, rows }: { title: string; head: [string, string]; rows: [string, string][] }) {
  return (
    <Section tone="soft">
      <SectionHeader title={title} />
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line/60">
          <table className="w-full text-start">
            <thead className="bg-base-soft">
              <tr>
                {head.map((h) => (
                  <th key={h} scope="col" className="px-6 py-4 text-start text-sm font-semibold text-mist">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b]) => (
                <tr key={a} className="border-t border-line/50">
                  <th scope="row" className="px-6 py-5 text-start align-top font-semibold w-2/5">
                    {a}
                  </th>
                  <td className="px-6 py-5 text-mist">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
