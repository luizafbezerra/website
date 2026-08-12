// One-shot conversion: raw public-domain JPGs in `references/cosmos-sources/`
// → resized + colour-graded WebPs at the paths the cosmos components expect
// under `public/art/cosmos/`. Simple passes are resize-only; the dome, brass
// and sun passes apply value-inversion / tint / contrast curves so the source
// pale-parchment engravings read as the v3 "tipped-in plate" palette
// (aged-sepia umber + cobalt wash + gilt stars / brass rings).
//
// Run: `pnpm tsx scripts/cosmos-textures.ts`

import { existsSync, mkdirSync, statSync } from "node:fs";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { Cosmos } from "@/domain/cosmos/Cosmos";

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

// (v5 dropped the SVG horizon + ellipse-cloud plate passes — the descent
// beat is rebuilt around an FBM cloud shader + denser constellation network
// in `src/ui/home/cosmos/`. No new texture assets need to be emitted for
// the descent beat.)

// ---------------------------------------------------------------------------
// v8 painted-prelude prop assets. Replaces the v7 five-band painted layers
// with a sparse arrangement of discrete cut-out props (clouds, land strip,
// trees, rocks, bush, single figure). The 3D nebula + deep field + comets
// behind these props ARE the sky — no painted sky layer. Each prop is a
// solid PNG with transparent alpha so the 3D cosmos shows through *between*
// props but never *through* them.
//
// Source PNGs live in `references/cosmos-sources/prelude/` (gitignored —
// AI-generated cut-outs supplied by the user). The bake resizes each source
// to a WebP at `public/art/cosmos/prelude/${assetId}.webp` (one bake per
// asset; multiple prop instances in `Cosmos.preludeProps` can share an
// asset). `land.png` also gets a bake-time top crop + top-edge alpha fade
// so its painted strip dissolves into the 3D sky above it.
// ---------------------------------------------------------------------------

const PRELUDE_SOURCE_DIR = `${SOURCES}/prelude`;
const PRELUDE_TARGET_DIR = `${TARGET}/prelude`;

// Source PNG filename per asset id. Sources live in
// `references/cosmos-sources/prelude/`; the .gitignore in that directory keeps
// the AI-generated PNGs out of the repo. Each asset bakes to one WebP; the
// scene's prop instances reference assets by id (multiple instances can share
// an asset — see `Cosmos.preludeProps`).
const PRELUDE_ASSET_SOURCES: Record<Cosmos.PreludeAssetId, string> = {
  "cloud-dense": "clouds02.png",
  "cloud-soft": "clouds.png",
  land: "land.png",
  "tree-left": "tree01.png",
  "tree-right": "tree02.png",
  "rock-near": "rock02.png",
  "rock-far": "rock01.png",
  bush: "bush01.png",
  figure: "person01.png",
};

// Bake-time crop per asset. Empty by default — sources are baked as-is. Add
// an entry here if a source PNG includes baked content that conflicts with
// the 3D scene (e.g., a baked sky inside a horizon plate that the 3D nebula
// should own). Values are source-image fractions in [0..1].
const PRELUDE_ASSET_CROPS: Partial<
  Record<Cosmos.PreludeAssetId, { top: number; left: number; width: number; height: number }>
> = {
  // Crop the upper 30% of the painted land. The source's top region is a
  // baked sunset sky that the 3D nebula owns above; removing it widens
  // the effective aspect (1.5:1 → ~2.14:1) so the prop can scale to
  // cover the full screen width on wide viewports without becoming so
  // tall that it dominates the frame vertically.
  land: { top: 0.3, left: 0, width: 1.0, height: 0.7 },
};

// Subtle top-edge alpha fade per asset, as a fraction of cropped image
// height. `land`'s painted sky at the top dissolves into the 3D nebula
// behind it — a tiny ~5% fade softens the otherwise hard upper edge
// without the heavy-handed look of a larger gradient.
const PRELUDE_ASSET_TOP_FADE: Partial<Record<Cosmos.PreludeAssetId, number>> = {
  land: 0.05,
};

