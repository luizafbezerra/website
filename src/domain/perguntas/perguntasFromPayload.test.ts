import { describe, expect, it } from "vitest";
import type { PayloadPagePerguntas } from "@/infrastructure/payload/getPagePerguntasGlobal";
import { PERGUNTAS_DEFAULTS } from "./Perguntas";
import { perguntasFromPayload } from "./perguntasFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("perguntasFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(perguntasFromPayload({})).toEqual(PERGUNTAS_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPagePerguntas = {
      abertura: { heading: "   ", intro: "" },
      fecho: { heading: "", body: "  ", whatsappLabel: " ", linkLabel: "" },
    };

    const page = perguntasFromPayload(doc);

    expect(page.abertura).toEqual(PERGUNTAS_DEFAULTS.abertura);
    expect(page.fecho).toEqual(PERGUNTAS_DEFAULTS.fecho);
  });

  it("keeps her wording field by field when she has written it", () => {
    const page = perguntasFromPayload({
      abertura: { heading: "O que costumam me perguntar" },
      fecho: { whatsappLabel: "me escreva" },
    });

    expect(page.abertura.heading).toBe("O que costumam me perguntar");
    expect(page.fecho.whatsappLabel).toBe("me escreva");
    // Untouched siblings still fall back.
    expect(page.abertura.intro).toBe(PERGUNTAS_DEFAULTS.abertura.intro);
    expect(page.fecho.linkLabel).toBe(PERGUNTAS_DEFAULTS.fecho.linkLabel);
  });

  // The heading is what an `h2` prints, so it must never arrive blank: a section
  // she renamed keeps her name, a section she never opened keeps CONCEPT §6's.
  it("falls back a section heading to CONCEPT's own section name", () => {
    const page = perguntasFromPayload({
      sections: {
        analise: { heading: "Sobre o trabalho analítico" },
        pratico: { heading: "  " },
      },
    });

    expect(page.sections.analise.heading).toBe("Sobre o trabalho analítico");
    expect(page.sections.pratico.heading).toBe(PERGUNTAS_DEFAULTS.sections.pratico.heading);
    expect(page.sections.orientacao.heading).toBe(PERGUNTAS_DEFAULTS.sections.orientacao.heading);
    expect(page.sections.internacional.heading).toBe(
      PERGUNTAS_DEFAULTS.sections.internacional.heading,
    );
  });

  // The one field on the page with no default: an intro she has not written means
  // the section starts on its first question, not on an invented framing line.
  it("leaves a section intro absent rather than drafting one", () => {
    const page = perguntasFromPayload({
      sections: { orientacao: { heading: "Sobre a orientação", intro: "Um percurso com fim." } },
    });

    expect(page.sections.orientacao.intro).toBe("Um percurso com fim.");
    expect(page.sections.analise.intro).toBeNull();
    expect(page.sections.pratico.intro).toBeNull();
  });

  // The intro has no default to fall back to, so trimming is the only thing that
  // stops a cleared field from rendering: the view prints the paragraph whenever
  // the value is truthy, and a whitespace-only string would open a blank gap above
  // the section's first question.
  it("reads an intro she emptied as absent, not as a blank paragraph", () => {
    const page = perguntasFromPayload({
      sections: { pratico: { intro: "   " }, internacional: { intro: "\n" } },
    });

    expect(page.sections.pratico.intro).toBeNull();
    expect(page.sections.internacional.intro).toBeNull();
  });

  it("resolves the plate to its label and image, and to null while the scan is missing", () => {
    const withImage = perguntasFromPayload({
      plate: {
        image: upload("/media/leitura.jpg", "uma mulher lendo à luz de uma janela"),
        painter: "Jean-Baptiste-Siméon Chardin",
        workTitle: "A leitora",
        year: "1734",
      },
    });

    expect(withImage.plate).toEqual({
      image: {
        src: "/media/leitura.jpg",
        alt: "uma mulher lendo à luz de uma janela",
        width: 1400,
        height: 1000,
        blurDataURL: null,
      },
      painter: "Jean-Baptiste-Siméon Chardin",
      workTitle: "A leitora",
      year: "1734",
    });

    // The label can be recorded before the scan is sourced — the frame stands in
    // for the image alone (REQ-005), and provenance is never invented.
    const labelOnly = perguntasFromPayload({
      plate: { painter: "Jean-Baptiste-Siméon Chardin", year: "1734" },
    });

    expect(labelOnly.plate.image).toBeNull();
    expect(labelOnly.plate.painter).toBe("Jean-Baptiste-Siméon Chardin");
    expect(labelOnly.plate.workTitle).toBeNull();
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = perguntasFromPayload({
      plate: { image: { url: "/media/sem-medidas.jpg", alt: "x" } },
    });

    expect(page.plate.image).toBeNull();
  });
});
