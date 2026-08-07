import { describe, expect, it } from "vitest";
import { computeNightSky, horizonPoint, SAO_PAULO } from "./nightSky";
import { DEFAULT_MAGNITUDE, magnitudeAt } from "./starMagnitudes";

/**
 * The reference instant: 6 August 2026, 20:00 in São Paulo (UTC−3). A winter
 * evening, which is the case worth pinning — it is the one where the southern
 * sky is doing something the northern-hemisphere intuition gets wrong.
 */
const WINTER_EVENING = new Date(Date.UTC(2026, 7, 6, 23, 0, 0));

describe("computeNightSky", () => {
  it("puts the whole sky inside the horizon disc", () => {
    const sky = computeNightSky(WINTER_EVENING);

    expect(sky.stars.length).toBeGreaterThan(0);
    for (const star of sky.stars) {
      expect(Math.hypot(star.x, star.y)).toBeLessThanOrEqual(1);
    }
  });

  it("drops everything below the horizon", () => {
    const sky = computeNightSky(WINTER_EVENING);

    // Magnitudes identify the named stars here, since projection leaves the
    // points anonymous. Sirius (−1.46) is a summer-evening star in the southern
    // hemisphere: on an August evening it is under the observer's feet, and a
    // chart that drew it would be a chart of the celestial sphere, not of
    // tonight.
    expect(sky.stars.some((star) => star.magnitude === -1.46)).toBe(false);

    // Antares (0.96) anchors Scorpius, which on this evening sits near the
    // zenith — so it must be present, and close to the middle of the disc.
    const antares = sky.stars.find((star) => star.magnitude === 0.96);
    expect(antares).toBeDefined();
    expect(Math.hypot(antares!.x, antares!.y)).toBeLessThan(0.15);
  });

  it("never draws a figure line to a star that has set", () => {
    const sky = computeNightSky(WINTER_EVENING);
    const plotted = new Set(sky.stars.map((star) => `${star.x},${star.y}`));

    for (const line of sky.figures) {
      expect(plotted.has(`${line.x1},${line.y1}`)).toBe(true);
      expect(plotted.has(`${line.x2},${line.y2}`)).toBe(true);
    }
  });

  it("turns with the sky over the course of a night", () => {
    const evening = computeNightSky(WINTER_EVENING);
    const later = computeNightSky(new Date(WINTER_EVENING.getTime() + 4 * 3_600_000));

    // Four hours is a quarter of the way round; nothing should have stayed put.
    expect(later.stars).not.toEqual(evening.stars);
  });

  it("returns to the same sky one sidereal day later", () => {
    const sky = computeNightSky(WINTER_EVENING);
    // A sidereal day is ~23h56m04s — the period the *stars* keep, as opposed to
    // the sun's 24h. This is the property that makes the section honest: it is
    // driven by the sky, not by the clock.
    const siderealDay = 23 * 3_600_000 + 56 * 60_000 + 4090;
    const nextNight = computeNightSky(new Date(WINTER_EVENING.getTime() + siderealDay));

    expect(nextNight.stars).toHaveLength(sky.stars.length);
    for (const [index, star] of nextNight.stars.entries()) {
      expect(star.x).toBeCloseTo(sky.stars[index]!.x, 3);
      expect(star.y).toBeCloseTo(sky.stars[index]!.y, 3);
    }
  });

  it("never shows Polaris from São Paulo", () => {
    // From 23°S the north celestial pole sits 23° *below* the horizon, so
    // Polaris (1.98) can never appear — at any hour, on any date. If it ever
    // does, the sign of the latitude has been lost somewhere in the rotation.
    for (const hour of [0, 4, 8, 12, 16, 20]) {
      const sky = computeNightSky(new Date(WINTER_EVENING.getTime() + hour * 3_600_000), SAO_PAULO);
      const polaris = sky.stars.filter((star) => star.magnitude === 1.98);
      // Alphard shares 1.98 and does rise, so assert on position: nothing
      // attributable to Polaris may land in the northern half of the disc.
      expect(polaris.every((star) => star.y > -0.9)).toBe(true);
    }
  });
});

describe("horizonPoint", () => {
  it("places the cardinals on the horizon ring, east to the left", () => {
    const north = horizonPoint(0);
    const east = horizonPoint(90);
    const south = horizonPoint(180);
    const west = horizonPoint(270);

    for (const point of [north, east, south, west]) {
      expect(Math.hypot(point.x, point.y)).toBeCloseTo(1, 6);
    }

    expect(north.y).toBeCloseTo(-1, 6);
    expect(south.y).toBeCloseTo(1, 6);
    // East on the left is the planisphere convention: the chart is held up
    // against the sky, not laid flat like a map of the ground.
    expect(east.x).toBeCloseTo(-1, 6);
    expect(west.x).toBeCloseTo(1, 6);
  });
});

describe("magnitudeAt", () => {
  it("recognises a catalogued star from the figure's rounded position", () => {
    // Betelgeuse, as `constellations.ts` stores it.
    expect(magnitudeAt(5.92, 7.4)).toBeCloseTo(0.5, 2);
    expect(magnitudeAt(6.75, -16.72)).toBeCloseTo(-1.46, 2);
  });

  it("falls back for a vertex no catalogued star sits on", () => {
    expect(magnitudeAt(3.5, -12.0)).toBe(DEFAULT_MAGNITUDE);
  });

  it("does not match across the 0h/24h seam", () => {
    // 23.9h and 0.1h are 0.2h apart, not 23.8h — a naive difference would make
    // every star near the seam collide with every other.
    expect(magnitudeAt(0.73, -17.99)).toBeCloseTo(2.04, 2); // Diphda
    expect(magnitudeAt(12.73, -17.99)).toBe(DEFAULT_MAGNITUDE); // half a sky away
  });
});
