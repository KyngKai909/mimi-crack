/**
 * Brand asset generator — the server half.
 *
 *   node scripts/brand-assets.mjs   →   open http://localhost:4321
 *
 * The drawing happens in a browser (scripts/brand-assets.html) because the
 * assets are made of Fraunces, and Fraunces is a variable font: only a real
 * text engine applies the weight and optical-size axes correctly. Node-side
 * SVG rasterisers either ignore the axes or need a static instance of the
 * font that this project doesn't carry.
 *
 * So the page draws, posts back PNGs, and this server writes them where Next
 * expects them and assembles the .ico. Nothing here runs in production or is
 * imported by the app.
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4321;

/** Only these paths may be written, so a stray post can't scribble anywhere. */
const ALLOWED = new Set([
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/og/default.png",
  "public/og/product.png",
  "public/og/about.png",
  "public/og/soon.png",
]);

/** The .ico is assembled from these, which are never written out alone. */
const ICO_SIZES = [16, 32, 48];

function decode(dataUrl) {
  const comma = dataUrl.indexOf(",");
  if (!dataUrl.startsWith("data:image/png;base64,") || comma < 0) {
    throw new Error("expected a base64 PNG data URL");
  }
  return Buffer.from(dataUrl.slice(comma + 1), "base64");
}

/**
 * Build an .ico around PNG payloads — legal since Vista and understood by
 * every browser that still asks for /favicon.ico.
 *
 * 6-byte header, then one 16-byte directory entry per image, then the PNGs.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    directory[at] = size >= 256 ? 0 : size; // 0 means 256
    directory[at + 1] = size >= 256 ? 0 : size;
    directory[at + 2] = 0; // palette size
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((i) => i.data)]);
}

/**
 * Canvas hands back a 32-bit PNG, which for flat cream, one gradient and a
 * little type is about ten times bigger than it needs to be. Quantising to a
 * palette takes a 1200x630 banner from ~515 kB to ~50 kB with no visible
 * difference — these are shared as link previews, often on a phone.
 */
async function shrink(buffer) {
  return sharp(buffer).png({ palette: true, effort: 10 }).toBuffer();
}

async function write(relative, buffer) {
  const target = join(ROOT, normalize(relative));
  if (!target.startsWith(ROOT)) throw new Error(`refusing to write ${relative}`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return `${relative} — ${(buffer.length / 1024).toFixed(1)} kB`;
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
    const html = await readFile(join(ROOT, "scripts/brand-assets.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (req.method === "POST" && req.url === "/save") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      const { files = {}, ico = {} } = JSON.parse(Buffer.concat(chunks).toString());
      const written = [];

      for (const [path, dataUrl] of Object.entries(files)) {
        if (!ALLOWED.has(path)) throw new Error(`not an expected asset: ${path}`);
        written.push(await write(path, await shrink(decode(dataUrl))));
      }

      const layers = await Promise.all(
        ICO_SIZES.filter((s) => ico[s]).map(async (size) => ({
          size,
          data: await shrink(decode(ico[size])),
        })),
      );
      if (layers.length) {
        written.push(await write("src/app/favicon.ico", buildIco(layers)));
      }

      console.log(written.map((line) => `  wrote ${line}`).join("\n"));
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, written }));
    } catch (err) {
      console.error(err);
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(err.message ?? err) }));
    }
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(PORT, () => {
  console.log(`Brand assets — open http://localhost:${PORT} and press Generate`);
});
