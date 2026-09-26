import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { whatsappHref } from "@/content/company";
import { path } from "@/lib/routes";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

export function CTA({ title, text, ui, locale }: { title: string; text?: string; ui: Ui; locale: Locale }) {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      {/* cinematic solar backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_115%,rgba(59,140,230,0.45),rgba(34,196,122,0.12)_45%,transparent_75%)]"
      />
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={(i * 37) % 100} cy={100 - ((i * 23) % 60)} r="0.35" fill="#3fd68f">
            <animate
              attributeName="cy"
              values={`${100 - ((i * 23) % 60)};${30 - ((i * 7) % 20)}`}
              dur={`${7 + (i % 5)}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;0.9;0" dur={`${7 + (i % 5)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="display text-4xl md:text-6xl">{title}</h2>
          {text && <p className="mt-7 text-lg text-mist leading-relaxed max-w-2xl mx-auto">{text}</p>}
          <div className="mt-11 flex flex-wrap justify-center gap-4">
            <Button href={path(locale, "study")} track="cta_study_click">{ui.cta.study}</Button>
            <Button href={whatsappHref(ui.contact.whatsappText)} variant="ghost" external track="whatsapp_click">
              {ui.cta.expert}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
