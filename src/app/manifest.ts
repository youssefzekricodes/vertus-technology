import type { MetadataRoute } from "next";
import { company } from "@/content/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: "VERTUS",
    description: "Panneaux solaires, énergie solaire, batteries et pompage solaire en Tunisie.",
    start_url: "/",
    display: "standalone",
    background_color: "#07121f",
    theme_color: "#07121f",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
