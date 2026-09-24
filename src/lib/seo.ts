import type { Metadata } from "next";
import { company, getDict, type Locale } from "@/content/site";

export function buildMetadata(locale: Locale): Metadata {
  const t = getDict(locale);
  const path = locale === "ar" ? "/ar" : "/";
  return {
    metadataBase: new URL(company.domain),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: path,
      languages: { fr: "/", ar: "/ar", "x-default": "/" },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: path,
      siteName: company.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "ar" ? "ar_TN" : "fr_TN",
      images: [{ url: "/og.svg", width: 1200, height: 630, alt: company.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/og.svg"],
    },
    icons: { icon: "/icon.svg" },
  };
}

export function jsonLd(locale: Locale) {
  const t = getDict(locale);
  const url = company.domain;
  const services = t.solutions.items.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.desc,
    provider: { "@id": `${url}/#organization` },
    areaServed: "TN",
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${url}/#organization`,
        name: company.name,
        url,
        logo: `${url}/logo-mark.svg`,
        email: company.email,
        telephone: company.phone,
        founder: { "@type": "Person", name: company.founder },
        address: { "@type": "PostalAddress", addressCountry: "TN" },
        sameAs: Object.values(company.social),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: company.name,
        inLanguage: locale,
        publisher: { "@id": `${url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.nav.links[0].label,
            item: locale === "ar" ? `${url}/ar` : url,
          },
        ],
      },
      ...services,
    ],
  };
}
