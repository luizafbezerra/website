import { describe, expect, it } from "vitest";
import { WHEEL_ZODIAC } from "@/domain/wheel/wheelGeometry";
import { VEDIC_CONTENT, ZODIAC_CONTENT, ZODIAC_SIGN_IDS, type ZodiacSignId } from "./zodiacContent";

// ---------------------------------------------------------------------------
// `ZODIAC_SIGN_IDS` is a literal tuple so the readings record is exhaustively
// typed, which means it duplicates the ids the geometry module already declares.
// These tests are the seam that keeps the duplication honest: the two lists must
// agree in membership *and* in order, because the wheel renders sectors from
// `WHEEL_ZODIAC` and looks reference data up by the same id.
// ---------------------------------------------------------------------------

describe("ZODIAC_SIGN_IDS", () => {
  it("matches the geometry module's twelve signs, in the same order", () => {
    expect(ZODIAC_SIGN_IDS).toEqual(WHEEL_ZODIAC.map((sign) => sign.id));
  });

  it("has no duplicates", () => {
    expect(new Set(ZODIAC_SIGN_IDS).size).toBe(ZODIAC_SIGN_IDS.length);
  });
});

describe("the wheel's reference data", () => {
  it("carries every sign's five correspondences, with nothing blank", () => {
    for (const id of ZODIAC_SIGN_IDS) {
      const content = ZODIAC_CONTENT[id];
      expect(content, id).toBeDefined();
      for (const value of [
        content.element,
        content.modality,
        content.ruler,
        content.bodyPart,
        content.archetype,
      ]) {
        expect(value.trim(), id).not.toBe("");
      }
    }
  });

  it("spans three lunar mansions per sign, each fully named", () => {
    for (const id of ZODIAC_SIGN_IDS) {
      const nakshatras = VEDIC_CONTENT[id].nakshatras;
      expect(nakshatras, id).toHaveLength(3);
      for (const nakshatra of nakshatras) {
        for (const value of [nakshatra.name, nakshatra.deity, nakshatra.ruler, nakshatra.symbol]) {
          expect(value.trim(), `${id} · ${nakshatra.name}`).not.toBe("");
        }
      }
    }
  });

  it("uses all twenty-seven mansions across the twelve signs", () => {
    const names = new Set(
      ZODIAC_SIGN_IDS.flatMap((id) => VEDIC_CONTENT[id].nakshatras.map((n) => n.name)),
    );
    expect(names.size).toBe(27);
  });

  // REQ-007 / CONCEPT §11: the wheel's prose is hers alone. Nothing in this
  // module may carry a paragraph, a motif, or any other authored line — the
  // readings arrive from the `page-analise` global. This test fails the moment
  // someone reintroduces dev-written prose here.
  it("carries no authored prose at all", () => {
    const proseKeys = ["paragraph", "motif", "reading", "text", "_isPlaceholder"];
    for (const id of ZODIAC_SIGN_IDS) {
      const records: object[] = [
        ZODIAC_CONTENT[id],
        VEDIC_CONTENT[id],
        ...VEDIC_CONTENT[id].nakshatras,
      ];
      for (const record of records) {
        for (const key of proseKeys) {
          expect(Object.hasOwn(record, key), `${id}.${key}`).toBe(false);
        }
      }
    }
  });
});

describe("ZodiacSignId", () => {
  it("types a record that must name every sign", () => {
    // A compile-time assertion with a runtime witness: dropping a sign from
    // `ZODIAC_SIGN_IDS` breaks this literal, and adding one to the tuple without
    // adding it here breaks the type.
    const complete: Record<ZodiacSignId, true> = {
      aries: true,
      taurus: true,
      gemini: true,
      cancer: true,
      leo: true,
      virgo: true,
      libra: true,
      scorpio: true,
      sagittarius: true,
      capricorn: true,
      aquarius: true,
      pisces: true,
    };

    expect(Object.keys(complete)).toHaveLength(12);
  });
});
