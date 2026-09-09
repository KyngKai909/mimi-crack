/**
 * Type-only social card, in the brutalist system.
 *
 * Photography-free on purpose: the site ships with placeholder slots, so a
 * card built from type and rules stays honest and stays on-brand. Re-run after
 * changing the palette or the wordmark.
 *
 *   node scripts/make-og.mjs
 */
import sharp from "sharp";
import path from "path";
import { mkdirSync } from "fs";

const OUT = path.join(process.cwd(), "public");
const BONE = "#f2efe4";
const INK = "#0a0a0a";
const ACID = "#b4ff39";

// Anton isn't installed system-wide, so the card uses a condensed stack the
// renderer can actually resolve rather than silently falling back to
// something round and wrong.
const CONDENSED = "'Haettenschweiler', 'Impact', 'Arial Narrow', sans-serif";
const MONO = "'Courier New', monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BONE}"/>

  <!-- top rule + meta -->
  <line x1="0" y1="64" x2="1200" y2="64" stroke="${INK}" stroke-width="2"/>
  <text x="32" y="42" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${INK}">EST. SMALL BATCH</text>
  <text x="1168" y="42" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${INK}" text-anchor="end">[ 01 / 01 ]</text>

  <!-- wordmark -->
  <text x="26" y="290" font-family="${CONDENSED}" font-size="190" fill="${INK}" letter-spacing="-2">MIMI CRACK</text>
  <text x="30" y="410" font-family="${CONDENSED}" font-size="118" fill="${INK}" letter-spacing="-1">HAIR FERTILIZER</text>

  <!-- acid underline -->
  <rect x="30" y="430" width="560" height="16" fill="${ACID}"/>

  <!-- bottom rule + spec row -->
  <line x1="0" y1="520" x2="1200" y2="520" stroke="${INK}" stroke-width="2"/>
  <line x1="400" y1="520" x2="400" y2="630" stroke="${INK}" stroke-width="2"/>
  <line x1="800" y1="520" x2="800" y2="630" stroke="${INK}" stroke-width="2"/>
  <text x="32" y="583" font-family="${MONO}" font-size="21" letter-spacing="3" fill="${INK}">9.5 OZ | 269G</text>
  <text x="432" y="583" font-family="${MONO}" font-size="21" letter-spacing="3" fill="${INK}">PREMIUM GREASE</text>
  <text x="832" y="583" font-family="${MONO}" font-size="21" letter-spacing="3" fill="${INK}">STIMULATES SCALP</text>
</svg>`;

mkdirSync(OUT, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, "og.png"));
console.log("wrote public/og.png");
