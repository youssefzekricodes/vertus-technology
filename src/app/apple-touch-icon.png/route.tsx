import { renderIcon } from "@/lib/icons";

/** /apple-touch-icon.png — 180×180 home-screen icon, prerendered at build. */
export const dynamic = "force-static";

export function GET() {
  return renderIcon(180, { background: "#ffffff", padding: 0.12 });
}
