import type { Metadata } from "next";
import { NotFoundPage } from "@/components/site/SitePage";

export const metadata: Metadata = { title: "404", robots: { index: false } };

export default function NotFound() {
  return <NotFoundPage locale="ar" />;
}
