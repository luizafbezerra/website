import { describe, expect, it } from "vitest";
import { offsetMinutes, REACH, REACH_ANCHOR } from "./reach";

// ---------------------------------------------------------------------------
// The time-difference arithmetic, pinned to fixed instants.
//
// This is the one computation on the site a visitor uses to plan something real,
// and it replaced three hand-written notes that had to hedge into ranges because
// Brazil stopped observing daylight saving time in 2019 and Europe and North
// America did not. The point of computing it is that it is exact at any instant —
// which is only worth anything if the arithmetic is right on both sides of every
// changeover, so both are tested.
//
// Every instant here is written in UTC. `Date.now()` never appears: a test that
// read the wall clock would pass or fail depending on the month it ran in.
// ---------------------------------------------------------------------------

/** Northern winter: Europe on standard time, North America on standard time. */
const JANUARY = new Date("2026-01-15T12:00:00Z");
/** Northern summer: Europe and North America both on daylight saving time. */
const JULY = new Date("2026-07-15T12:00:00Z");
/**
 * The three weeks each spring when Europe has already sprung forward and North
 * America has too, but the gap against Brazil is at its widest — the exact case a
 * hand-written note gets wrong.
 */
const LATE_MARCH = new Date("2026-03-30T12:00:00Z");

const zoneOf = (key: string) => REACH.find((place) => place.key === key)?.timeZone as string;

describe("offsetMinutes", () => {
  it("reads zero against the anchor itself, in any season", () => {
    for (const instant of [JANUARY, JULY, LATE_MARCH]) {
      expect(offsetMinutes(instant, REACH_ANCHOR)).toBe(0);
    }
  });

  it("puts Lisbon and London three hours ahead of Brasília in winter", () => {
    expect(offsetMinutes(JANUARY, zoneOf("portugal"))).toBe(180);
    expect(offsetMinutes(JANUARY, zoneOf("inglaterra"))).toBe(180);
  });

  it("puts them four hours ahead once European summer time starts", () => {
    expect(offsetMinutes(JULY, zoneOf("portugal"))).toBe(240);
    expect(offsetMinutes(JULY, zoneOf("inglaterra"))).toBe(240);
    expect(offsetMinutes(LATE_MARCH, zoneOf("portugal"))).toBe(240);
  });

  it("keeps Amsterdam exactly one hour east of London all year", () => {
    for (const instant of [JANUARY, JULY, LATE_MARCH]) {
      const london = offsetMinutes(instant, zoneOf("inglaterra"));
      expect(offsetMinutes(instant, zoneOf("holanda"))).toBe(london + 60);
    }
  });

  it("puts New York two hours behind Brasília in winter and one in summer", () => {
    expect(offsetMinutes(JANUARY, zoneOf("eua"))).toBe(-120);
    expect(offsetMinutes(JULY, zoneOf("eua"))).toBe(-60);
  });

  it("keeps Toronto on New York's clock, which is why it can stand for Canada", () => {
    for (const instant of [JANUARY, JULY, LATE_MARCH]) {
      expect(offsetMinutes(instant, zoneOf("canada"))).toBe(offsetMinutes(instant, zoneOf("eua")));
    }
  });

  it("measures against any zone asked for, not only the anchor", () => {
    expect(offsetMinutes(JULY, zoneOf("holanda"), zoneOf("inglaterra"))).toBe(60);
    expect(offsetMinutes(JULY, zoneOf("eua"), zoneOf("holanda"))).toBe(-360);
  });

  it("does not drift across the day boundary", () => {
    // 02:00 UTC is the previous day in São Paulo and already morning in Amsterdam:
    // a naive implementation that compares hours rather than instants breaks here.
    const acrossMidnight = new Date("2026-07-15T02:00:00Z");
    expect(offsetMinutes(acrossMidnight, zoneOf("holanda"))).toBe(300);
    expect(offsetMinutes(acrossMidnight, zoneOf("eua"))).toBe(-60);
  });
});

describe("REACH", () => {
  it("names her five countries plus the anchor, west to east", () => {
    expect(REACH.map((place) => place.key)).toEqual([
      "eua",
      "canada",
      "brasil",
      "portugal",
      "inglaterra",
      "holanda",
    ]);
  });

  it("reads west to east at a single instant, so the strip is one sweep", () => {
    const offsets = REACH.map((place) => offsetMinutes(JULY, place.timeZone));
    expect([...offsets].sort((a, b) => a - b)).toEqual(offsets);
  });

  it("anchors on Brasília, and nowhere else", () => {
    expect(REACH.filter((place) => place.timeZone === REACH_ANCHOR)).toHaveLength(1);
  });

  it("names a real IANA zone for every place", () => {
    for (const place of REACH) {
      expect(() => new Intl.DateTimeFormat("en-US", { timeZone: place.timeZone })).not.toThrow();
    }
  });
});
