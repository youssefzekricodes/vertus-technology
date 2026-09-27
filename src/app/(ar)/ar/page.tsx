import { HomePage } from "@/components/site/SitePage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("ar", "home");

export default function Page() {
  return <HomePage locale="ar" />;
}
