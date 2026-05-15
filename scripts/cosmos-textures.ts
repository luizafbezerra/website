// One-shot conversion: raw public-domain JPGs in `references/cosmos-sources/`
// → resized + colour-graded WebPs at the paths the cosmos components expect
// under `public/art/cosmos/`. Simple passes are resize-only; the dome, brass
// and sun passes apply value-inversion / tint / contrast curves so the source
// pale-parchment engravings read as the v3 "tipped-in plate" palette
// (aged-sepia umber + cobalt wash + gilt stars / brass rings).
//
// Run: `pnpm tsx scripts/cosmos-textures.ts`

import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCES = "references/cosmos-sources";
const TARGET = "public/art/cosmos";

const SIGIL_IDS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

// ---------------------------------------------------------------------------
// Simple resize-only tasks (sigil cartouches kept as-is for the popover).
// ---------------------------------------------------------------------------

type ResizeTask = {
  src: string;
  dst: string;
  width: number;
  height: number;
};

const resizeTasks: ResizeTask[] = [
  // 12 sigil cartouches — Bayer zodiac plates, center-cropped to square.
  ...SIGIL_IDS.map((id) => ({
    src: `${SOURCES}/bayer-zodiac/${id}.jpg`,
    dst: `${TARGET}/sigils/${id}.webp`,
    width: 512,
    height: 512,
  })),
];

// ---------------------------------------------------------------------------
// Dome: two Cellarius hemisphere plates → one equirectangular umber/cobalt
// painted plate. v4 replaced the painted dome with a procedural universe, so
// this pass is no longer invoked by `processAll()`. The code is preserved
// (not deleted) so the Cellarius hemispheres can be revived for a future
// section without re-deriving the recolour pipeline.
// ---------------------------------------------------------------------------

// Equirectangular at 2048×1024 (was 4096×2048). The dome sits at radius ~90
// in world units; the camera never gets within a quarter of the dome's
// surface, so the 2× downsize is invisible in motion and saves ~1 MB on the
// section's primary asset. The plan permits this as the budget-pressure
// fallback.
const DOME_WIDTH = 2048;
const DOME_HEIGHT = 1024;
const HEMI_HEIGHT = DOME_HEIGHT / 2;

