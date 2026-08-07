import { describe, expect, it } from "vitest";
import { Cosmos } from "./Cosmos";

const SCROLL_SAMPLES = [0, 0.05, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1];

describe("Cosmos.clamp01", () => {
  it("clamps outside the unit range and passes values through inside it", () => {
    expect(Cosmos.clamp01(-0.5)).toBe(0);
    expect(Cosmos.clamp01(0.42)).toBe(0.42);
    expect(Cosmos.clamp01(1.5)).toBe(1);
  });
});

describe("Cosmos.smoothstep / smootherstep", () => {
  const easings = [
    { name: "smoothstep", ease: Cosmos.smoothstep },
    { name: "smootherstep", ease: Cosmos.smootherstep },
  ];

  for (const { name, ease } of easings) {
    it(`${name} pins both ends of its window and stays monotonic between them`, () => {
      expect(ease(0.2, 0.2, 0.8)).toBeCloseTo(0);
      expect(ease(0.8, 0.2, 0.8)).toBeCloseTo(1);
      expect(ease(0.5, 0.2, 0.8)).toBeCloseTo(0.5);

      let previous = -1;
      for (let x = 0; x <= 1.0001; x += 0.05) {
        const value = ease(x, 0.2, 0.8);
        expect(value).toBeGreaterThanOrEqual(previous);
        previous = value;
      }
    });

    it(`${name} degenerates to a step when the window has no width`, () => {
      expect(ease(0.3, 0.5, 0.5)).toBe(0);
      expect(ease(0.7, 0.5, 0.5)).toBe(1);
    });
  }
});

describe("Cosmos.lerp / v3lerp", () => {
  it("interpolates endpoints exactly", () => {
    expect(Cosmos.lerp(10, 20, 0)).toBe(10);
    expect(Cosmos.lerp(10, 20, 1)).toBe(20);
    expect(Cosmos.lerp(10, 20, 0.5)).toBe(15);
  });

  it("interpolates each axis of a vector independently", () => {
    const from = Cosmos.v3(0, 10, -4);
    const to = Cosmos.v3(2, 0, 4);
    expect(Cosmos.v3lerp(from, to, 0)).toEqual(from);
    expect(Cosmos.v3lerp(from, to, 1)).toEqual(to);
    expect(Cosmos.v3lerp(from, to, 0.5)).toEqual([1, 5, 0]);
  });
});

describe("Cosmos.deg2rad", () => {
  it("converts the cardinal angles", () => {
    expect(Cosmos.deg2rad(0)).toBe(0);
    expect(Cosmos.deg2rad(180)).toBeCloseTo(Math.PI);
    expect(Cosmos.deg2rad(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe("Cosmos.mulberry32", () => {
  it("is deterministic for a seed, so the star field is stable across renders", () => {
    const first = Array.from({ length: 5 }, Cosmos.mulberry32(1234));
    const second = Array.from({ length: 5 }, Cosmos.mulberry32(1234));
    expect(first).toEqual(second);
  });

  it("produces different streams for different seeds, all inside [0, 1)", () => {
    const a = Array.from({ length: 5 }, Cosmos.mulberry32(1));
    const b = Array.from({ length: 5 }, Cosmos.mulberry32(2));
    expect(a).not.toEqual(b);
    for (const value of [...a, ...b]) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("Cosmos.phases", () => {
  it("orders every window low-to-high inside the scroll range", () => {
    for (const [name, [start, end]] of Object.entries(Cosmos.phases)) {
      expect(start, name).toBeLessThan(end);
      expect(start, name).toBeGreaterThanOrEqual(0);
      expect(end, name).toBeLessThanOrEqual(1);
    }
  });

  it("covers the whole scroll with no gap between entry and idle", () => {
    expect(Cosmos.phases.entry[0]).toBe(0);
    expect(Cosmos.phases.idle[1]).toBe(1);
  });
});

describe("Cosmos.sigils", () => {
  it("carries the twelve signs, uniquely identified", () => {
    expect(Cosmos.sigils).toHaveLength(12);
    expect(new Set(Cosmos.sigils.map((sigil) => sigil.id)).size).toBe(12);
  });
});

describe("Cosmos.sigilPosition / sigilPosition3D", () => {
  it("spaces the sigils evenly around a circle of the given radius", () => {
    const radius = 0.78;
    for (const [index] of Cosmos.sigils.entries()) {
      const { x, y } = Cosmos.sigilPosition(index, radius);
      expect(Math.hypot(x, y)).toBeCloseTo(radius);
    }
  });

  it("places the 3D sigils on a sphere of the given radius", () => {
    const radius = 1.04;
    for (const [index] of Cosmos.sigils.entries()) {
      const [x, y, z] = Cosmos.sigilPosition3D(index, radius);
      expect(Math.hypot(x, y, z)).toBeCloseTo(radius);
    }
  });
});

describe("Cosmos.stars and constellations", () => {
  it("indexes only existing stars from every constellation path", () => {
    for (const path of Cosmos.constellations) {
      expect(path.length).toBeGreaterThanOrEqual(2);
      for (const index of path) {
        expect(Cosmos.stars[index]).toBeDefined();
      }
    }
  });
});

describe("Cosmos.cameraKeyAtProgress", () => {
  it("returns finite positions and look targets across the whole scroll", () => {
    for (const progress of SCROLL_SAMPLES) {
      const key = Cosmos.cameraKeyAtProgress(progress);
      for (const value of [...key.pos, ...key.look]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("holds the camera completely still through the opening dwell", () => {
    expect(Cosmos.cameraKeyAtProgress(0)).toEqual(Cosmos.cameraKeyAtProgress(0.001));
  });
});

describe("Cosmos opacity ramps", () => {
  const ramps = [
    { name: "sigilOverlayOpacity", ramp: Cosmos.sigilOverlayOpacity },
    { name: "armillaryOpacity", ramp: Cosmos.armillaryOpacity },
    { name: "preludeMasterOpacity", ramp: Cosmos.preludeMasterOpacity },
    { name: "descentBeatOpacity", ramp: Cosmos.descentBeatOpacity },
  ];

  for (const { name, ramp } of ramps) {
    it(`${name} stays within [0, 1] across the whole scroll`, () => {
      for (const progress of SCROLL_SAMPLES) {
        const value = ramp(progress);
        expect(value, `${name}(${progress})`).toBeGreaterThanOrEqual(0);
        expect(value, `${name}(${progress})`).toBeLessThanOrEqual(1);
      }
    });
  }
});

describe("Cosmos.cubicBezier3", () => {
  it("resolves to the trajectory endpoints", () => {
    const p0 = Cosmos.v3(0, 0, 0);
    const c1 = Cosmos.v3(1, 2, 0);
    const c2 = Cosmos.v3(3, 2, 0);
    const p1 = Cosmos.v3(4, 0, 0);
    expect(Cosmos.cubicBezier3(0, p0, c1, c2, p1)).toEqual(p0);
    expect(Cosmos.cubicBezier3(1, p0, c1, c2, p1)).toEqual(p1);
  });

  it("gives every comet a non-degenerate tangent to orient its trail", () => {
    for (const comet of Cosmos.cometTrajectories) {
      const tangent = Cosmos.cubicBezier3Tangent(0.5, comet.start, comet.c1, comet.c2, comet.end);
      expect(Math.hypot(...tangent)).toBeGreaterThan(0);
    }
  });
});
