import { describe, expect, it } from "vitest";
import type { PayloadPageInternacional } from "@/infrastructure/payload/getPageInternacionalGlobal";
import { INTERNACIONAL_DEFAULTS } from "./Internacional";
import { internacionalFromPayload } from "./internacionalFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("internacionalFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(internacionalFromPayload({})).toEqual(INTERNACIONAL_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageInternacional = {
      abertura: { heading: "   ", trustLine: "" },
      inEnglish: { linkLabel: "  " },
      comecar: { body: "\n" },
    };

    const page = internacionalFromPayload(doc);

    expect(page.abertura.heading).toBe(INTERNACIONAL_DEFAULTS.abertura.heading);
    expect(page.abertura.trustLine).toBe(INTERNACIONAL_DEFAULTS.abertura.trustLine);
    expect(page.inEnglish.linkLabel).toBe(INTERNACIONAL_DEFAULTS.inEnglish.linkLabel);
    expect(page.comecar.body).toBe(INTERNACIONAL_DEFAULTS.comecar.body);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = internacionalFromPayload({
      abertura: { body: emptied },
      brasileirosFora: { body: emptied },
    });

    expect(page.abertura.body).toBe(INTERNACIONAL_DEFAULTS.abertura.body);
    expect(page.brasileirosFora.body).toBe(INTERNACIONAL_DEFAULTS.brasileirosFora.body);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPageInternacional = {
      abertura: { heading: "Atendo de onde você estiver" },
      pratico: { heading: "O prático" },
      comecar: { linkLabel: "como é a primeira conversa" },
    };

    const page = internacionalFromPayload(doc);

    expect(page.abertura.heading).toBe("Atendo de onde você estiver");
    expect(page.pratico.heading).toBe("O prático");
    expect(page.comecar.linkLabel).toBe("como é a primeira conversa");
    // Untouched siblings still fall back.
    expect(page.brasileirosFora.heading).toBe(INTERNACIONAL_DEFAULTS.brasileirosFora.heading);
  });

  // Payload materializes an untouched array as `[]`, and both arrays here belong
  // to sections CONCEPT §6 requires, so an empty one reads as un-edited.
  it("falls back on both empty arrays rather than dropping a required section", () => {
    const page = internacionalFromPayload({
      brasileirosFora: { cities: [] },
      pratico: { items: [] },
    });

    expect(page.brasileirosFora.cities).toEqual(INTERNACIONAL_DEFAULTS.brasileirosFora.cities);
    expect(page.pratico.items).toEqual(INTERNACIONAL_DEFAULTS.pratico.items);
  });

  it("keeps the cities in stored order and drops the half-typed rows", () => {
    const page = internacionalFromPayload({
      brasileirosFora: {
        cities: [
          { city: "Porto", note: "O mesmo fuso de Lisboa." },
          // A city she started naming and has not described yet.
          { city: "Dublin" },
          // A note with no city to attach it to.
          { note: "Duas horas à frente." },
          { city: "Tóquio", note: "Doze horas à frente — a manhã aí é a noite de ontem aqui." },
        ],
      },
    });

    expect(page.brasileirosFora.cities).toEqual([
      { city: "Porto", note: "O mesmo fuso de Lisboa." },
      { city: "Tóquio", note: "Doze horas à frente — a manhã aí é a noite de ontem aqui." },
    ]);
  });

  it("keeps the prático rows in stored order and drops the ones with nothing to read", () => {
    const page = internacionalFromPayload({
      pratico: {
        items: [
          { label: "Fusos", value: "A referência é o horário de Brasília." },
          { label: "Pagamento" },
          { value: "Português ou inglês." },
        ],
      },
    });

    expect(page.pratico.items).toEqual([
      { label: "Fusos", value: "A referência é o horário de Brasília." },
    ]);
  });

  it("resolves the plate when the painting and its label are both there", () => {
    const page = internacionalFromPayload({
      brasileirosFora: {
        plate: {
          image: upload("/media/porto.jpg", "um porto ao anoitecer"),
          painter: "Caspar David Friedrich",
          workTitle: "As idades da vida",
          year: "1834",
        },
      },
    });

    expect(page.brasileirosFora.plate).toEqual({
      image: {
        src: "/media/porto.jpg",
        alt: "um porto ao anoitecer",
        width: 1400,
        height: 1000,
        blurDataURL: null,
      },
      painter: "Caspar David Friedrich",
      workTitle: "As idades da vida",
      year: "1834",
    });
  });

  // Provenance is never invented (CONCEPT §11): an unchosen plate has no default,
  // so the slot resolves to nulls and the page renders a labeled frame.
  it("leaves an unchosen plate empty rather than inventing a provenance", () => {
    const page = internacionalFromPayload({ brasileirosFora: { heading: "Quem mora fora" } });

    expect(page.brasileirosFora.plate).toEqual({
      image: null,
      painter: null,
      workTitle: null,
      year: null,
    });
  });

  it("returns null for a plate whose upload has no renderable size", () => {
    const page = internacionalFromPayload({
      brasileirosFora: { plate: { image: { url: "/media/porto.jpg", alt: "um porto" } } },
    });

    expect(page.brasileirosFora.plate.image).toBeNull();
  });

  // The In-English fields are not localized, so the mapper is locale-blind here:
  // it normalizes the stored English prose and `inEnglishSectionFor` decides where
  // it renders.
  it("maps the In-English section as stored, in either locale", () => {
    const page = internacionalFromPayload({
      inEnglish: {
        heading: "Sessions in English",
        body: "Online, wherever you live.",
        linkLabel: "read in English",
      },
    });

    expect(page.inEnglish).toEqual({
      heading: "Sessions in English",
      body: "Online, wherever you live.",
      linkLabel: "read in English",
    });
  });
});
