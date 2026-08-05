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
        analysis: { title: "Análise junguiana" },
        boundary: "Qual profissão → orientação.",
      },
    };

    const inicio = inicioFromPayload(doc);

    expect(inicio.doisCaminhos.analysis.title).toBe("Análise junguiana");
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

  describe("instagram tiles", () => {
    it("keeps stored order and a half-curated row, and drops an empty one", () => {
      const doc: PayloadPageInicio = {
        instagram: {
          tiles: [
            { crop: upload("/media/um.jpg"), painter: "Waterhouse" },
            // Nothing a visitor could read — she added a row and left it.
            { painter: "   " },
            { passage: "Quem olha para dentro, desperta." },
          ],
        },
      };

      const { tiles } = inicioFromPayload(doc).instagram;

      expect(tiles).toHaveLength(2);
      expect(tiles[0]?.painter).toBe("Waterhouse");
      expect(tiles[0]?.full).toBeNull();
      expect(tiles[1]?.passage).toBe("Quem olha para dentro, desperta.");
    });

    it("returns an emptied array as empty rather than restoring the defaults", () => {
      expect(inicioFromPayload({ instagram: { tiles: [] } }).instagram.tiles).toEqual([]);
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

  describe("a lâmina", () => {
    it("carries the travelling captions in order and drops the blank ones", () => {
      const doc: PayloadPageInicio = {
        cosmos: {
          lamina: {
            plate: upload("/media/lamina.jpg", "uma tela"),
            captions: [{ text: "o rosto" }, { text: "  " }, { text: "a mão" }],
            closingLine: "Foi aqui que eu parei.",
          },
        },
      };

      const { lamina } = inicioFromPayload(doc).cosmos;

      expect(lamina.captions).toEqual(["o rosto", "a mão"]);
      expect(lamina.plate?.src).toBe("/media/lamina.jpg");
      expect(lamina.closingLine).toBe("Foi aqui que eu parei.");
    });

    it("is entirely empty until she curates it", () => {
      expect(inicioFromPayload({}).cosmos.lamina).toEqual({
        plate: null,
        painter: null,
        workTitle: null,
        year: null,
        captions: [],
        closingLine: null,
      });
    });
  });
});
