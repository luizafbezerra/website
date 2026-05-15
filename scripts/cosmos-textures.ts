// One-shot conversion: raw public-domain JPGs in `references/cosmos-sources/`
// → resized WebPs at the paths the cosmos components expect under
// `public/art/cosmos/`. No color editing — the JPGs go in as-is, only
// resized + re-encoded. Hand-edited replacements can swap in later at the
// same paths.
//
// Run: `pnpm tsx scripts/cosmos-textures.ts`

import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Task = {
  src: string;
  dst: string;
  width: number;
  height: number;
};

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

const tasks: Task[] = [
  // 12 sigil cartouches — Bayer zodiac plates, center-cropped to square.
  ...SIGIL_IDS.map((id) => ({
    src: `${SOURCES}/bayer-zodiac/${id}.jpg`,
    dst: `${TARGET}/sigils/${id}.webp`,
    width: 512,
    height: 512,
  })),

  // Brass ring — Ptolemaic armillary engraving, tileable strip.
  {
    src: `${SOURCES}/cellarius/ptolemaic-armillary.jpg`,
    dst: `${TARGET}/ring-brass.webp`,
    width: 512,
    height: 512,
  },

  // Gilt sun face — Copernican plate, center crop where the sun sits.
  {
    src: `${SOURCES}/cellarius/copernican-armillary.jpg`,
    dst: `${TARGET}/sun-gilt.webp`,
    width: 256,
    height: 256,
  },

  // Milky Way band — northern hemisphere plate, 2:1 strip.
  {
    src: `${SOURCES}/cellarius/northern-hemisphere.jpg`,
    dst: `${TARGET}/milky-way.webp`,
    width: 1024,
    height: 512,
  },

  // Nebula cloud washes — 4 different Cellarius plates, square crops.
  {
    src: `${SOURCES}/cellarius/ptolemaic-hypothesis.jpg`,
    dst: `${TARGET}/nebula-1.webp`,
    width: 512,
    height: 512,
  },
  {
    src: `${SOURCES}/cellarius/copernican-planisphere.jpg`,
    dst: `${TARGET}/nebula-2.webp`,
    width: 512,
    height: 512,
  },
  {
    src: `${SOURCES}/cellarius/southern-hemisphere-christian.jpg`,
    dst: `${TARGET}/nebula-3.webp`,
    width: 512,
    height: 512,
  },
  {
    src: `${SOURCES}/cellarius/northern-hemisphere.jpg`,
    dst: `${TARGET}/nebula-4.webp`,
    width: 512,
    height: 512,
  },
];

async function processAll(): Promise<void> {
  let totalSize = 0;
  let ok = 0;
  let skipped = 0;
  for (const t of tasks) {
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
  console.log("");
  console.log(`${ok} written, ${skipped} skipped, total ${(totalSize / 1024).toFixed(1)} KB`);
}

processAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
