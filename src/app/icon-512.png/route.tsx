import { renderIcon } from "@/lib/icons";

/** /icon-512.png — favicon / app icon, prerendered at build. */
export const dynamic = "force-static";

export function GET() {
  return renderIcon(512, { background: "#ffffff", padding: 0.12 });
}
