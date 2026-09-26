import { Reveal } from "../Reveal";

export function CalloutBlock({ label, text }: { label: string; text: string }) {
  return (
    <section className="py-16 md:py-20 border-t border-line/50 bg-night/40">
      <Reveal className="mx-auto max-w-4xl px-5 md:px-8 text-center">
        <p className="text-accent text-sm font-semibold">{label}</p>
        <p className="mt-4 display-sub text-2xl md:text-4xl">{text}</p>
      </Reveal>
    </section>
  );
}
