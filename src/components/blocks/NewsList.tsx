import Link from "next/link";
import type { Article, Locale } from "@/content/types";
import { path } from "@/lib/routes";
import { Icon } from "../Icons";
import { Reveal } from "../Reveal";

export function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-TN" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsList({ articles, locale, readMore }: { articles: Article[]; locale: Locale; readMore: string }) {
  return (
    <section className="py-16 md:py-24">
      <ul className="mx-auto max-w-7xl px-5 md:px-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal as="li" key={a.slug} delay={(i % 3) * 0.06}>
            <Link
              href={path(locale, "news", a.slug)}
              className="group flex h-full flex-col rounded-2xl border border-line/60 bg-base-soft/60 p-7 transition-colors hover:border-energy/60"
            >
              <p className="text-xs text-accent font-semibold">{a.category}</p>
              <h2 className="mt-3 text-xl font-semibold leading-snug group-hover:text-accent transition-colors">{a.title}</h2>
              <p className="mt-3 text-sm text-mist leading-relaxed grow">{a.excerpt}</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <time dateTime={a.date} className="text-mist">
                  {formatDate(a.date, locale)}
                </time>
                <span className="inline-flex items-center gap-2 font-semibold text-accent">
                  {readMore}
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function ArticleBody({ article }: { article: Article }) {
  return (
    <article className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-10">
        {article.sections.map((s, i) => (
          <section key={i}>
            {s.title && <h2 className="text-2xl font-semibold">{s.title}</h2>}
            <div className={s.title ? "mt-4 space-y-4" : "space-y-4"}>
              {s.body.map((p, j) => (
                <p key={j} className={`leading-relaxed ${s.title ? "text-mist" : "text-lg text-ink/90"}`}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
