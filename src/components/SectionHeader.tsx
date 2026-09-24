import { Reveal } from "./Reveal";

export function SectionHeader({
  title,
  sub,
  align = "start",
}: {
  title: string;
  sub?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal
      className={`mb-14 md:mb-20 max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      <h2 className="display-sub text-3xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-5 text-mist text-base md:text-lg leading-relaxed">{sub}</p>}
    </Reveal>
  );
}
