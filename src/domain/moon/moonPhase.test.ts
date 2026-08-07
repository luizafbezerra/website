import { describe, expect, it } from "vitest";
import { isMoonPhase, MOON_PHASES, moonPhaseAt, moonPhaseCenterFraction } from "./moonPhase";

const SYNODIC_MONTH_MS = 29.530588853 * 24 * 60 * 60 * 1000;
const REFERENCE_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));

const atOffset = (cycleFraction: number) =>
  new Date(REFERENCE_NEW_MOON.getTime() + cycleFraction * SYNODIC_MONTH_MS);

describe("moonPhaseAt", () => {
  it("reads the reference instant as a new moon", () => {
    const moon = moonPhaseAt(REFERENCE_NEW_MOON);
    expect(moon.phase).toBe("new");
    expect(moon.illumination).toBeCloseTo(0, 5);
  });

  it("names the quarters and the full moon at their own points in the cycle", () => {
    expect(moonPhaseAt(atOffset(0.25)).phase).toBe("firstQuarter");
    expect(moonPhaseAt(atOffset(0.5)).phase).toBe("full");
    expect(moonPhaseAt(atOffset(0.75)).phase).toBe("lastQuarter");
  });

  it("lights the disc fully at the full moon and half at the quarters", () => {
    expect(moonPhaseAt(atOffset(0.5)).illumination).toBeCloseTo(1, 5);
    expect(moonPhaseAt(atOffset(0.25)).illumination).toBeCloseTo(0.5, 5);
    expect(moonPhaseAt(atOffset(0.75)).illumination).toBeCloseTo(0.5, 5);
  });

  it("walks all eight names once per cycle", () => {
    const names = MOON_PHASES.map((_, index) => moonPhaseAt(atOffset(index / 8)).phase);
    expect(names).toEqual([...MOON_PHASES]);
  });

  it("repeats after one synodic month", () => {
    const now = new Date("2026-08-05T22:00:00Z");
    const next = new Date(now.getTime() + SYNODIC_MONTH_MS);
    expect(moonPhaseAt(next).phase).toBe(moonPhaseAt(now).phase);
    expect(moonPhaseAt(next).illumination).toBeCloseTo(moonPhaseAt(now).illumination, 6);
  });

  // Eclipses are the observable ground truth: a solar eclipse can only happen at
  // a new moon and a lunar eclipse only at a full one. These two anchor the
  // model against the sky rather than against itself.
  it("calls the 2024-04-08 total solar eclipse a new moon", () => {
    expect(moonPhaseAt(new Date("2024-04-08T18:17:00Z")).phase).toBe("new");
  });

  it("calls the 2025-03-14 total lunar eclipse a full moon", () => {
    const moon = moonPhaseAt(new Date("2025-03-14T06:58:00Z"));
    expect(moon.phase).toBe("full");
    expect(moon.illumination).toBeGreaterThan(0.99);
  });

  it("indexes forwards for dates before the reference new moon", () => {
    const moon = moonPhaseAt(new Date("1969-07-20T20:17:00Z"));
    expect(MOON_PHASES).toContain(moon.phase);
    expect(moon.fraction).toBeGreaterThanOrEqual(0);
    expect(moon.fraction).toBeLessThan(1);
  });
});

describe("isMoonPhase", () => {
  it("accepts every phase name", () => {
    for (const phase of MOON_PHASES) {
      expect(isMoonPhase(phase)).toBe(true);
    }
  });

  it("rejects anything that is not one of the eight names", () => {
    expect(isMoonPhase("")).toBe(false);
    expect(isMoonPhase("blood")).toBe(false);
    expect(isMoonPhase("Full")).toBe(false);
    expect(isMoonPhase("waxing-crescent")).toBe(false);
  });
});

describe("moonPhaseCenterFraction", () => {
  it("round-trips: the centre of each phase reads back as that phase", () => {
    for (const phase of MOON_PHASES) {
      const at = atOffset(moonPhaseCenterFraction(phase));
      expect(moonPhaseAt(at).phase).toBe(phase);
    }
  });

  it("centres new at the cycle start and full at its middle", () => {
    expect(moonPhaseCenterFraction("new")).toBe(0);
    expect(moonPhaseCenterFraction("full")).toBe(0.5);
  });
});
