import { describe, expect, it } from "vitest";
import {
  polar,
  sectorPathForSign,
  shortestRotationDelta,
  signRotationDeg,
  signSvgAngle,
  WHEEL_CENTER,
  WHEEL_SECTOR_PATHS,
  WHEEL_START_ANGLE_DEG,
  WHEEL_ZODIAC,
} from "./wheelGeometry";

const HALF_TURN = 180;
const FULL_TURN = 360;

describe("WHEEL_ZODIAC", () => {
  it("carries all twelve signs with unique ids", () => {
    expect(WHEEL_ZODIAC).toHaveLength(12);
    expect(new Set(WHEEL_ZODIAC.map((sign) => sign.id)).size).toBe(12);
  });

  it("progresses through the zodiac in ascending angle", () => {
    const angles = WHEEL_ZODIAC.map((sign) => sign.angle);
    expect([...angles].sort((a, b) => a - b)).toEqual(angles);
  });
});

describe("polar", () => {
  it("places the origin radius at the wheel centre", () => {
    expect(polar(0, 0)).toEqual({ x: WHEEL_CENTER, y: WHEEL_CENTER });
  });

  it("treats 0° as east and +90° as south, matching SVG coordinates", () => {
    const east = polar(100, 0);
    expect(east.x).toBeCloseTo(WHEEL_CENTER + 100);
    expect(east.y).toBeCloseTo(WHEEL_CENTER);

    const south = polar(100, 90);
    expect(south.x).toBeCloseTo(WHEEL_CENTER);
    expect(south.y).toBeCloseTo(WHEEL_CENTER + 100);
  });
});

describe("signSvgAngle", () => {
  it("measures the painted position counter-clockwise from the calibrated start", () => {
    const aries = WHEEL_ZODIAC[0];
    expect(signSvgAngle(aries)).toBe(WHEEL_START_ANGLE_DEG - aries.angle);
  });
});

describe("signRotationDeg", () => {
  it("rotates a sign's painted position to 12 o'clock", () => {
    for (const sign of WHEEL_ZODIAC) {
      const landed = signSvgAngle(sign) + signRotationDeg(sign);
      expect(landed).toBeCloseTo(-90);
    }
  });
});

describe("WHEEL_SECTOR_PATHS", () => {
  it("precomputes one closed arc path per sign", () => {
    expect(Object.keys(WHEEL_SECTOR_PATHS)).toHaveLength(12);
    for (const sign of WHEEL_ZODIAC) {
      const path = WHEEL_SECTOR_PATHS[sign.id];
      expect(path).toBe(sectorPathForSign(sign));
      expect(path.startsWith("M ")).toBe(true);
      expect(path.endsWith("Z")).toBe(true);
      expect(path).not.toContain("NaN");
    }
  });
});

describe("shortestRotationDelta", () => {
  it("takes the short way around instead of the long arc", () => {
    expect(shortestRotationDelta(350, 10)).toBe(20);
    expect(shortestRotationDelta(10, 350)).toBe(-20);
  });

  it("returns a delta that lands on a visually equivalent angle", () => {
    for (const from of [0, 47, 180, 271, 359]) {
      for (const to of [0, 47, 180, 271, 359]) {
        const landed = from + shortestRotationDelta(from, to);
        expect((((landed - to) % FULL_TURN) + FULL_TURN) % FULL_TURN).toBeCloseTo(0);
      }
    }
  });

  it("never rotates further than half a turn", () => {
    for (const from of [0, 90, 200, 333]) {
      for (const to of [0, 90, 200, 333]) {
        const delta = shortestRotationDelta(from, to);
        expect(delta).toBeGreaterThan(-HALF_TURN);
        expect(delta).toBeLessThanOrEqual(HALF_TURN);
      }
    }
  });

  it("resolves the exact half-turn to +180 so the spin direction is deterministic", () => {
    expect(shortestRotationDelta(0, 180)).toBe(HALF_TURN);
  });
});
