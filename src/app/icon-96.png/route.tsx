import { renderIcon } from "@/lib/icons";

/** /icon-96.png — favicon / app icon, prerendered at build. */
export const dynamic = "force-static";

export function GET() {
  return renderIcon(96, { background: "#ffffff", padding: 0.1 });
}
