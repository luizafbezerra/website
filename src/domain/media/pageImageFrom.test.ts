import { describe, expect, it } from "vitest";
import { pageImageFrom } from "./pageImageFrom";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (extra: Record<string, unknown> = {}) => ({
  url: "/media/retrato.jpg",
  alt: "Luiza",
  width: 1200,
  height: 900,
  ...extra,
});

describe("pageImageFrom", () => {
  it("resolves a populated upload", () => {
    expect(pageImageFrom(upload())).toEqual({
      src: "/media/retrato.jpg",
      alt: "Luiza",
      width: 1200,
      height: 900,
      blurDataURL: null,
    });
  });

  describe("the blur placeholder", () => {
    it("carries the stored data URI through", () => {
      const blurDataURL = "data:image/webp;base64,UklGRg==";
      expect(pageImageFrom(upload({ blurDataURL }))?.blurDataURL).toBe(blurDataURL);
    });

    // Every reason a row can lack one — uploaded before the field existed, or
    // sharp failed on it — has to land on the same value, because the view tells
    // "no placeholder" apart from "a placeholder" and nothing else.
    it.each([
      ["absent", {}],
      ["null", { blurDataURL: null }],
      ["an empty string", { blurDataURL: "" }],
      ["only whitespace", { blurDataURL: "   " }],
    ])("resolves to null when it is %s", (_case, extra) => {
      expect(pageImageFrom(upload(extra))?.blurDataURL).toBeNull();
    });

    // A missing placeholder is the one incompleteness this mapper tolerates: the
    // image still renders, just without the settle. Contrast the four required
    // fields, whose absence sends the slot to the labeled frame instead.
    it("never costs an otherwise-complete image its slot", () => {
      expect(pageImageFrom(upload({ blurDataURL: null }))).not.toBeNull();
    });
  });

  describe("still refuses a half-resolved image", () => {
    it.each([
      ["no url", { url: null }],
      ["a blank url", { url: "  " }],
      ["no width", { width: null }],
      ["no height", { height: null }],
      ["a zero dimension", { width: 0 }],
    ])("returns null given %s, placeholder or not", (_case, extra) => {
      expect(
        pageImageFrom(upload({ ...extra, blurDataURL: "data:image/webp;base64,UklGRg==" })),
      ).toBeNull();
    });

    it("returns null for an unpopulated relation or an empty slot", () => {
      expect(pageImageFrom(7)).toBeNull();
      expect(pageImageFrom(null)).toBeNull();
      expect(pageImageFrom(undefined)).toBeNull();
    });
  });
});
