"use client";

import { useRouter } from "next/navigation";
import { I18nProvider, RouterProvider } from "@heroui/react";
import type { Locale } from "@/content/types";

/**
 * HeroUI / React Aria context: client-side navigation for menu links
 * (Dropdown items with href) and locale/direction for overlays (RTL in Arabic).
 */
export function Providers({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <I18nProvider locale={locale === "ar" ? "ar-TN" : "fr-FR"}>
      <RouterProvider navigate={(href) => router.push(href)}>{children}</RouterProvider>
    </I18nProvider>
  );
}
