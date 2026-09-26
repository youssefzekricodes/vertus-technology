import { SlugPage, slugMetadata, staticSlugs } from "@/components/site/SitePage";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return staticSlugs();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return slugMetadata("ar", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <SlugPage locale="ar" slug={slug} />;
}
