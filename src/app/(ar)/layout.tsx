import { Shell } from "@/app/shell";
import type { Viewport } from "next";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata("ar");

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07121f" },
    { media: "(prefers-color-scheme: light)", color: "#f3f6fa" },
  ],
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Shell locale="ar">{children}</Shell>;
}
