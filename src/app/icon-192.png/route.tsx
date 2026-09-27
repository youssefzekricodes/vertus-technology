import { renderIcon } from "@/lib/icons";

/** /icon-192.png — favicon / app icon, prerendered at build. */
export const dynamic = "force-static";

export function GET() {
  return renderIcon(192, { background: "#ffffff", padding: 0.12 });
}
