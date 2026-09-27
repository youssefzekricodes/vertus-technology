// Packs PNG images into a multi-size .ico (PNG-in-ICO, supported by all
// current browsers and by Google). Usage: node make-favicon.mjs out.ico a.png b.png …
import { readFileSync, writeFileSync } from "node:fs";
const [out, ...files] = process.argv.slice(2);
const imgs = files.map((f) => readFileSync(f));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
let offset = 6 + 16 * imgs.length;
const entries = imgs.map((png) => {
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  const e = Buffer.alloc(16);
  e.writeUInt8(w >= 256 ? 0 : w, 0); e.writeUInt8(h >= 256 ? 0 : h, 1);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
writeFileSync(out, Buffer.concat([header, ...entries, ...imgs]));
console.log("favicon", out, imgs.length, "sizes");
