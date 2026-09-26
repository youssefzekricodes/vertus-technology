import { pagesAr } from "./pages.ar";
import { pagesFr } from "./pages.fr";
import type { Locale, Page, PageKey } from "./types";

export function getPage(locale: Locale, key: PageKey): Page {
  return (locale === "ar" ? pagesAr : pagesFr)[key];
}
