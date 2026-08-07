// **O céu desta noite** (CONCEPT §9.5) — the real sky over São Paulo, reduced
// to what a chart needs to draw it.
//
// The figures are the ones the 3D Cosmos already uses: 26 real Bright Star
// Catalog constellations, stored as cartesian points on a sphere. This module
// turns them back into right ascension and declination, rotates them into the
// observer's horizon frame for a given instant, and projects the half of the
// sphere that is actually above the horizon onto a unit disc.
//
// Everything here is arithmetic. No network, no key, no per-visitor input —
// the same precedent as `moonPhase.ts`, and the reason the section can claim to
// index a place and a time rather than a person: the observer is a constant,
// and the instant comes from the render, not from the visitor.
//
// Coordinates come out on the **unit disc** (x and y in −1…1, the horizon at
// radius 1), not in pixels. Where the chart is drawn, and how big, is the
// view's business.
//
// Pure TS — no React/Next imports, per the domain-layer rules.

import { CONSTELLATION_RADIUS, constellations } from "./constellations";
import { magnitudeAt } from "./starMagnitudes";

const DEG = Math.PI / 180;

/** Where the sky is being observed from. */
export type Observer = {
  latitudeDeg: number;
  longitudeDeg: number;
};

/** The clinic's sky: São Paulo, which is the one the site claims. */
export const SAO_PAULO: Observer = { latitudeDeg: -23.55, longitudeDeg: -46.63 };

/** A star placed on the chart. */
export type PlottedStar = {
  /** Stable across renders — `constellation.id` + its index in that figure's star list. Two stars can project to the same x,y (shared boundary stars, or just close enough in float), so the position itself can't be the identity. */
  id: string;
  /** −1…1, east to the left — the planisphere convention. */
  x: number;
  /** −1…1, north at the top. */
  y: number;
  /** Apparent visual magnitude; lower is brighter. */
  magnitude: number;
};

/** One segment of a constellation figure, both ends above the horizon. */
export type PlottedLine = { x1: number; y1: number; x2: number; y2: number };

export type NightSky = {
  stars: PlottedStar[];
  figures: PlottedLine[];
  /** The instant this sky was computed for. */
  at: Date;
};

/**
 * The sky over `observer` at `at`, as a chart.
 *
 * Stars below the horizon are dropped rather than folded in: a chart that drew
 * them would be a chart of the celestial sphere, not of tonight.
 */
export function computeNightSky(at: Date, observer: Observer = SAO_PAULO): NightSky {
  const lst = localSiderealDeg(at, observer.longitudeDeg);

  const stars: PlottedStar[] = [];
  const figures: PlottedLine[] = [];

  for (const constellation of constellations) {
    const placed = constellation.stars.map((star) => {
      const { raH, decDeg } = equatorialFrom(star);
      const horizon = toHorizon(raH, decDeg, lst, observer.latitudeDeg);
      return {
        ...project(horizon),
        magnitude: magnitudeAt(raH, decDeg),
        visible: horizon.altitudeDeg > 0,
      };
    });

    placed.forEach((point, index) => {
      if (!point.visible) return;
      stars.push({
        id: `${constellation.id}-${index}`,
        x: point.x,
        y: point.y,
        magnitude: point.magnitude,
      });
    });

    // A segment is drawn only when the whole segment is in the sky, so no
    // figure line crosses the horizon ring on its way to a star that has set.
    for (const [from, to] of constellation.lines) {
      const a = placed[from];
      const b = placed[to];
      if (!a?.visible || !b?.visible) continue;
      figures.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }

  return { stars, figures, at };
}

/**
 * Where a compass bearing meets the horizon ring, on the same unit disc.
 *
 * The chart's cardinal marks need this, and they must not re-derive the
 * orientation — if the projection's handedness ever changes, the marks have to
 * change with it or the chart becomes a mirror of the sky.
 */
export function horizonPoint(azimuthDeg: number): { x: number; y: number } {
  return project({ altitudeDeg: 0, azimuthDeg });
}

/* ---------------------------------------------------------------- internals */

/**
 * Cartesian on the constellation sphere → right ascension and declination.
 *
 * `constellations.ts` stores what the 3D scene needs; the mapping it documents
 * is invertible, so the chart reads the same data rather than a second copy of
 * it that could drift.
 */
function equatorialFrom([x, y, z]: readonly [number, number, number]): {
  raH: number;
  decDeg: number;
} {
  const decDeg = Math.asin(clamp(y / CONSTELLATION_RADIUS, -1, 1)) / DEG;
  const raDeg = (Math.atan2(z, x) / DEG + 360) % 360;
  return { raH: raDeg / 15, decDeg };
}

/** Greenwich mean sidereal time in degrees, then carried east to the observer. */
function localSiderealDeg(at: Date, longitudeDeg: number): number {
  // Julian date, from the Unix epoch at JD 2440587.5.
  const julianDate = at.getTime() / 86_400_000 + 2_440_587.5;
  const centuriesSinceJ2000 = julianDate - 2_451_545.0;
  const gmst = 280.46061837 + 360.98564736629 * centuriesSinceJ2000;
  return normalizeDeg(gmst + longitudeDeg);
}

/** Equatorial → horizontal, for an observer at `latitudeDeg` and sidereal time `lstDeg`. */
function toHorizon(
  raH: number,
  decDeg: number,
  lstDeg: number,
  latitudeDeg: number,
): { altitudeDeg: number; azimuthDeg: number } {
  const hourAngle = (lstDeg - raH * 15) * DEG;
  const dec = decDeg * DEG;
  const lat = latitudeDeg * DEG;

  const sinAltitude =
    Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle);
  const altitude = Math.asin(clamp(sinAltitude, -1, 1));

  // Measured from north, through east.
  const azimuth = Math.atan2(
    -Math.sin(hourAngle) * Math.cos(dec),
    (Math.sin(dec) - Math.sin(lat) * Math.sin(altitude)) / Math.cos(lat),
  );

  return { altitudeDeg: altitude / DEG, azimuthDeg: normalizeDeg(azimuth / DEG) };
}

/**
 * Stereographic projection from the zenith onto the horizon disc.
 *
 * Stereographic rather than equidistant because it preserves shape: the Cruzeiro
 * do Sul has to still look like the Cruzeiro do Sul near the rim, which is
 * exactly where a São Paulo winter sky puts it.
 *
 * North at the top and east to the *left*, because the chart is read holding it
 * up against the sky rather than laid flat like a map of the ground.
 */
function project({ altitudeDeg, azimuthDeg }: { altitudeDeg: number; azimuthDeg: number }): {
  x: number;
  y: number;
} {
  const zenithDistance = (90 - altitudeDeg) * DEG;
  // tan(z/2) reaches exactly 1 at the horizon, which is what puts the horizon
  // on the unit circle and lets the view scale the disc by a single number.
  const radius = Math.tan(zenithDistance / 2);
  const azimuth = azimuthDeg * DEG;
  return { x: -radius * Math.sin(azimuth), y: -radius * Math.cos(azimuth) };
}

function normalizeDeg(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
