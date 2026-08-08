import { describe, expect, it } from "vitest";
import type { PayloadPageInicio } from "@/infrastructure/payload/getPageInicioGlobal";
import { INICIO_DEFAULTS } from "./Inicio";
import { inicioFromPayload } from "./inicioFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1200, height: 900 });

describe("inicioFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(inicioFromPayload({})).toEqual(INICIO_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageInicio = {
      instagram: { heading: "   ", intro: "" },
      brasilExterior: { body: "" },
    };

    const inicio = inicioFromPayload(doc);

    expect(inicio.instagram.heading).toBe(INICIO_DEFAULTS.instagram.heading);
    expect(inicio.instagram.intro).toBe(INICIO_DEFAULTS.instagram.intro);
    expect(inicio.brasilExterior.body).toBe(INICIO_DEFAULTS.brasilExterior.body);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const inicio = inicioFromPayload({ oSintoma: { body: emptied } });

    expect(inicio.oSintoma.body).toBe(INICIO_DEFAULTS.oSintoma.body);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPageInicio = {
      doisCaminhos: {
        analysis: { title: "Análise (psicologia analítica)" },
        boundary: "Qual profissão → orientação.",
      },
    };

    const inicio = inicioFromPayload(doc);

    expect(inicio.doisCaminhos.analysis.title).toBe("Análise (psicologia analítica)");
    // The two fields she did not touch still carry their drafts.
    expect(inicio.doisCaminhos.analysis.body).toBe(INICIO_DEFAULTS.doisCaminhos.analysis.body);
    expect(inicio.doisCaminhos.boundary).toBe("Qual profissão → orientação.");
  });

  describe("media", () => {
    it("resolves a populated upload and drops an empty slot", () => {
      const inicio = inicioFromPayload({
        hero: { portrait: upload("/media/retrato.jpg", "Luiza") },
      });

      expect(inicio.hero.portrait).toEqual({
        src: "/media/retrato.jpg",
        alt: "Luiza",
        width: 1200,
        height: 900,
      });
      expect(inicioFromPayload({ hero: {} }).hero.portrait).toBeNull();
    });

    it("drops an upload with no intrinsic size rather than shipping layout shift", () => {
      const doc: PayloadPageInicio = {
        hero: { portrait: { url: "/media/retrato.jpg", alt: "Luiza" } },
      };

      expect(inicioFromPayload(doc).hero.portrait).toBeNull();
    });

    it("drops an unpopulated relation that arrived as a bare row id", () => {
      expect(inicioFromPayload({ hero: { portrait: 42 } }).hero.portrait).toBeNull();
    });
  });

  // The Instagram section carries only her heading and intro: the posts are the
  // live feed (`src/domain/instagram/`), which this global knows nothing about.
  it("carries her wording for the Instagram section and nothing else", () => {
    const { instagram } = inicioFromPayload({ instagram: { heading: "O que eu publico agora" } });

    expect(instagram).toEqual({
      heading: "O que eu publico agora",
      intro: INICIO_DEFAULTS.instagram.intro,
    });
  });

  describe("como é começar", () => {
    it("numbers a beat she left unnumbered", () => {
      const doc: PayloadPageInicio = {
        comoComecar: {
          beats: [{ text: "Você me escreve." }, { numeral: "B", text: "Combinamos." }],
        },
      };

      const { beats } = inicioFromPayload(doc).comoComecar;

      expect(beats).toEqual([
        { numeral: "I", text: "Você me escreve." },
        { numeral: "B", text: "Combinamos." },
      ]);
    });

    it("drops a beat with no text", () => {
      const doc: PayloadPageInicio = { comoComecar: { beats: [{ numeral: "I" }] } };

      expect(inicioFromPayload(doc).comoComecar.beats).toEqual([]);
    });

    // Payload materializes an untouched array field as `[]`, so this is what an
    // un-edited global actually looks like — and the section must survive it.
    it("restores the defaults for an array Payload materialized empty", () => {
      const doc: PayloadPageInicio = { comoComecar: { beats: [] } };

      expect(inicioFromPayload(doc).comoComecar.beats).toEqual(INICIO_DEFAULTS.comoComecar.beats);
    });
  });

  describe("o cosmos", () => {
    it("carries her marginalia through", () => {
      const doc: PayloadPageInicio = { cosmos: { caption: "o que insiste, lá em cima" } };

      expect(inicioFromPayload(doc).cosmos.caption).toBe("o que insiste, lá em cima");
    });

    it("leaves the caption null so the chart can date itself", () => {
      // The wow slot's substitute — O céu desta noite — is computed rather than
      // curated, so an untouched Cosmos section is complete, not unfinished.
      expect(inicioFromPayload({}).cosmos).toEqual({ caption: null });
    });
  });
});
