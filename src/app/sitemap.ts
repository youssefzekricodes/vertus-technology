import type { MetadataRoute } from "next";
import { company } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${company.domain}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: { fr: `${company.domain}/`, ar: `${company.domain}/ar` },
      },
    },
    {
      url: `${company.domain}/ar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: { fr: `${company.domain}/`, ar: `${company.domain}/ar` },
      },
    },
  ];
}
