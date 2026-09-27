import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { getArticles } from "@/content/articles";
import type { PageKey } from "@/content/types";
import { routes } from "@/lib/routes";

const PRIORITY: Partial<Record<PageKey, number>> = {
  home: 1,
  solutions: 0.9,
  pv: 0.9,
  pumping: 0.9,
  storage: 0.9,
  mobility: 0.9,
  engineering: 0.8,
  study: 0.8,
  contact: 0.8,
  legal: 0.2,
  privacy: 0.2,
};

/** Date of the last content update — bump it when page content changes. */
const CONTENT_UPDATED = new Date("2026-09-27");

function entry(suffix: string, priority: number, lastModified: Date): MetadataRoute.Sitemap {
  const tail = suffix ? `/${suffix}` : "";
  // Arabic (default) at the root, French under /fr
  const ar = `${company.domain}${tail}`;
  const fr = `${company.domain}/fr${tail}`;
  const alternates = { languages: { ar, fr, "x-default": ar } };
  return [
    { url: ar, lastModified, changeFrequency: "monthly", priority, alternates, images: [`${company.domain}/og/ar${tail}`] },
    {
      url: fr,
      lastModified,
      changeFrequency: "monthly",
      priority: Math.max(0.1, priority - 0.1),
      alternates,
      images: [`${company.domain}/og/fr${tail}`],
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = (Object.keys(routes) as PageKey[]).flatMap((k) => entry(routes[k], PRIORITY[k] ?? 0.7, CONTENT_UPDATED));
  const articles = getArticles("fr").flatMap((a) => entry(`${routes.news}/${a.slug}`, 0.6, new Date(a.date)));
  return [...pages, ...articles];
}
