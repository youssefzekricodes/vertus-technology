import { ImageResponse } from "next/og";
import { logoMarkSvg } from "./logoMark";

const MARK = `data:image/svg+xml;base64,${Buffer.from(logoMarkSvg({ id: "ic" })).toString("base64")}`;

/**
 * Square PNG icon of the VERTUS mark (favicons, app icons, iOS home screen).
 * `background` fills the square (iOS ignores transparency); omit it for a
 * transparent favicon.
 */
export function renderIcon(
  size: number,
  { background, padding = 0.1, frame = false }: { background?: string; padding?: number; frame?: boolean } = {}
) {
  const inner = Math.round(size * (1 - padding * 2));
  // Framed favicon: the mark on a white rounded tile with a thin light edge,
  // readable on light and dark browser tabs and in Google results.
  if (frame) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: size * 0.22,
              border: `${Math.max(1, Math.round(size / 48))}px solid #d5dde6`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK} width={inner} height={inner} alt="" />
          </div>
        </div>
      ),
      { width: size, height: size }
    );
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: background ?? "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={inner} height={inner} alt="" />
      </div>
    ),
    { width: size, height: size }
  );
}