// Cap the long side; smaller sources pass through at native size. 2048 is
// a balance: large enough that the painted land doesn't upscale visibly on
// 4K viewports, small enough that the WebP file size stays reasonable
// (~hundreds of KB rather than megabytes).
const PRELUDE_MAX_DIM = 2048;

// WebP settings for the painted prelude. These nine assets are the home page's
// single largest download — 1.33 MB warmed into the HTTP cache on desktop while
// the visitor is still reading the first screens — so what they cost matters as
// much as how they look.
//
// Quality 75 rather than 85 is the knee of the curve, measured against the q85
// bake across all nine: 22–24% off the heavy ones (land, both cloud plates) for
// a mean difference of ~2/255, under 1%. Dropping further to 68 buys another 3%
// and is not worth spending on a scene the eye never sees at rest — these are
// soft painted cut-outs, alpha-composited, blurred by depth of field and moving
// past the camera. Effort 6 is the encoder's slowest setting: it costs bake time
// only, and gives ~6% for nothing at runtime.
//
// `alphaQuality` is the lever the tuning above never pulled: sharp defaults it to
// 100, so every prop was carrying a losslessly-encoded alpha channel next to a
// q75 colour channel. These masks are feathered cut-out edges, not detail — the
// thing alpha compression degrades is precisely the thing depth-of-field blur and
// alpha compositing hide. 70 is the knee of the curve: it halves `land.webp`,
// where 60 and 50 buy under 1% more between them.
const PRELUDE_WEBP = { quality: 75, effort: 6, alphaQuality: 70 } as const;

