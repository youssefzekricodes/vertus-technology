import { logoMarkSvg } from "@/lib/logoMark";

/** VERTUS mark (green ribbon + solar panel "V"), from the shared SVG source. */
export function LogoMark({ size = 38, id = "logo" }: { size?: number; id?: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: logoMarkSvg({ size, id }) }}
    />
  );
}

export function Logo({ compact = false, id = "logo" }: { compact?: boolean; id?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <LogoMark id={id} />
      {!compact && (
        <span
          dir="ltr"
          className="leading-none tracking-[0.14em] text-[0.8rem] font-semibold"
          style={{ fontVariationSettings: '"wdth" 118' }}
        >
          VERTUS
          <span className="block text-[0.52rem] tracking-[0.34em] text-mist mt-1">
            TECHNOLOGY
          </span>
        </span>
      )}
    </span>
  );
}
