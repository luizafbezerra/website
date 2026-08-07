import { Cosmos } from "./Cosmos";
import { type Rgb, type SkyStar, type StarField, starFieldFrom } from "./StarField";

/**
 * The sky the Cosmos ships with: a warm procedural universe, deterministic from
 * a fixed seed so it is identical on the server, in the browser, and between
 * reloads.
 *
 * It is generated here rather than inside the scene components (REQ-009 /
 * TASK-034): the scene now consumes a `CosmosSky` it is handed, and this is the
 * default supplier. "O céu desta noite" becomes a second supplier of the same
 * type — no change to the renderer, and this module stays testable without a
 * canvas.
 *
 * Mobile halves both counts, which is a fillrate decision (the scroll-cinema is
 * bound by sprite overdraw, not by CPU), carried in the data rather than in the
 * component that draws it.
 */

export type CosmosSky = {
  /** ~4000 stars on a thick shell at radii 30–80 — the textured sky. */
  deepField: StarField;
  /** ~1200 stars along an inclined great circle — the warm river across it. */
  galaxyBand: StarField;
};

export type ProceduralSkyOptions = { mobile?: boolean };

const MOBILE_COUNT_SCALE = 0.5;

type PaletteStop = readonly [cumulativeWeight: number, rgb: Rgb];

/** Cumulative-weight stops for a palette, in the order the weights were given. */
function paletteStops(
  palette: Record<string, { weight: number; rgb: Rgb }>,
  order: readonly string[],
): PaletteStop[] {
  const stops: PaletteStop[] = [];
  let cumulative = 0;
  for (const key of order) {
    cumulative += palette[key].weight;
    stops.push([cumulative, palette[key].rgb]);
  }

  return stops;
}

function pickColor(stops: readonly PaletteStop[], roll: number): Rgb {
  for (const [stop, rgb] of stops) {
    if (roll < stop) return rgb;
  }

  return stops[stops.length - 1][1];
}

/** Per-star brightness jitter, so a field never reads as one flat value. */
const shade = (rgb: Rgb, factor: number): Rgb => [
  rgb[0] * factor,
  rgb[1] * factor,
  rgb[2] * factor,
];

const scaledCount = (count: number, mobile: boolean) =>
  Math.floor(count * (mobile ? MOBILE_COUNT_SCALE : 1));

export function buildDeepField({ mobile = false }: ProceduralSkyOptions = {}): StarField {
  const total = scaledCount(Cosmos.deepField.count, mobile);
  const rng = Cosmos.mulberry32(0xdeefe1d);
  const stops = paletteStops(Cosmos.deepField.palette, ["cream", "gilt", "terracotta", "coolBlue"]);

  const stars: SkyStar[] = [];
  for (let index = 0; index < total; index++) {
    const radius = Cosmos.lerp(Cosmos.deepField.radiusMin, Cosmos.deepField.radiusMax, rng());
    const position = Cosmos.sampleOnSphere(rng, radius);
    const color = pickColor(stops, rng());
    stars.push({ position, color: shade(color, 0.7 + rng() * 0.3) });
  }

  return starFieldFrom(stars);
}

/**
 * Rejection sampling: take uniform-on-sphere points and keep only those within
 * `halfWidthDeg` of the band's plane. The attempt cap is a runaway guard — with
 * a ±12° band it is never approached.
 */
const GALAXY_BAND_ATTEMPTS_PER_STAR = 50;

export function buildGalaxyBand({ mobile = false }: ProceduralSkyOptions = {}): StarField {
  const total = scaledCount(Cosmos.galaxyBand.count, mobile);
  const rng = Cosmos.mulberry32(0xba9ad);
  const stops = paletteStops(Cosmos.galaxyBand.palette, ["cream", "gilt", "terracotta"]);

  const [nx, ny, nz] = Cosmos.galaxyBand.planeNormal;
  const length = Math.hypot(nx, ny, nz);
  const normal: Cosmos.Vec3 = [nx / length, ny / length, nz / length];
  const halfWidth = Math.sin((Cosmos.galaxyBand.halfWidthDeg * Math.PI) / 180);

  const stars: SkyStar[] = [];
  let attempts = 0;
  while (stars.length < total && attempts < total * GALAXY_BAND_ATTEMPTS_PER_STAR) {
    attempts++;
    const radius = Cosmos.lerp(Cosmos.galaxyBand.radiusMin, Cosmos.galaxyBand.radiusMax, rng());
    const position = Cosmos.sampleOnSphere(rng, radius);

    // Distance from the plane through the origin, over the radius — the sine of
    // the latitude relative to that plane.
    const latitude =
      Math.abs(position[0] * normal[0] + position[1] * normal[1] + position[2] * normal[2]) /
      radius;
    if (latitude > halfWidth) continue;

    const color = pickColor(stops, rng());
    stars.push({ position, color: shade(color, 0.75 + rng() * 0.3) });
  }

  return starFieldFrom(stars);
}

export function proceduralSky(options: ProceduralSkyOptions = {}): CosmosSky {
  return {
    deepField: buildDeepField(options),
    galaxyBand: buildGalaxyBand(options),
  };
}