async function buildPreludeAsset(assetId: Cosmos.PreludeAssetId): Promise<string | null> {
  const filename = PRELUDE_ASSET_SOURCES[assetId];
  const src = `${PRELUDE_SOURCE_DIR}/${filename}`;
  const dst = `${PRELUDE_TARGET_DIR}/${assetId}.webp`;
  if (!existsSync(src)) return null;

  mkdirSync(path.dirname(dst), { recursive: true });

  let pipe = sharp(src);
  const crop = PRELUDE_ASSET_CROPS[assetId];
  if (crop) {
    const meta = await pipe.metadata();
    const sw = meta.width ?? 0;
    const sh = meta.height ?? 0;
    if (sw > 0 && sh > 0) {
      pipe = sharp(src).extract({
        left: Math.max(0, Math.floor(crop.left * sw)),
        top: Math.max(0, Math.floor(crop.top * sh)),
        width: Math.min(sw, Math.floor(crop.width * sw)),
        height: Math.min(sh, Math.floor(crop.height * sh)),
      });
    }
  }

  const resized = await pipe
    .resize(PRELUDE_MAX_DIM, PRELUDE_MAX_DIM, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  const topFade = PRELUDE_ASSET_TOP_FADE[assetId];
  if (topFade && topFade > 0) {
    const meta = await sharp(resized).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    if (w > 0 && h > 0) {
      const fadeStop = Math.max(0, Math.min(1, topFade)) * 100;
      // SVG linear gradient mask. `blend: "dest-in"` multiplies the
      // base alpha by the mask, so only the top edge fades — interior
      // pixels are untouched.
      const fadeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="white" stop-opacity="0"/>
            <stop offset="${fadeStop}%" stop-color="white" stop-opacity="1"/>
            <stop offset="100%" stop-color="white" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#g)"/>
      </svg>`;
      await sharp(resized)
        .composite([{ input: Buffer.from(fadeSvg), blend: "dest-in" }])
        .webp(PRELUDE_WEBP)
        .toFile(dst);
      return dst;
    }
  }

  await sharp(resized).webp(PRELUDE_WEBP).toFile(dst);
  return dst;
}

// All asset IDs declared by `Cosmos.PreludeAssetId`. Derived from the
// source-filename map so the two stay in sync.
const PRELUDE_ASSET_IDS = Object.keys(PRELUDE_ASSET_SOURCES) as Cosmos.PreludeAssetId[];

// 2D-flattened composite for the mobile / reduced-motion fallback. Projects
// each prop from its 3D world position to image pixel coords as the camera
// would see it at p=0 (camera at (0, 1.4, 25), look at (0, 1.4, 0), FOV =
// `Cosmos.cameraFovDeg`), then composites the resized props over a parchment
// background. Props that project entirely off-screen at p=0 are skipped —
// the static image shows whatever IS in the frustum at p=0, matching the
// desktop scene the visitor sees on first entry.

const COMPOSITE_W = 1024;
const COMPOSITE_H = 512;
const COMPOSITE_BACKGROUND = "#f7f1e3"; // matches oklch(0.97 0.012 75) parchment

async function buildPreludeComposite(): Promise<string | null> {
  const dst = `${PRELUDE_TARGET_DIR}/composite-mobile.webp`;
  mkdirSync(path.dirname(dst), { recursive: true });

  const cameraY = 1.4;
  const cameraZ = 25;
  const fovTanHalf = Math.tan(((Cosmos.cameraFovDeg / 2) * Math.PI) / 180);
  const aspect = COMPOSITE_W / COMPOSITE_H;

  type Overlay = { input: Buffer; left: number; top: number };
  const overlays: Overlay[] = [];

  // Composite far props first so near props paint over them at seams. Sort
  // by ascending z (smaller z = farther from camera at z=25 = composite earlier).
  const sorted = [...Cosmos.preludeProps].sort((a, b) => a.position[2] - b.position[2]);
  for (const prop of sorted) {
    const webpPath = `${PRELUDE_TARGET_DIR}/${prop.asset}.webp`;
    if (!existsSync(webpPath)) continue;

    const meta = await sharp(webpPath).metadata();
    const texW = meta.width ?? 0;
    const texH = meta.height ?? 0;
    if (texW === 0 || texH === 0) continue;
    const texAspect = texW / texH;

    const distance = cameraZ - prop.position[2];
    if (distance <= 0) continue;

    const yOffset = prop.anchor === "bottom" ? prop.scale / 2 : 0;
    const worldX = prop.position[0];
    const worldY = prop.position[1] + yOffset - cameraY;

    const halfH = fovTanHalf * distance;
    const halfW = halfH * aspect;

    const ndcX = worldX / halfW;
    const ndcY = worldY / halfH;

    const propWorldHeight = prop.scale;
    const propWorldWidth = prop.scale * texAspect;
    const propPxH = Math.round((propWorldHeight / (2 * halfH)) * COMPOSITE_H);
    const propPxW = Math.round((propWorldWidth / (2 * halfW)) * COMPOSITE_W);
    if (propPxH < 1 || propPxW < 1) continue;

    const centerPxX = ((ndcX + 1) / 2) * COMPOSITE_W;
    const centerPxY = ((1 - ndcY) / 2) * COMPOSITE_H;
    const left = Math.round(centerPxX - propPxW / 2);
    const top = Math.round(centerPxY - propPxH / 2);

    // Skip overlays that fall entirely outside the canvas.
    const visLeft = Math.max(0, left);
    const visTop = Math.max(0, top);
    const visRight = Math.min(COMPOSITE_W, left + propPxW);
    const visBot = Math.min(COMPOSITE_H, top + propPxH);
    const visW = visRight - visLeft;
    const visH = visBot - visTop;
    if (visW <= 0 || visH <= 0) continue;

    // Resize the source to its projected pixel size, then crop down to the
    // canvas-visible region. Sharp's `.composite()` rejects overlays larger
    // than the base image — a prop wider than `COMPOSITE_W` (e.g. `land`)
    // must be cropped to its visible slice before it can be composited.
    let resized = await sharp(webpPath).resize(propPxW, propPxH, { fit: "fill" }).png().toBuffer();
    const insetX = visLeft - left;
    const insetY = visTop - top;
    if (insetX > 0 || insetY > 0 || visW < propPxW || visH < propPxH) {
      resized = await sharp(resized)
        .extract({ left: insetX, top: insetY, width: visW, height: visH })
        .png()
        .toBuffer();
    }
    overlays.push({ input: resized, left: visLeft, top: visTop });
  }

  if (overlays.length === 0) return null;

  await sharp({
    create: {
      width: COMPOSITE_W,
      height: COMPOSITE_H,
      channels: 3,
      background: COMPOSITE_BACKGROUND,
    },
  })
    .composite(overlays.map((o) => ({ input: o.input, left: o.left, top: o.top })))
    .webp({ quality: 80, effort: 5 })
    .toFile(dst);

  return dst;
}

// Remove stale WebPs from `public/art/cosmos/prelude/` — old prop-id-keyed
// files from before the asset/prop split (cloud-far.webp, cloud-near.webp,
// etc.), plus anything from prior prelude iterations.
async function cleanupPreludeArtifacts(): Promise<void> {
  if (!existsSync(PRELUDE_TARGET_DIR)) return;
  const validNames = new Set<string>([
    ...PRELUDE_ASSET_IDS.map((id) => `${id}.webp`),
    "composite-mobile.webp",
  ]);
  const entries = await readdir(PRELUDE_TARGET_DIR);
  for (const name of entries) {
    if (!name.endsWith(".webp")) continue;
    if (validNames.has(name)) continue;
    const full = path.join(PRELUDE_TARGET_DIR, name);
    await unlink(full);
    console.log(`RM   ${full}`);
  }
}

async function buildPreludeAssets(): Promise<string[]> {
  const written: string[] = [];
  mkdirSync(PRELUDE_SOURCE_DIR, { recursive: true });
  mkdirSync(PRELUDE_TARGET_DIR, { recursive: true });

  await cleanupPreludeArtifacts();

  for (const assetId of PRELUDE_ASSET_IDS) {
    const dst = await buildPreludeAsset(assetId);
    if (dst) {
      written.push(dst);
      const stat = statSync(dst);
      console.log(`OK   ${dst} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.log(`SKIP ${assetId} (missing source)`);
    }
  }

  const composite = await buildPreludeComposite();
  if (composite) {
    written.push(composite);
    const stat = statSync(composite);
    console.log(`OK   ${composite} (${Math.round(stat.size / 1024)} KB)`);
  }

  return written;
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

  // Both the dome and the gilt-sun passes are disabled, and their outputs are
  // gone from `public/`: v4 replaced the painted dome with a procedural universe
  // and the sun with a procedural glow sprite, so the two plates were shipping to
  // every visitor's `public/` tree while nothing on the page ever requested them
  // (578 KB). The passes stay here, preserved like the dome pass always was, so
  // either is one uncommented line away from returning.
  //
  // The brass pass is NOT vestigial in the same way, even though nothing loads
  // ring-brass-v2.webp directly: brushed-roughness derives from it, and that map
  // is sampled by the armillary's matcap bake. Hence the order brass →
  // brushed-roughness, and hence the plate stays on disk.
  const graded = [
    // { name: "dome", fn: buildDome },  // disabled in v4; preserved above.
    { name: "brass", fn: buildBrass },
    // { name: "sun", fn: buildSun },   // disabled: the sun is procedural now.
    { name: "brushed-roughness", fn: buildBrushedRoughness },
  ] as const;
  // Reference the preserved functions so oxlint doesn't flag them as unused.
  void buildDome;
  void buildSun;
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

  // Painted-prelude assets. Source PNGs live in
  // `references/cosmos-sources/prelude/`; missing sources skip silently
  // (the runtime mesh stays hidden until its texture loads).
  const preludeWritten = await buildPreludeAssets();
  for (const dst of preludeWritten) {
    const stat = statSync(dst);
    totalSize += stat.size;
    ok++;
  }

  console.log("");
  console.log(`${ok} written, ${skipped} skipped, total ${(totalSize / 1024).toFixed(1)} KB`);
}

processAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
