export function Section({
  children,
  id,
  tone = "base",
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  tone?: "base" | "soft";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 border-t border-line/50 ${tone === "soft" ? "bg-base-soft/40" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">{children}</div>
    </section>
  );
}
