import type { Locale, PageKey } from "@/content/types";

/** Clean, keyword-bearing URLs (same slug in both languages). French is the
 * default language at the site root; Arabic lives under /ar. */
export const routes: Record<PageKey, string> = {
  home: "",
  company: "vertus-technology",
  solutions: "solutions",
  pv: "solutions/photovoltaique",
  pumping: "solutions/pompage-solaire",
  storage: "solutions/stockage",
  mobility: "solutions/mobilite-electrique",
  engineering: "ingenierie",
  metaform: "metaform",
  projects: "realisations",
  expertise: "expertise",
  news: "actualites",
  faq: "faq",
  contact: "contact",
  study: "demander-une-etude",
  legal: "mentions-legales",
  privacy: "politique-de-confidentialite",
};

export function path(locale: Locale, key: PageKey, extra?: string): string {
  const base = locale === "ar" ? "/ar" : "";
  const slug = [routes[key], extra].filter(Boolean).join("/");
  return slug ? `${base}/${slug}` : base || "/";
}

export function keyFromSlug(slug: string): PageKey | undefined {
  return (Object.keys(routes) as PageKey[]).find((k) => routes[k] === slug && k !== "home");
}

export function otherLocalePath(locale: Locale, currentPath: string): string {
  if (locale === "ar") return currentPath.replace(/^\/ar(?=\/|$)/, "") || "/";
  return currentPath === "/" ? "/ar" : `/ar${currentPath}`;
}
