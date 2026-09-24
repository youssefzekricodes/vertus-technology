import { Home } from "@/components/Home";
import { jsonLd } from "@/lib/seo";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd("fr")) }}
      />
      <Home locale="fr" />
    </>
  );
}
