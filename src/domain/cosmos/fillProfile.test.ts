import { describe, expect, it } from "vitest";
import { CosmosFill } from "./fillProfile";

describe("CosmosFill", () => {
  it("leaves the shipped scene as the default", () => {
    expect(CosmosFill.DEFAULT_PROFILE).toBe("full");
    expect(CosmosFill.profile("full")).toEqual({ alphaTest: 0.02, countScale: 1 });
  });

  it("resolves an unknown, absent or malformed name to the shipped scene", () => {
    const full = CosmosFill.profile("full");
    for (const name of [null, undefined, "", "LEAN", "turbo", "0.5"]) {
      expect(CosmosFill.profile(name)).toEqual(full);
    }
  });

  it("cuts fill without touching composition in the lean profile", () => {
    const lean = CosmosFill.profile("lean");
    expect(lean.alphaTest).toBeGreaterThan(CosmosFill.profile("full").alphaTest);
    expect(lean.countScale).toBe(1);
    expect(CosmosFill.scaleCount(4000, "lean")).toBe(4000);
  });

  it("thins the star counts only in the sparse profile", () => {
    expect(CosmosFill.scaleCount(4000, "sparse")).toBe(2800);
    expect(CosmosFill.scaleCount(1200, "sparse")).toBe(840);
    expect(CosmosFill.scaleCount(4000, "full")).toBe(4000);
  });

  it("never returns a negative or fractional count", () => {
    expect(CosmosFill.scaleCount(1, "sparse")).toBe(0);
    expect(CosmosFill.scaleCount(-10, "sparse")).toBe(0);
    expect(Number.isInteger(CosmosFill.scaleCount(1201, "sparse"))).toBe(true);
  });

  it("recognises exactly the three profile names", () => {
    expect(["full", "lean", "sparse"].every(CosmosFill.isProfileName)).toBe(true);
    expect(CosmosFill.isProfileName("dense")).toBe(false);
  });
});
