import { describe, expect, it } from "vitest";
import {
  isSectionType,
  SECTION_REGISTRY,
  SECTION_TYPES,
  SECTIONS_DEFAULT,
} from "./sectionRegistry";

describe("SECTION_REGISTRY", () => {
  it("describes exactly the known section types", () => {
    expect(Object.keys(SECTION_REGISTRY).sort()).toEqual([...SECTION_TYPES].sort());
  });

  it("gives every navigable section both an anchor and a label", () => {
    for (const [type, meta] of Object.entries(SECTION_REGISTRY)) {
      const hasEither = Boolean(meta.anchorId || meta.navLabel);
      const hasBoth = Boolean(meta.anchorId && meta.navLabel);
      expect(hasEither && !hasBoth, `${type} is half-navigable`).toBe(false);
    }
  });

  it("uses a unique anchor id per navigable section", () => {
    const anchors = Object.values(SECTION_REGISTRY)
      .map((meta) => meta.anchorId)
      .filter(Boolean);
    expect(new Set(anchors).size).toBe(anchors.length);
  });
});

describe("SECTIONS_DEFAULT", () => {
  it("enables every section, in registry order", () => {
    expect(SECTIONS_DEFAULT).toEqual(SECTION_TYPES.map((type) => ({ type, enabled: true })));
  });
});

describe("isSectionType", () => {
  it("accepts every known type", () => {
    for (const type of SECTION_TYPES) expect(isSectionType(type)).toBe(true);
  });

  it("rejects retired, unknown, and non-string values", () => {
    // `writing` was the blog-fed section removed in Phase 1; stored rows naming
    // it must not resurrect as a section.
    expect(isSectionType("writing")).toBe(false);
    expect(isSectionType("")).toBe(false);
    expect(isSectionType(null)).toBe(false);
    expect(isSectionType(undefined)).toBe(false);
    expect(isSectionType(0)).toBe(false);
  });
});
