/**
 * Product photo pipeline.
 *
 * The raws were shot on dark green felt. The grease itself is a pale
 * yellow-green, so a naive hue key eats the product. Two things keep this
 * honest instead:
 *
 *   1. The key only removes background *reachable from the frame border* by
 *      flood fill, so pale green enclosed by the jar is structurally safe no
 *      matter what its hue is.
 *   2. The felt (hue ~165 deg) and the grease (hue ~90 deg) are far enough
 *      apart that the predicate itself has a wide margin.
 *
 * After keying: erode 2px to drop the green fringe, feather the alpha, drop a
 * synthetic contact shadow (the real one went out with the felt), and lay the
 * result on brand cream.
 *
 * Usage: node scripts/process-photos.mjs [--src DIR] [--out DIR]
 */
import sharp from "sharp";
import path from "path";
import { mkdirSync } from "fs";

const CREAM = { r: 0xf8, g: 0xf5, b: 0xed };

const args = process.argv.slice(2);
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const SRC = argOf("--src", path.join(process.env.HOME, "Downloads/mimi-crack"));
const OUT = argOf("--out", path.join(process.cwd(), "public/product"));

/**
 * Backdrop detection works on *chromaticity* (r,g,b normalised by their sum)
 * rather than hue. The felt is lit very unevenly — it runs from near-black in
 * the corners to a bright rgb(56,124,109) under the lamp — so anything keyed
 * on brightness or raw RGB distance falls apart. Chromaticity throws the
 * brightness away and keeps only the colour, which is what is actually
 * constant across the backdrop.
 *
 * Measured on these shots: backdrop lands within 0.055 of the reference,
 * every part of the subject sits beyond 0.19. The threshold goes in the gap.
 */
const CHROM_THRESHOLD = 0.11;

export function chromaticity(r, g, b) {
  const sum = r + g + b || 1;
  return [r / sum, g / sum, b / sum];
}

/**
 * Median chromaticity of the frame border — the backdrop reference for this
 * particular shot, so lighting differences between photos don't matter.
 */
export function backdropRef(data, W, H, C) {
  const samples = [[], [], []];
  const take = (x, y) => {
    const i = (y * W + x) * C;
    const c = chromaticity(data[i], data[i + 1], data[i + 2]);
    for (let k = 0; k < 3; k++) samples[k].push(c[k]);
  };
  for (let x = 0; x < W; x += 5) { take(x, 2); take(x, H - 3); }
  for (let y = 0; y < H; y += 5) { take(2, y); take(W - 3, y); }
  return samples.map((a) => {
    a.sort((p, q) => p - q);
    return a[a.length >> 1];
  });
}

/**
 * Flood fill inward from every border pixel, marking backdrop.
 * Only backdrop *connected to the frame edge* is removed, so pale green
 * enclosed by the jar can never be eaten however green it looks.
 *
 * Returns a Uint8Array mask: 255 = keep (foreground), 0 = drop.
 */
export function keyFromBorder(data, W, H, C, ref) {
  const mask = new Uint8Array(W * H).fill(255);
  const seen = new Uint8Array(W * H);
  const stack = [];

  const bgLike = (p) => {
    const i = p * C;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const c = chromaticity(r, g, b);
    const dist = Math.hypot(c[0] - ref[0], c[1] - ref[1], c[2] - ref[2]);
    if (dist < CHROM_THRESHOLD) return true;
    // The felt vignettes to near-black in the corners, where chromaticity is
    // just sensor noise. Allow those, but only when they are genuinely almost
    // black — a moulded black lid never gets this dark under the key light.
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma < 26 && dist < 0.3;
  };

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (seen[p]) return;
    seen[p] = 1;
    if (!bgLike(p)) return;
    mask[p] = 0;
    stack.push(p);
  };

  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }

  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p / W) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return mask;
}

