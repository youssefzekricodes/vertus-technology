export function LegalBlock({ sections }: { sections: { title: string; body: string[] }[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-12">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xl md:text-2xl font-semibold">{s.title}</h2>
            <div className="mt-4 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-mist leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
