export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="6 15 52 52"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M56 26 L44 26 L26 56 L38 56 Z" fill="currentColor" />
      <path d="M8 26 L20 26 L38 56 L26 56 Z" fill="var(--color-energy)" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <LogoMark />
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
