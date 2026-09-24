import { Shell } from "../shell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("fr");

export default function FrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell locale="fr">{children}</Shell>;
}