/** Shrink the foreground by `r` px so the green fringe goes with it. */
/**
 * Drop speckle.
 *
 * The felt is a coarse weave and its bright fibres survive the key as
 * salt-and-pepper specks scattered across the backdrop. They are only a
 * fraction of a percent of the pixels, but a single speck in a corner drags
 * the subject bounding box out to the whole frame, which is what made the
 * first pass look like nothing had been keyed at all.
 *
 * So: label the surviving foreground, then keep only components large enough
 * to be real. The threshold is relative to the biggest component rather than
 * absolute, because a shot can legitimately hold two subjects — an open jar
 * and its lid sitting beside it — and hard-coding "keep the largest" would
 * throw the lid away.
 */
function keepLargeComponents(mask, W, H, minFraction = 0.12) {
  const label = new Int32Array(W * H).fill(-1);
  const sizes = [];
  const stack = [];

  for (let start = 0; start < W * H; start++) {
    if (!mask[start] || label[start] !== -1) continue;
    const id = sizes.length;
    let size = 0;
    label[start] = id;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      size++;
      const x = p % W;
      const y = (p / W) | 0;
      const visit = (q, ok) => {
        if (!ok || !mask[q] || label[q] !== -1) return;
        label[q] = id;
        stack.push(q);
      };
      visit(p - 1, x > 0);
      visit(p + 1, x < W - 1);
      visit(p - W, y > 0);
      visit(p + W, y < H - 1);
    }
    sizes.push(size);
  }

  if (!sizes.length) return mask;
  const biggest = Math.max(...sizes);
  const cutoff = biggest * minFraction;
  const out = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    if (mask[p] && sizes[label[p]] >= cutoff) out[p] = 255;
  }
  return out;
}

/**
 * Peel the dark halo left around the subject.
 *
 * The felt vignettes into shadow at the subject's feet, and that shadow is
 * too dark for the chromaticity test to read reliably but not dark enough for
 * the near-black escape hatch — so it survives as a grubby outline once the
 * cutout lands on cream. Peel dark pixels inward from the mask boundary, but
 * cap the depth: a black lid is legitimately dark, and an uncapped peel would
 * eat straight through it.
 */
function stripDarkFringe(mask, data, W, H, C, { maxDepth = 6, maxLuma = 62 } = {}) {
  let cur = mask;
  for (let pass = 0; pass < maxDepth; pass++) {
    const next = new Uint8Array(cur);
    let peeled = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (!cur[p]) continue;
        const edge =
          (x > 0 && !cur[p - 1]) || (x < W - 1 && !cur[p + 1]) ||
          (y > 0 && !cur[p - W]) || (y < H - 1 && !cur[p + W]);
        if (!edge) continue;
        const i = p * C;
        const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (luma < maxLuma) { next[p] = 0; peeled++; }
      }
    }
    cur = next;
    if (!peeled) break;
  }
  return cur;
}

export function erode(mask, W, H, r) {
  let cur = mask;
  for (let pass = 0; pass < r; pass++) {
    const next = new Uint8Array(cur);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (!cur[p]) continue;
        if (
          (x > 0 && !cur[p - 1]) || (x < W - 1 && !cur[p + 1]) ||
          (y > 0 && !cur[p - W]) || (y < H - 1 && !cur[p + W])
        ) next[p] = 0;
      }
    }
    cur = next;
  }
  return cur;
}

