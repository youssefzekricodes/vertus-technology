/**
 * Company facts shown across the site. Replace/complete here only.
 * Fields left empty are hidden automatically (no invented data).
 */
export const company = {
  name: "VERTUS Technology",
  signature: "Engineering Energy. Building the Future.",
  positioning: "Analyser. Concevoir. Optimiser. Réaliser.",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vertus-technology.com",
  phones: [
    { display: "93 666 300", tel: "+21693666300" },
    { display: "93 57 57 00", tel: "+21693575700" },
  ],
  /** International format without "+" for wa.me links. */
  whatsapp: "21693666300",
  emails: ["dg.vertus@gmail.com", "vertustechnology@gmail.com"],
  address: {
    street: "Centre Urbain Nord",
    city: "Ariana",
    country: "TN",
    display: { fr: "Centre Urbain Nord, Ariana, Tunisie", ar: "المركز العمراني الشمالي، أريانة، تونس" },
  },
  mapsQuery: "Centre Urbain Nord, Ariana, Tunisie",
  /** Opening hours — not provided yet; hidden while null. */
  hours: null as null | { fr: string; ar: string },
  /** Social profiles — not provided yet; icons hidden while empty. */
  social: {} as Partial<Record<"linkedin" | "facebook" | "instagram" | "youtube", string>>,
};

export const telHref = (tel: string) => `tel:${tel}`;
export const whatsappHref = (text?: string) =>
  `https://wa.me/${company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
