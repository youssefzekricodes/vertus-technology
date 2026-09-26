import { notFound } from "next/navigation";
import { staticSlugs } from "@/components/site/SitePage";
import { renderOg } from "@/lib/og";

/** /og/fr, /og/ar/solutions/pompage-solaire… → 1200×630 PNG, prerendered at build. */
export function generateStaticParams() {
  return ["fr", "ar"].flatMap((locale) => [{ locale, slug: [] }, ...staticSlugs().map((s) => ({ locale, ...s }))]);
}

export const dynamicParams = false;

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale, slug } = await params;
  if (locale !== "fr" && locale !== "ar") notFound();
  return renderOg(locale, slug);
}