export function bboxOf(mask, W, H) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (mask[y * W + x]) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/** Cut the subject out of `file`, returning a trimmed RGBA sharp instance. */
export async function cutout(file, { preCrop, erodePx = 2, feather = 1.2, minFraction = 0.12, fringeDepth = 6 } = {}) {
  let img = sharp(file).rotate();
  if (preCrop) img = img.extract(preCrop);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Key against a median-filtered copy so the felt's woven texture stops
  // punching holes in the backdrop, then apply the resulting mask to the
  // original pixels — the subject keeps its full detail.
  const { data: smooth } = await img
    .clone()
    .median(5)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ref = backdropRef(smooth, W, H, C);
  let mask = keyFromBorder(smooth, W, H, C, ref);
  mask = keepLargeComponents(mask, W, H, minFraction);
  mask = stripDarkFringe(mask, smooth, W, H, C, { maxDepth: fringeDepth });
  mask = keepLargeComponents(mask, W, H, minFraction);
  mask = erode(mask, W, H, erodePx);

  const box = bboxOf(mask, W, H);
  if (!box) throw new Error(`nothing survived the key in ${path.basename(file)}`);

  // Soften the alpha edge on its own before it meets the colour channels,
  // otherwise the blur drags backdrop colour into the subject.
  // NB: blur() promotes a 1-channel raw buffer to 3 channels on the way out,
  // so read back with the stride sharp actually returned rather than assuming
  // one byte per pixel.
  const { data: alpha, info: alphaInfo } = await sharp(Buffer.from(mask), {
    raw: { width: W, height: H, channels: 1 },
  })
    .blur(feather)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const aStride = alphaInfo.channels;

  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const s = p * C;
    rgba[p * 4] = data[s];
    rgba[p * 4 + 1] = data[s + 1];
    rgba[p * 4 + 2] = data[s + 2];
    rgba[p * 4 + 3] = alpha[p * aStride];
  }

  const pad = 8;
  const left = Math.max(0, box.x0 - pad);
  const top = Math.max(0, box.y0 - pad);
  const right = Math.min(W - 1, box.x1 + pad);
  const bottom = Math.min(H - 1, box.y1 + pad);
  const ex = { left, top, width: right - left + 1, height: bottom - top + 1 };

  return sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract(ex)
    .png();
}

/** A soft elliptical contact shadow, since the real one was keyed away. */
function contactShadow(w, h, opacity = 0.20) {
  const buf = Buffer.alloc(w * h * 4);
  const cx = w / 2;
  const cy = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const a = Math.max(0, 1 - d) ** 2.2;
      const i = (y * w + x) * 4;
      buf[i] = 0x3a; buf[i + 1] = 0x42; buf[i + 2] = 0x30;
      buf[i + 3] = Math.round(255 * a * opacity);
    }
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 4 } }).blur(w / 22).png();
}

/**
 * Lay a cutout on a cream canvas at the given aspect, with a contact shadow.
 * `scale` is the fraction of canvas height the subject occupies.
 */
