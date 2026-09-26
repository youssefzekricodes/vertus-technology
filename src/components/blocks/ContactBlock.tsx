import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { company, telHref, whatsappHref } from "@/content/company";
import { path } from "@/lib/routes";
import { Button } from "../Button";
import { TrackedLink } from "../TrackedLink";
import { MapEmbed } from "./MapEmbed";

export function ContactBlock({ ui, locale }: { ui: Ui; locale: Locale }) {
  const c = ui.contact;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="flex flex-wrap gap-3">
            <Button href={path(locale, "study")} track="cta_study_click">
              {ui.cta.study}
            </Button>
            <Button href={whatsappHref(c.whatsappText)} variant="ghost" external track="whatsapp_click">
              {ui.cta.expert}
            </Button>
            <Button href={`mailto:${company.emails[0]}`} variant="ghost" track="email_click">
              {ui.cta.email}
            </Button>
          </div>

          <dl className="mt-10 grid gap-6">
            <div className="rounded-2xl border border-line/60 bg-base-soft/50 p-6">
              <dt className="text-sm text-mist">{c.phone}</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-lg font-semibold">
                {company.phones.map((p) => (
                  <TrackedLink key={p.tel} event="phone_click" href={telHref(p.tel)} className="hover:text-accent" dir="ltr">
                    {p.display}
                  </TrackedLink>
                ))}
              </dd>
            </div>
            <div className="rounded-2xl border border-line/60 bg-base-soft/50 p-6">
              <dt className="text-sm text-mist">{c.email}</dt>
              <dd className="mt-2 grid gap-1 font-semibold">
                {company.emails.map((e) => (
                  <TrackedLink key={e} event="email_click" href={`mailto:${e}`} className="hover:text-accent break-all" dir="ltr">
                    {e}
                  </TrackedLink>
                ))}
              </dd>
            </div>
            <div className="rounded-2xl border border-line/60 bg-base-soft/50 p-6">
              <dt className="text-sm text-mist">{c.address}</dt>
              <dd className="mt-2 font-semibold">{company.address.display[locale]}</dd>
            </div>
            {company.hours && (
              <div className="rounded-2xl border border-line/60 bg-base-soft/50 p-6">
                <dt className="text-sm text-mist">{c.hours}</dt>
                <dd className="mt-2 font-semibold">{company.hours[locale]}</dd>
              </div>
            )}
          </dl>
        </div>

        <MapEmbed title={c.map} loadLabel={c.loadMap} notice={c.mapNotice} query={company.mapsQuery} />
      </div>
    </section>
  );
}
