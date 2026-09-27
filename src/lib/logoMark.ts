/**
 * VERTUS mark: a "V" whose left arm is a green folded ribbon and whose right
 * arm is a blue photovoltaic panel. Single source for every logo usage
 * (navbar/footer component, favicon, share images, app icons).
 */

// Right arm: panel drawn in local coords (x across 0–11, y along 0–46),
// mapped onto the rising diagonal of the V.
const PANEL = "matrix(1 0 0.479 -0.878 27.3 54.2)";
const COLS = 3;
const ROWS = 5;
const W = 14.5;
const L = 44;

function cells(): string {
  const gap = 0.7;
  const pad = 1.1;
  const cw = (W - pad * 2 - gap * (COLS - 1)) / COLS;
  const ch = (L - pad * 2 - gap * (ROWS - 1)) / ROWS;
  let out = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = pad + c * (cw + gap);
      const y = pad + r * (ch + gap);
      out += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cw.toFixed(2)}" height="${ch.toFixed(2)}" rx="0.35"/>`;
    }
  }
  return out;
}

export function logoMarkSvg({ size, id = "vm" }: { size?: number; id?: string } = {}): string {
  const dims = size ? ` width="${size}" height="${size}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 60 60"${dims} role="img" aria-label="VERTUS Technology">
  <defs>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3ee08f"/>
      <stop offset="0.55" stop-color="#16a85e"/>
      <stop offset="1" stop-color="#0b7a44"/>
    </linearGradient>
    <linearGradient id="${id}-b" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#123f8f"/>
      <stop offset="1" stop-color="#2f7fe6"/>
    </linearGradient>
    <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- left arm: green folded ribbon -->
  <path d="M5 12 H18.5 L34.5 44.5 L30 55.5 Z" fill="url(#${id}-g)"/>
  <path d="M9.4 14.6 H16.9 L31.1 43.5 L29.6 47.4 Z" fill="none" stroke="#b8f5d2" stroke-opacity="0.55" stroke-width="1" stroke-linejoin="round"/>
  <!-- right arm: photovoltaic panel -->
  <g transform="${PANEL}">
    <rect x="0" y="0" width="${W}" height="${L}" rx="1.4" fill="#0b2a5c"/>
    <g fill="url(#${id}-b)">${cells()}</g>
    <rect x="0" y="${L * 0.52}" width="${W}" height="${L * 0.3}" fill="url(#${id}-s)" transform="rotate(-8 5.5 ${L * 0.6})"/>
  </g>
</svg>`;
}

/** Favicon: the mark on a solid white square (no transparency). */
export function faviconSvg(): string {
  const mark = logoMarkSvg({ id: "fav" })
    .replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 60 60"', '<svg x="6" y="6" width="52" height="52" viewBox="4 4 60 60"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#ffffff"/>
  ${mark}
</svg>`;
}