async function onCream(cut, { width, height, scale = 0.82, shadow = true, bg = CREAM }) {
  // Resolve the cutout first: `metadata()` reports the *source* dimensions,
  // not the result of the pending extract, so the aspect ratio would be wrong.
  const cutBuf = await cut.clone().toBuffer();
  const meta = await sharp(cutBuf).metadata();
  const aspect = meta.width / meta.height;

  // Fit inside the canvas box on whichever axis binds first.
  let fitH = Math.round(height * scale);
  let fitW = Math.round(fitH * aspect);
  const maxW = Math.round(width * 0.92);
  if (fitW > maxW) {
    fitW = maxW;
    fitH = Math.round(fitW / aspect);
  }

  const subject = await sharp(cutBuf).resize(fitW, fitH).png().toBuffer();
  const left = Math.round((width - fitW) / 2);
  const top = Math.round((height - fitH) / 2);

  const layers = [];
  if (shadow) {
    const sw = Math.round(fitW * 1.05);
    const sh = Math.round(fitH * 0.22);
    layers.push({
      input: await contactShadow(sw, sh).toBuffer(),
      left: Math.round((width - sw) / 2),
      top: Math.min(height - sh, top + fitH - Math.round(sh * 0.55)),
    });
  }
  layers.push({ input: subject, left, top });

  return sharp({
    create: { width, height, channels: 3, background: bg },
  }).composite(layers);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const p = (n) => path.join(SRC, n);
  const o = (n) => path.join(OUT, n);
  const webp = { quality: 86, effort: 5 };
  const done = [];
  const emit = async (name, pipeline) => {
    await pipeline.toFile(o(name));
    done.push(name);
  };

  // --- Hero packshot: closed jar, brown lid, front label ------------------
  const front = await cutout(p("image-1788819945855.jpg"), { erodePx: 3 });
  await emit("jar-front.webp",
    (await onCream(front, { width: 1400, height: 1750, scale: 0.84 })).webp(webp));
  await emit("jar-front-alpha.webp",
    front.clone().resize({ height: 1600 }).webp({ ...webp, alphaQuality: 100 }));

  // --- Open jar, lid resting below: shows texture + top label -------------
  const open = await cutout(p("image-1788819909712.jpg"), { erodePx: 3 });
  await emit("jar-open.webp",
    (await onCream(open, { width: 1400, height: 1750, scale: 0.86 })).webp(webp));

  // --- Open jar shot straight down ---------------------------------------
  const openTop = await cutout(p("image-1788819920606.jpg"), { erodePx: 3 });
  await emit("jar-open-top.webp",
    (await onCream(openTop, { width: 1400, height: 1750, scale: 0.84 })).webp(webp));

  // --- Group flat lay: keep it full-bleed, just warm it toward the brand --
  await emit("jar-group.webp", sharp(p("image-1788819845976.jpg")).rotate()
    .resize(1600, 2000, { fit: "cover" })
    .modulate({ saturation: 0.92 })
    .webp(webp));

  await emit("jar-flatlay.webp", sharp(p("image-1788819819490.jpg")).rotate()
    .resize(1600, 2000, { fit: "cover" })
    .modulate({ saturation: 0.92 })
    .webp(webp));

  // --- Macro of the grease surface, for use as a texture band -------------
  // Crop chosen to sit wholly inside the jar — no glass rim, no felt.
  await emit("texture.webp", sharp(p("image-1788819920606.jpg")).rotate()
    .extract({ left: 300, top: 620, width: 500, height: 340 })
    .resize(1600, 1088, { fit: "cover" })
    .modulate({ saturation: 1.04 })
    .webp({ quality: 90 }));

  // --- Social card --------------------------------------------------------
  const ogSubject = await front.clone().resize({ height: 468 }).png().toBuffer();
  const ogMeta = await sharp(ogSubject).metadata();
  const ogText = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="630">
      <style>
        .brand { font-family: Georgia, "Times New Roman", serif; font-size: 62px; letter-spacing: 10px; fill: #1c1b17; }
        .prod  { font-family: Georgia, "Times New Roman", serif; font-size: 40px; letter-spacing: 4px; fill: #1c1b17; }
        .sub   { font-family: Helvetica, Arial, sans-serif; font-size: 21px; letter-spacing: 3px; fill: #4c6238; }
        .size  { font-family: Helvetica, Arial, sans-serif; font-size: 18px; letter-spacing: 2px; fill: #85806f; }
      </style>
      <text class="brand" x="64" y="250">MIMI CRACK</text>
      <text class="prod"  x="64" y="312">HAIR FERTILIZER</text>
      <line x1="64" y1="348" x2="470" y2="348" stroke="#c9c2ae" stroke-width="2"/>
      <text class="sub"   x="64" y="392">REVITALIZING &amp; NOURISHING HAIR GREASE</text>
      <text class="size"  x="64" y="430">9.5 OZ | 269G &#183; PREMIUM GREASE</text>
    </svg>`);
  await emit("og.jpg", sharp({
    create: { width: 1200, height: 630, channels: 3, background: CREAM },
  }).composite([
    { input: ogText, left: 0, top: 0 },
    { input: ogSubject, left: 960 - Math.round(ogMeta.width / 2), top: 81 },
  ]).jpeg({ quality: 90 }));

  console.log("wrote", done.length, "files to", OUT);
  for (const n of done) console.log("  ", n);
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) main().catch((e) => { console.error(e); process.exit(1); });