async function buildDome(): Promise<string | null> {
  const north = `${SOURCES}/cellarius/northern-hemisphere.jpg`;
  const south = `${SOURCES}/cellarius/southern-hemisphere-christian.jpg`;
  const dst = `${TARGET}/dome.webp`;

  if (!existsSync(north) || !existsSync(south)) {
    return null;
  }

  // Each hemisphere is resized to a 4096×1024 strip via `fit: "fill"`. Yes,
  // that distorts the disc — Cellarius's stereographic projection isn't an
  // equirectangular projection, so the stars near the disc edge stretch
  // horizontally. Accepted by the plan: the dome is decorative, not
  // astronomical, and the painted detail still reads as a celestial atlas.
  //
  // The northern plate's pole is at the disc centre; in the equirectangular
  // we want the pole at the TOP row, so we flip the strip vertically before
  // joining. Same for southern but flipped so its pole sits at the BOTTOM.
  const northStrip = await sharp(north)
    .resize(DOME_WIDTH, HEMI_HEIGHT, { fit: "fill" })
    .flip()
    .toBuffer();

  const southStrip = await sharp(south).resize(DOME_WIDTH, HEMI_HEIGHT, { fit: "fill" }).toBuffer();

  // Compose the two hemispheres into one PNG-in-memory, then run the
  // recolouring pipeline against that. Sharp wants a base image, so we use
  // the northern strip extended downward by 1024px with a black backdrop.
  const stacked = await sharp({
    create: {
      width: DOME_WIDTH,
      height: DOME_HEIGHT,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([
      { input: northStrip, top: 0, left: 0 },
      { input: southStrip, top: HEMI_HEIGHT, left: 0 },
    ])
    .png()
    .toBuffer();

  // Recolour pipeline:
  //   1. `negate`  → light parchment becomes dark, ink stars become bright.
  //   2. `modulate({saturation: 0})` → strip residual scan-tint to pure value.
  //   3. `linear(slope, intercept)` → contrast curve: crush mid-greys toward
  //      the deep dome ground; lift bright stars further so they survive the
  //      subsequent tint.
  //   4. `tint("#5a3d28")` → map the (now monochrome) luminance to a warm
  //      aged-umber ramp. Bright areas land near gilt-warm; dark areas land
  //      near deep dome umber.
  //   5. Composite a soft cobalt wash on top via `soft-light`. Painted by
  //      hand on a 4096×2048 SVG gradient so it has subtle horizontal
  //      banding — looks like watercolour wash, not a flat tint.
  const cobaltWash = await renderCobaltWash(DOME_WIDTH, DOME_HEIGHT);

  // Multiply blend against a warm umber wash. This keeps the engraving's
  // luminance variation visible (paper background → mid umber, ink lines →
  // deep umber) instead of crushing everything toward black the way the
  // earlier `.tint()` pipeline did. The cobalt wash is then layered on top
  // with `soft-light` so the wash modulates without flattening.
  const umberWash = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${DOME_WIDTH}" height="${DOME_HEIGHT}">
       <rect width="${DOME_WIDTH}" height="${DOME_HEIGHT}" fill="#5a3826" />
     </svg>`,
  );

  mkdirSync(path.dirname(dst), { recursive: true });
  await sharp(stacked)
    .negate({ alpha: false })
    .modulate({ saturation: 0, brightness: 1.4 })
    .linear(1.1, -10)
    .composite([{ input: umberWash, blend: "multiply" }])
    .modulate({ saturation: 1.15 })
    .composite([{ input: cobaltWash, blend: "soft-light" }])
    .flatten({ background: "#000000" })
    .webp({ quality: 82, effort: 5 })
    .toFile(dst);

  return dst;
}

// Procedural cobalt wash overlay: a vertical gradient with horizontal banding
// at low opacity so the dome ground has subtle painted variation rather than
// a flat tint. Generated as an SVG and rasterized by sharp — no external
// asset, no parametric "mandala generator" (banned by the brief). This is a
// canvas wash, exactly the kind of marginal painted variation a real
// watercolour plate would have.
async function renderCobaltWash(w: number, h: number): Promise<Buffer> {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="cobalt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#1c2f56" stop-opacity="0.42" />
      <stop offset="50%" stop-color="#27396a" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#13203d" stop-opacity="0.48" />
    </linearGradient>
    <linearGradient id="bands" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0e1830" stop-opacity="0.12" />
      <stop offset="22%"  stop-color="#1f2f55" stop-opacity="0.04" />
      <stop offset="48%"  stop-color="#0c1428" stop-opacity="0.14" />
      <stop offset="71%"  stop-color="#1c2c50" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#0a1124" stop-opacity="0.15" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cobalt)" />
  <rect width="${w}" height="${h}" fill="url(#bands)" />
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ---------------------------------------------------------------------------
// Brass ring v2 — aggressive colour-graded fallback. Plan A was a CC0
// brushed-brass macro photo from Polyhaven; without network access in this
// session we fall back to the Ptolemaic armillary plate with a harder grade
// so the ring reads as warm metal with engraving texture, not flat paper.
// ---------------------------------------------------------------------------

async function buildBrass(): Promise<string | null> {
  const src = `${SOURCES}/cellarius/ptolemaic-armillary.jpg`;
  const dst = `${TARGET}/ring-brass-v2.webp`;
  if (!existsSync(src)) return null;

  // Sharp's `.tint()` preserves luminance, so pure-white pixels in the source
  // stay near white even after a warm tint. The Ptolemaic plate is mostly
  // paper, so a naïve tint reads as a "white ring" against the dome. To get a
  // metallic look we composite a warm brass colour on top with `multiply`
  // blend, which actually darkens the bright paper toward the brass hue
  // while leaving the engraved ink lines as their own deeper shadow tone.
  const w = 1024;
  const h = 256;
  const brassWash = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <rect width="${w}" height="${h}" fill="#a06830" />
     </svg>`,
  );

  mkdirSync(path.dirname(dst), { recursive: true });
  await sharp(src)
    .resize(w, h, { fit: "cover", position: "center" })
    .modulate({ saturation: 0, brightness: 0.95 })
    .linear(1.15, -10)
    .composite([{ input: brassWash, blend: "multiply" }])
    .modulate({ saturation: 1.2, brightness: 1.05 })
    .removeAlpha()
    .webp({ quality: 82, effort: 5 })
    .toFile(dst);

  return dst;
}

// ---------------------------------------------------------------------------
// Sun v2 — similar grade, pushed warmer (gilt) and brighter.
// ---------------------------------------------------------------------------

async function buildSun(): Promise<string | null> {
  const src = `${SOURCES}/cellarius/copernican-armillary.jpg`;
  const dst = `${TARGET}/sun-gilt-v2.webp`;
  if (!existsSync(src)) return null;

  // Same multiply trick as the brass, with a gilt warm-yellow wash so the
  // sun reads as a small burnished metal disc rather than a white dot.
  const w = 512;
  const h = 512;
  const giltWash = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <defs>
         <radialGradient id="g" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stop-color="#f0c060" />
           <stop offset="100%" stop-color="#a06820" />
         </radialGradient>
       </defs>
       <rect width="${w}" height="${h}" fill="url(#g)" />
     </svg>`,
  );

  mkdirSync(path.dirname(dst), { recursive: true });
  await sharp(src)
    .resize(w, h, { fit: "cover", position: "center" })
    .modulate({ saturation: 0, brightness: 0.95 })
    .linear(1.2, -8)
    .composite([{ input: giltWash, blend: "multiply" }])
    .modulate({ saturation: 1.25, brightness: 1.1 })
    .removeAlpha()
    .webp({ quality: 82, effort: 5 })
    .toFile(dst);

  return dst;
}

// ---------------------------------------------------------------------------
// Brushed-roughness map — desaturated mid-grey version of the existing brass
// photo, consumed by `MeshStandardMaterial.roughnessMap` so the PBR rings
// pick up a brushed-striation character on their specular reflections. The
// pipeline is grayscale → mid-grey-clamped → tight contrast around ~0.32
// roughness so the rings stay glossy-metal-ish (the material's base roughness
// is 0.32; the map modulates ±~0.1 of that).
// ---------------------------------------------------------------------------

async function buildBrushedRoughness(): Promise<string | null> {
  const src = `${TARGET}/ring-brass-v2.webp`;
  const dst = `${TARGET}/ring-brushed-roughness.webp`;
  if (!existsSync(src)) return null;

  // Source is 1024×256. Down-grade slightly for size — a roughness micro-map
  // doesn't need full colour resolution. Grayscale + a mid-grey clamp so the
  // map's values land in roughly [0.2, 0.5], not [0, 1].
  mkdirSync(path.dirname(dst), { recursive: true });
  await sharp(src)
    .resize(512, 128, { fit: "fill" })
    .grayscale()
    // Linear remap: slope 0.5 (compresses 0–255 into 0–128), intercept 64 so
    // the output settles around mid-grey (~96–192).
    .linear(0.5, 64)
    .webp({ quality: 78, effort: 5 })
    .toFile(dst);

  return dst;
}

// ---------------------------------------------------------------------------
// Runner — process simple resize tasks then the graded ones.
// ---------------------------------------------------------------------------

async function processAll(): Promise<void> {
  let totalSize = 0;
  let ok = 0;
  let skipped = 0;

  for (const t of resizeTasks) {
    if (!existsSync(t.src)) {
      console.log(`SKIP ${t.dst} (missing source: ${t.src})`);
      skipped++;
      continue;
    }
    mkdirSync(path.dirname(t.dst), { recursive: true });
    await sharp(t.src)
      .resize(t.width, t.height, { fit: "cover", position: "center" })
      .webp({ quality: 76, effort: 5 })
      .toFile(t.dst);
    const stat = statSync(t.dst);
    totalSize += stat.size;
    ok++;
    console.log(`OK   ${t.dst} (${Math.round(stat.size / 1024)} KB)`);
  }

  // v4 dropped the dome pass — kept on disk and in this file so it's
  // recoverable for a future section. The brushed-roughness pass derives
  // from the brass plate, so order: brass → sun → brushed-roughness.
  const graded = [
    // { name: "dome", fn: buildDome },  // disabled in v4; preserved above.
    { name: "brass", fn: buildBrass },
    { name: "sun", fn: buildSun },
    { name: "brushed-roughness", fn: buildBrushedRoughness },
  ] as const;
  // Reference the preserved functions so oxlint doesn't flag them as unused.
  void buildDome;
  void renderCobaltWash;

  for (const g of graded) {
    const dst = await g.fn();
    if (!dst) {
      console.log(`SKIP ${g.name} (missing source)`);
      skipped++;
      continue;
    }
    const stat = statSync(dst);
    totalSize += stat.size;
    ok++;
    console.log(`OK   ${dst} (${Math.round(stat.size / 1024)} KB)`);
  }

  console.log("");
  console.log(`${ok} written, ${skipped} skipped, total ${(totalSize / 1024).toFixed(1)} KB`);
}

processAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
