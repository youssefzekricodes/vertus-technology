import { ImageResponse } from "next/og";

const appleIconSize = { width: 180, height: 180 };

/** 180×180 PNG home-screen icon (iOS does not accept SVG). */
export function renderAppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#07121f" }}>
        <svg width="120" height="120" viewBox="6 15 52 52">
          <path d="M56 26 L44 26 L26 56 L38 56 Z" fill="#eef3f8" />
          <path d="M8 26 L20 26 L38 56 L26 56 Z" fill="#22c47a" />
        </svg>
      </div>
    ),
    appleIconSize
  );
}
