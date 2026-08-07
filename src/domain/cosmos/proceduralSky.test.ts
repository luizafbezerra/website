import { describe, expect, it } from "vitest";
import { Cosmos } from "./Cosmos";
import { buildDeepField, buildGalaxyBand, proceduralSky } from "./proceduralSky";
import { EMPTY_STAR_FIELD, starFieldFrom, type StarField } from "./StarField";

const radiusAt = (field: StarField, index: number) =>
  Math.hypot(
    field.positions[index * 3 + 0],
    field.positions[index * 3 + 1],
    field.positions[index * 3 + 2],
  );

describe("starFieldFrom", () => {
  it("interleaves stars into position and colour buffers", () => {
    const field = starFieldFrom([
      { position: [1, 2, 3], color: [0.1, 0.2, 0.3] },
      { position: [4, 5, 6], color: [0.4, 0.5, 0.6] },
    ]);

    expect(field.count).toBe(2);
    expect([...field.positions]).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...field.colors].map((value) => Number(value.toFixed(2)))).toEqual([
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6,
    ]);
  });

  it("has an empty field for a driver with nothing to show", () => {
    expect(EMPTY_STAR_FIELD.count).toBe(0);
    expect(EMPTY_STAR_FIELD.positions).toHaveLength(0);
  });
});

describe("buildDeepField", () => {
  it("is deterministic, so the server and the browser draw the same sky", () => {
    expect([...buildDeepField().positions]).toEqual([...buildDeepField().positions]);
    expect([...buildDeepField().colors]).toEqual([...buildDeepField().colors]);
  });

  it("halves the count on mobile, where the scene is fillrate-bound", () => {
    expect(buildDeepField().count).toBe(Cosmos.deepField.count);
    expect(buildDeepField({ mobile: true }).count).toBe(Cosmos.deepField.count / 2);
  });

  it("keeps every star inside the configured shell", () => {
    const field = buildDeepField();
    for (let index = 0; index < field.count; index++) {
      const radius = radiusAt(field, index);
      expect(radius).toBeGreaterThanOrEqual(Cosmos.deepField.radiusMin - 1e-6);
      expect(radius).toBeLessThanOrEqual(Cosmos.deepField.radiusMax + 1e-6);
    }
  });

  it("draws every colour from the warm palette, dimmed but never brightened", () => {
    const field = buildDeepField();
    const brightest = Math.max(
      ...Object.values(Cosmos.deepField.palette).flatMap((entry) => [...entry.rgb]),
    );
    for (const channel of field.colors) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(brightest);
    }
  });
});

describe("buildGalaxyBand", () => {
  it("is deterministic", () => {
    expect([...buildGalaxyBand().positions]).toEqual([...buildGalaxyBand().positions]);
  });

  it("fills the requested count", () => {
    expect(buildGalaxyBand().count).toBe(Cosmos.galaxyBand.count);
    expect(buildGalaxyBand({ mobile: true }).count).toBe(Cosmos.galaxyBand.count / 2);
  });

  it("holds every star inside the band's half-width", () => {
    const field = buildGalaxyBand();
    const [nx, ny, nz] = Cosmos.galaxyBand.planeNormal;
    const length = Math.hypot(nx, ny, nz);
    const halfWidth = Math.sin((Cosmos.galaxyBand.halfWidthDeg * Math.PI) / 180);

    for (let index = 0; index < field.count; index++) {
      const [x, y, z] = [
        field.positions[index * 3 + 0],
        field.positions[index * 3 + 1],
        field.positions[index * 3 + 2],
      ];
      const radius = Math.hypot(x, y, z);
      const latitude = Math.abs((x * nx + y * ny + z * nz) / length) / radius;
      expect(latitude).toBeLessThanOrEqual(halfWidth + 1e-6);
    }
  });
});

describe("proceduralSky", () => {
  it("supplies both fields, and the same ones the builders do", () => {
    const sky = proceduralSky({ mobile: true });
    expect([...sky.deepField.positions]).toEqual([...buildDeepField({ mobile: true }).positions]);
    expect([...sky.galaxyBand.positions]).toEqual([...buildGalaxyBand({ mobile: true }).positions]);
  });
});
