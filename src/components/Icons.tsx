/**
 * Small UI glyphs (24px line style). Card illustrations live in Icon3D.
 */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className={className} {...base}>
      {children}
    </svg>
  );
}

export type IconName = "arrow" | "check";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case "arrow":
      return (
        <Svg className={className}>
          <path d="M4 12h15M13.5 6 19.5 12l-6 6" className="rtl:-scale-x-100 origin-center" />
        </Svg>
      );
    case "check":
      return (
        <Svg className={className}>
          <path d="M4.5 12.5 10 18 19.5 6.5" />
        </Svg>
      );
  }
}
