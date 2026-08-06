import { describe, expect, it } from "vitest";
import type { PayloadPageOrientacaoProfissional } from "@/infrastructure/payload/getPageOrientacaoProfissionalGlobal";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "./OrientacaoProfissional";
import { orientacaoProfissionalFromPayload } from "./orientacaoProfissionalFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("orientacaoProfissionalFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(orientacaoProfissionalFromPayload({})).toEqual(ORIENTACAO_PROFISSIONAL_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageOrientacaoProfissional = {
      abertura: { heading: "   " },
      oPercurso: { deliverable: "" },
      nemCoaching: { anchor: "  ", bridge: { linkLabel: "" } },
      pratico: { comecar: { body: " " } },
    };

    const page = orientacaoProfissionalFromPayload(doc);

    expect(page.abertura.heading).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.heading);
    expect(page.oPercurso.deliverable).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.deliverable);
    expect(page.nemCoaching.anchor).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.anchor);
    expect(page.nemCoaching.bridge.linkLabel).toBe(
      ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.bridge.linkLabel,
    );
    expect(page.pratico.comecar.body).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.pratico.comecar.body);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = orientacaoProfissionalFromPayload({
      abertura: { body: emptied },
      oPercurso: { body: emptied },
      nemCoaching: { body: emptied },
    });

    expect(page.abertura.body).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.body);
    expect(page.oPercurso.body).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.body);
    expect(page.nemCoaching.body).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.body);

    // And on a root with no `children` at all, rather than reading `.length` off it.
    const rootless = orientacaoProfissionalFromPayload({
      abertura: { body: { root: {} } as never },
    });
    expect(rootless.abertura.body).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.body);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPageOrientacaoProfissional = {
      abertura: { heading: "Orientação de carreira" },
      pratico: { heading: "O combinado", comecar: { linkLabel: "como começa" } },
      nemCoaching: { bridge: { body: "A pergunta era outra." } },
    };

    const page = orientacaoProfissionalFromPayload(doc);

    expect(page.abertura.heading).toBe("Orientação de carreira");
    expect(page.pratico.heading).toBe("O combinado");
    expect(page.pratico.comecar.linkLabel).toBe("como começa");
    expect(page.nemCoaching.bridge.body).toBe("A pergunta era outra.");
    // Untouched siblings still fall back.
    expect(page.nemCoaching.heading).toBe(ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.heading);
    expect(page.nemCoaching.bridge.linkLabel).toBe(
      ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.bridge.linkLabel,
    );
  });

  // Payload materializes an untouched array as `[]`, so every array on this page
  // reads an empty one as un-edited: all belong to sections CONCEPT §6 requires,
  // and none has a designed empty state.
  it("falls back on every empty array rather than dropping a required section", () => {
    const page = orientacaoProfissionalFromPayload({
      paraQuem: { cases: [] },
      oPercurso: { steps: [] },
      nemCoaching: { distinctions: [] },
      pratico: { items: [] },
    });

    expect(page.paraQuem.cases).toEqual(ORIENTACAO_PROFISSIONAL_DEFAULTS.paraQuem.cases);
    expect(page.oPercurso.steps).toEqual(ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.steps);
    expect(page.nemCoaching.distinctions).toEqual(
      ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.distinctions,
    );
    expect(page.pratico.items).toEqual(ORIENTACAO_PROFISSIONAL_DEFAULTS.pratico.items);
  });

  it("reads the situations as plain lines, dropping the blank ones", () => {
    const page = orientacaoProfissionalFromPayload({
      paraQuem: {
        cases: [{ text: "Escolher o primeiro curso." }, { text: "   " }, { text: "Recomeçar." }],
      },
    });

    expect(page.paraQuem.cases).toEqual(["Escolher o primeiro curso.", "Recomeçar."]);

    // Nothing readable in any row: the section falls back rather than vanishing.
    const unreadable = orientacaoProfissionalFromPayload({
      paraQuem: { cases: [{ text: "  " }] },
    });
    expect(unreadable.paraQuem.cases).toEqual(ORIENTACAO_PROFISSIONAL_DEFAULTS.paraQuem.cases);
  });

  it("keeps the movements in stored order and numbers the ones she left blank", () => {
    const page = orientacaoProfissionalFromPayload({
      oPercurso: {
        steps: [
          { numeral: "Um", title: "A história", text: "Começamos por ela." },
          { title: "Os testes", text: "Aplicados dentro do processo." },
          { numeral: "   ", title: "A devolutiva", text: "O que ficou claro." },
        ],
      },
    });

    expect(page.oPercurso.steps).toEqual([
      { numeral: "Um", title: "A história", text: "Começamos por ela." },
      { numeral: "II", title: "Os testes", text: "Aplicados dentro do processo." },
      { numeral: "III", title: "A devolutiva", text: "O que ficou claro." },
    ]);
  });

  it("numbers a seventh movement past the roman numerals rather than dropping it", () => {
    const seven = Array.from({ length: 7 }, (_, index) => ({
      title: `Movimento ${index + 1}`,
      text: "Texto.",
    }));

    const page = orientacaoProfissionalFromPayload({ oPercurso: { steps: seven } });

    expect(page.oPercurso.steps.map((step) => step.numeral)).toEqual([
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "7",
    ]);
  });

  // Both sides of every row filter. A row with a title and no text and a row with
  // text and no title are equally unreadable, and covering only the first is the
  // surviving mutant the primeira-conversa build was bitten by.
  it("drops half-typed rows from either side, and falls back when nothing readable survives", () => {
    const partial = orientacaoProfissionalFromPayload({
      oPercurso: {
        steps: [
          { title: "Sem texto" },
          { text: "Sem título" },
          { title: "Testes", text: "Pronto." },
        ],
      },
      nemCoaching: {
        distinctions: [
          { title: "Registro" },
          { text: "Sem título" },
          { title: "Testes", text: "Dentro do processo." },
        ],
      },
      pratico: {
        items: [
          { label: "Duração" },
          { value: "Sem rótulo" },
          { label: "Idiomas", value: "Português." },
        ],
      },
    });

    // "III", not "I": the numeral comes from the row's stored position, the same
    // rule `primeiraConversaFromPayload` uses. Numbering the survivors instead would
    // make a movement's numeral shift while she is still filling in the one above it.
    expect(partial.oPercurso.steps).toEqual([{ numeral: "III", title: "Testes", text: "Pronto." }]);
    expect(partial.nemCoaching.distinctions).toEqual([
      { title: "Testes", text: "Dentro do processo." },
    ]);
    expect(partial.pratico.items).toEqual([{ label: "Idiomas", value: "Português." }]);

    // Nothing readable in any row: the section falls back rather than vanishing.
    const unreadable = orientacaoProfissionalFromPayload({
      nemCoaching: { distinctions: [{ text: "Só o texto" }] },
    });

    expect(unreadable.nemCoaching.distinctions).toEqual(
      ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.distinctions,
    );
  });

  it("resolves the plate to its label and image, and to null while the scan is missing", () => {
    const withImage = orientacaoProfissionalFromPayload({
      nemCoaching: {
        plate: {
          image: upload("/media/encruzilhada.jpg", "um caminho que se divide em dois"),
          painter: "Gustave Doré",
          workTitle: "A encruzilhada",
          year: "1861",
        },
      },
    });

    expect(withImage.nemCoaching.plate).toEqual({
      image: {
        src: "/media/encruzilhada.jpg",
        alt: "um caminho que se divide em dois",
        width: 1400,
        height: 1000,
      },
      painter: "Gustave Doré",
      workTitle: "A encruzilhada",
      year: "1861",
    });

    // The label can be recorded before the scan is sourced — the frame stands in
    // for the image alone (REQ-005), and provenance is never invented.
    const labelOnly = orientacaoProfissionalFromPayload({
      nemCoaching: { plate: { painter: "Gustave Doré", year: "1861" } },
    });

    expect(labelOnly.nemCoaching.plate.image).toBeNull();
    expect(labelOnly.nemCoaching.plate.painter).toBe("Gustave Doré");
    expect(labelOnly.nemCoaching.plate.workTitle).toBeNull();

    // Nothing about the plate is ever defaulted: an untouched global leaves the
    // slot empty so the labeled frame renders instead of a borrowed painting.
    expect(orientacaoProfissionalFromPayload({}).nemCoaching.plate).toEqual({
      image: null,
      painter: null,
      workTitle: null,
      year: null,
    });
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = orientacaoProfissionalFromPayload({
      nemCoaching: { plate: { image: { url: "/media/sem-medidas.jpg", alt: "x" } } },
    });

    expect(page.nemCoaching.plate.image).toBeNull();
  });
});
