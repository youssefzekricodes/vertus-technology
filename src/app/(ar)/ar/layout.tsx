import { Shell } from "../../shell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("ar");

export default function ArLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell locale="ar">{children}</Shell>;
}
