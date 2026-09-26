import { renderAppleIcon } from "@/lib/appleIcon";

/** /apple-touch-icon.png — 180×180 home-screen icon, prerendered at build. */
export const dynamic = "force-static";

export function GET() {
  return renderAppleIcon();
}
