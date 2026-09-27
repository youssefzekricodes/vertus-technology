import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale, PageKey } from "@/content/types";
import { getUi, type Ui } from "@/content/ui";
import { getPage } from "@/content/pages";
import { getArticle, getArticles } from "@/content/articles";
import { keyFromSlug, path, routes } from "@/lib/routes";
import { articleLd, articleMetadata, jsonLd, JsonLd, metadataFor } from "@/lib/seo";
import { Hero } from "../Hero";
import { CTA } from "../CTA";
import { Blocks } from "../blocks/Blocks";
import { PageHero, type Crumb } from "../blocks/PageHero";
import { ArticleBody, formatDate } from "../blocks/NewsList";

const SOLUTION_CHILDREN: PageKey[] = ["pv", "pumping", "storage", "mobility"];

/** Short label of a page (navigation wording) for breadcrumbs. */
function label(ui: Ui, key: PageKey): string {
  if (key === "company") return ui.companyPage;
  for (const e of ui.nav) {
    if ("children" in e) {
      const c = e.children.find((c) => c.key === key);
      if (c) return c.label;
    } else if (e.key === key) return e.label;
  }
  if (key === "study") return ui.cta.study;
  if (key === "legal") return ui.footer.legal;
  if (key === "privacy") return ui.footer.privacy;
  return ui.home;
}

function crumbsFor(locale: Locale, ui: Ui, key: PageKey): Crumb[] {
  const trail: Crumb[] = [{ href: path(locale, "home"), label: ui.home }];
  if (SOLUTION_CHILDREN.includes(key)) trail.push({ href: path(locale, "solutions"), label: label(ui, "solutions") });
  trail.push({ label: label(ui, key) });
  return trail;
}

const ldCrumbs = (crumbs: Crumb[], selfPath: string) =>
  crumbs.map((c) => ({ name: c.label, path: c.href ?? selfPath }));

type Resolved = { kind: "page"; key: PageKey } | { kind: "article"; slug: string } | null;

function resolve(locale: Locale, slug: string[]): Resolved {
  const joined = slug.join("/");
  const key = keyFromSlug(joined);
  if (key) return { kind: "page", key };
  if (slug.length === 2 && slug[0] === routes.news && getArticle(locale, slug[1])) {
    return { kind: "article", slug: slug[1] };
  }
  return null;
}

/** All non-home URLs (same slugs in both locales). */
export function staticSlugs(): { slug: string[] }[] {
  const pages = (Object.keys(routes) as PageKey[])
    .filter((k) => k !== "home")
    .map((k) => ({ slug: routes[k].split("/") }));
  const articles = getArticles("fr").map((a) => ({ slug: [routes.news, a.slug] }));
  return [...pages, ...articles];
}

export function slugMetadata(locale: Locale, slug: string[]): Metadata {
  const r = resolve(locale, slug);
  if (!r) return {};
  if (r.kind === "article") return articleMetadata(locale, getArticle(locale, r.slug)!);
  return metadataFor(locale, r.key);
}

export function HomePage({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const page = getPage(locale, "home");
  return (
    <>
      <JsonLd data={jsonLd(locale, "home", [])} />
      <Hero hero={page.hero} ui={ui} locale={locale} />
      <Blocks blocks={page.blocks} pageKey="home" ui={ui} locale={locale} />
    </>
  );
}

export function SlugPage({ locale, slug }: { locale: Locale; slug: string[] }) {
  const r = resolve(locale, slug);
  if (!r) notFound();
  const ui = getUi(locale);

  if (r.kind === "article") {
    const a = getArticle(locale, r.slug)!;
    const self = path(locale, "news", a.slug);
    const crumbs: Crumb[] = [
      { href: path(locale, "home"), label: ui.home },
      { href: path(locale, "news"), label: label(ui, "news") },
      { label: a.title },
    ];
    return (
      <>
        <JsonLd data={articleLd(locale, a, ldCrumbs(crumbs, self))} />
        <PageHero
          hero={{ eyebrow: `${a.category} · ${formatDate(a.date, locale)}`, h1: a.title, lead: a.excerpt }}
          crumbs={crumbs}
          crumbLabel={ui.breadcrumb}
        />
        <ArticleBody article={a} />
        <CTA title={getPage(locale, "home").blocks.find((b) => b.type === "cta")?.title ?? ui.cta.study} ui={ui} locale={locale} />
      </>
    );
  }

  const page = getPage(locale, r.key);
  const crumbs = crumbsFor(locale, ui, r.key);
  return (
    <>
      <JsonLd data={jsonLd(locale, r.key, ldCrumbs(crumbs, path(locale, r.key)))} />
      <PageHero hero={page.hero} crumbs={crumbs} crumbLabel={ui.breadcrumb} />
      <Blocks blocks={page.blocks} pageKey={r.key} ui={ui} locale={locale} />
    </>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  return (
    <section className="relative min-h-[80svh] grid place-items-center overflow-hidden px-5 pt-32 pb-20">
      <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
      <div className="relative text-center max-w-xl">
        <p className="display text-7xl md:text-9xl text-accent">404</p>
        <h1 className="mt-6 display-sub text-3xl md:text-4xl">{ui.notFound.title}</h1>
        <p className="mt-4 text-mist">{ui.notFound.text}</p>
        <a
          href={path(locale, "home")}
          className="mt-10 inline-flex rounded-full bg-energy px-7 py-3.5 text-sm font-semibold text-on-energy hover:bg-energy-hover transition-colors"
        >
          {ui.notFound.home}
        </a>
      </div>
    </section>
  );
}
