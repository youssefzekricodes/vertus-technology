import { writeFileSync } from "node:fs";
import { faviconSvg, logoMarkSvg } from "../src/lib/logoMark";
writeFileSync("public/logo-mark.svg", logoMarkSvg() + "\n");
writeFileSync("public/icon.svg", faviconSvg() + "\n");
console.log("written");
