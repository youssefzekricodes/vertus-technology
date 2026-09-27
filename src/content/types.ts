import type { Icon3DName } from "@/components/Icon3D";

export type Locale = "fr" | "ar";

export type PageKey =
  | "home"
  | "company"
  | "solutions"
  | "pv"
  | "pumping"
  | "storage"
  | "mobility"
  | "engineering"
  | "metaform"
  | "projects"
  | "expertise"
  | "news"
  | "faq"
  | "contact"
  | "study"
  | "legal"
  | "privacy";

export type Item = string | { title: string; desc?: string; icon?: Icon3DName; href?: PageKey };

export type Block =
  | { type: "intro"; title?: string; text: string[]; image?: { src: string; alt: string } }
  | { type: "list"; title: string; lead?: string; items: Item[]; variant?: "cards" | "checks" }
  | { type: "steps"; title: string; lead?: string; steps: Item[] }
  | { type: "table"; title: string; head: [string, string]; rows: [string, string][] }
  | { type: "callout"; label: string; text: string }
  | { type: "faq"; title?: string; items: { q: string; a: string }[] }
  | { type: "cta"; title: string; text?: string }
  /** Values connected by an animated power cable. */
  | { type: "values"; title: string; lead?: string; items: { title: string; desc: string; icon: Icon3DName }[] }
  /** Editorial text with linked topic chips (SEO + internal linking). */
  | { type: "text"; title: string; text: string[]; tags?: { label: string; href: PageKey }[] }
  | { type: "ceo" }
  | { type: "energyflow" }
  | { type: "projects"; title?: string; lead?: string }
  | { type: "news"; title?: string }
  | { type: "contact" }
  | { type: "studyForm" }
  | { type: "legal"; sections: { title: string; body: string[] }[] };

export type Page = {
  key: PageKey;
  seo: { title: string; description: string };
  hero: { eyebrow?: string; h1: string; lead?: string; message?: string };
  blocks: Block[];
};

export type Project = {
  id: string;
  name: string;
  sector: string;
  segment: "residentiel" | "industriel" | "agricole" | "commercial";
  city: string;
  type: string;
  power: string;
  problem: string;
  solution: string;
  result?: string;
  image: string;
};

export type Article = {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  sections: { title?: string; body: string[] }[];
};
