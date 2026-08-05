import { describe, expect, it } from "vitest";
import type { JungPassage } from "./Clinica";
import { JUNG_ROTATION_HOURS, jungRotationAt, pickJungPassage } from "./pickJungPassage";

const pool: JungPassage[] = [
  { text: "primeira", attribution: null },
  { text: "segunda", attribution: "C. G. Jung" },
  { text: "terceira", attribution: null },
];

const HOUR_MS = 60 * 60 * 1000;

describe("pickJungPassage", () => {
  it("returns null while the pool is empty", () => {
    expect(pickJungPassage([], new Date("2026-08-05T10:00:00Z"))).toBeNull();
  });

  it("shows the same passage to everyone inside one rotation window", () => {
    const early = new Date("2026-08-05T00:05:00Z");
    const late = new Date("2026-08-05T11:55:00Z");
    expect(pickJungPassage(pool, early)).toBe(pickJungPassage(pool, late));
  });

  it("moves on at the next rotation boundary", () => {
    const before = new Date("2026-08-05T11:59:00Z");
    const after = new Date("2026-08-05T12:01:00Z");
    expect(pickJungPassage(pool, before)).not.toBe(pickJungPassage(pool, after));
  });

  it("walks the whole pool in order and wraps around", () => {
    const start = jungRotationAt(new Date("2026-08-05T00:00:00Z"));
    const seen = Array.from({ length: pool.length + 1 }, (_, step) =>
      pickJungPassage(pool, new Date((start + step) * JUNG_ROTATION_HOURS * HOUR_MS)),
    );

    expect(new Set(seen.slice(0, pool.length)).size).toBe(pool.length);
    expect(seen[pool.length]).toBe(seen[0]);
  });

  it("indexes forwards even before the epoch", () => {
    const passage = pickJungPassage(pool, new Date("1969-07-20T20:17:00Z"));
    expect(pool).toContain(passage);
  });

  it("holds a single-passage pool steady", () => {
    const one = pool.slice(0, 1);
    expect(pickJungPassage(one, new Date("2026-08-05T00:00:00Z"))).toBe(one[0]);
    expect(pickJungPassage(one, new Date("2027-01-01T00:00:00Z"))).toBe(one[0]);
  });
});
