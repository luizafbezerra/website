import { describe, expect, it } from "vitest";
import { WHEEL_ZODIAC } from "@/domain/wheel/wheelGeometry";
import { VEDIC_CONTENT, ZODIAC_CONTENT, ZODIAC_SIGN_IDS } from "./zodiacContent";
import { EN_TABLES, vedicContentIn, wheelSignIn, zodiacContentIn } from "./zodiacEnglish";

// The English wheel is a lookup over the Portuguese record rather than a mirror
// of it, which buys one risk: a value added to the source with no entry here
// falls through and ships a table half in Portuguese — exactly the defect this
// file exists to fix, reappearing silently. Every test below is that guard.

describe("zodiacEnglish", () => {
  it("translates every value the Portuguese record actually uses", () => {
    const missing: string[] = [];
    const need = (table: Record<string, string>, value: string, what: string) => {
      if (!(value in table)) missing.push(`${what}: ${value}`);
    };

    for (const id of ZODIAC_SIGN_IDS) {
      const c = ZODIAC_CONTENT[id];
      need(EN_TABLES.ELEMENT_EN, c.element, `${id} element`);
      need(EN_TABLES.MODALITY_EN, c.modality, `${id} modality`);
      need(EN_TABLES.PLANET_EN, c.ruler, `${id} ruler`);
      need(EN_TABLES.BODY_PART_EN, c.bodyPart, `${id} bodyPart`);
      need(EN_TABLES.ARCHETYPE_EN, c.archetype, `${id} archetype`);

      for (const n of VEDIC_CONTENT[id].nakshatras) {
        need(EN_TABLES.PLANET_EN, n.ruler, `${id} nakshatra ruler`);
        need(EN_TABLES.SYMBOL_EN, n.symbol, `${id} nakshatra symbol`);
        if (n.range) need(EN_TABLES.PADA_RANGE_EN, n.range, `${id} nakshatra range`);
      }
    }

    for (const sign of WHEEL_ZODIAC) {
      for (const month of sign.dateRange.match(/\p{Letter}+/gu) ?? []) {
        need(EN_TABLES.MONTH_EN, month, `${sign.id} month`);
      }
    }

    expect(missing).toEqual([]);
  });

  // The point of the whole exercise: an English reader meets no Portuguese.
  it("leaves no Portuguese in the rendered English nomenclature", () => {
    // "pada"/"padas" and the nakshatra and deity names are Sanskrit and are kept
    // in both locales, so they are not listed here — only Portuguese words are.
    const portuguese =
      /água|fogo|mutável|fixo\b|Marte|Vênus|Mercúrio|Lua\b|Sol\b|Plutão|Júpiter|Saturno|Urano|Netuno|cabeça|pescoço|peito|coração|rins|quadris|tornozelos|pés|espada|serpente|peixe\b|lâmina|joia|leito|trono|rede\b|orelha|tambor|círculo|primeiro|último/;

    for (const sign of WHEEL_ZODIAC) {
      const { label, dateRange } = wheelSignIn("en", sign);
      expect(`${label} ${dateRange}`).not.toMatch(portuguese);

      const id = sign.id as (typeof ZODIAC_SIGN_IDS)[number];
      const c = zodiacContentIn("en", id);
      expect(Object.values(c).join(" ")).not.toMatch(portuguese);

      for (const n of vedicContentIn("en", id).nakshatras) {
        // `name` and `deity` are Sanskrit and stay as they are in both locales.
        expect(`${n.ruler} ${n.symbol} ${n.range ?? ""}`).not.toMatch(portuguese);
      }
    }
  });

  it("returns the source record untouched for pt", () => {
    for (const id of ZODIAC_SIGN_IDS) {
      expect(zodiacContentIn("pt", id)).toEqual(ZODIAC_CONTENT[id]);
      expect(vedicContentIn("pt", id)).toEqual(VEDIC_CONTENT[id]);
    }
    for (const sign of WHEEL_ZODIAC) {
      expect(wheelSignIn("pt", sign)).toEqual({
        label: sign.label,
        dateRange: sign.dateRange,
      });
    }
  });

  it("converts the date ranges and keeps their numerals", () => {
    const pisces = WHEEL_ZODIAC.find((sign) => sign.id === "pisces");
    expect(wheelSignIn("en", pisces!)).toEqual({
      label: "Pisces",
      dateRange: "19 Feb – 20 Mar",
    });
  });
});
