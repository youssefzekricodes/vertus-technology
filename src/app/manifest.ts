import type { MetadataRoute } from "next";
import { company } from "@/content/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: "VERTUS",
    description: "حلول كهروضوئية وطاقية وصناعية في تونس — Solutions photovoltaïques et énergétiques en Tunisie.",
    start_url: "/",
    display: "standalone",
    background_color: "#07121f",
    theme_color: "#07121f",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
