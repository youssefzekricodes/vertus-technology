import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { whatsappHref } from "@/content/company";
import { path } from "@/lib/routes";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

/** Break the title after its question mark (French "?" or Arabic "؟"). */
function titleLines(title: string): string[] {
  const m = title.match(/^(.*?[?؟])\s*(.+)$/);
  return m ? [m[1], m[2]] : [title];
}

/**
 * Closing call to action: a deep-navy solar panel with a band of sunlight
 * slowly sweeping across its cells.
 */
export function CTA({ title, text, ui, locale }: { title: string; text?: string; ui: Ui; locale: Locale }) {
  const lines = titleLines(title);
  return (
    <section className="px-3 py-16 md:px-6 md:py-24">
      <div data-theme="dark" className="cta-panel relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0a1f3d]">
        {/* photovoltaic cells */}
        <div aria-hidden="true" className="cta-cells absolute inset-0" />
        {/* sunlight sweeping across the glass */}
        <div aria-hidden="true" className="cta-sweep absolute inset-y-0 -start-1/2 w-[70%]" />
        {/* warm sun glow in the corner + depth vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_88%_0%,rgba(255,210,63,0.28),transparent_70%),radial-gradient(ellipse_90%_70%_at_50%_120%,rgba(10,31,61,0.95),transparent_70%)] rtl:bg-[radial-gradient(ellipse_45%_60%_at_12%_0%,rgba(255,210,63,0.28),transparent_70%),radial-gradient(ellipse_90%_70%_at_50%_120%,rgba(10,31,61,0.95),transparent_70%)]"
        />

        <div className="relative px-6 py-20 text-center md:px-12 md:py-28">
          <Reveal>
            <h2 className="display mx-auto max-w-6xl text-[2rem] leading-[1.1] text-white md:text-5xl xl:text-[3.5rem]">
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </h2>
            {text && <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/75">{text}</p>}
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <Button href={path(locale, "study")} track="cta_study_click">
                {ui.cta.study}
              </Button>
              <Button
                href={whatsappHref(ui.contact.whatsappText)}
                variant="ghost"
                external
                track="whatsapp_click"
                className="!border-white/40 !bg-white/10 !text-white hover:!border-white hover:!bg-white/20"
              >
                {ui.cta.expert}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
