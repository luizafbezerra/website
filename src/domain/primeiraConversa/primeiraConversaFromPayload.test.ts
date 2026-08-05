import { describe, expect, it } from "vitest";
import type { PayloadPagePrimeiraConversa } from "@/infrastructure/payload/getPagePrimeiraConversaGlobal";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "./PrimeiraConversa";
import { primeiraConversaFromPayload } from "./primeiraConversaFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("primeiraConversaFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(primeiraConversaFromPayload({})).toEqual(PRIMEIRA_CONVERSA_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPagePrimeiraConversa = {
      abertura: { heading: "   " },
      miniFaq: { linkLabel: "" },
      bilhete: { chooseLabel: "  " },
    };

    const page = primeiraConversaFromPayload(doc);

    expect(page.abertura.heading).toBe(PRIMEIRA_CONVERSA_DEFAULTS.abertura.heading);
    expect(page.miniFaq.linkLabel).toBe(PRIMEIRA_CONVERSA_DEFAULTS.miniFaq.linkLabel);
    expect(page.bilhete.chooseLabel).toBe(PRIMEIRA_CONVERSA_DEFAULTS.bilhete.chooseLabel);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = primeiraConversaFromPayload({ bilhete: { intro: emptied } });

    expect(page.bilhete.intro).toBe(PRIMEIRA_CONVERSA_DEFAULTS.bilhete.intro);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPagePrimeiraConversa = {
      abertura: { heading: "Como começamos" },
      logistica: { heading: "O prático" },
    };

    const page = primeiraConversaFromPayload(doc);

    expect(page.abertura.heading).toBe("Como começamos");
    expect(page.logistica.heading).toBe("O prático");
    // Untouched siblings still fall back.
    expect(page.passoAPasso.heading).toBe(PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.heading);
  });

  // Payload materializes an untouched array as `[]`, so every array on this page
  // reads an empty one as un-edited: all four belong to sections CONCEPT §6
  // requires, and none has a designed empty state.
  it("falls back on every empty array rather than dropping a required section", () => {
    const page = primeiraConversaFromPayload({
      passoAPasso: { steps: [] },
      permissoes: { items: [] },
      logistica: { items: [] },
      miniFaq: { items: [] },
    });

    expect(page.passoAPasso.steps).toEqual(PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.steps);
    expect(page.permissoes.items).toEqual(PRIMEIRA_CONVERSA_DEFAULTS.permissoes.items);
    expect(page.logistica.items).toEqual(PRIMEIRA_CONVERSA_DEFAULTS.logistica.items);
    expect(page.miniFaq.items).toEqual(PRIMEIRA_CONVERSA_DEFAULTS.miniFaq.items);
  });

  it("keeps the tempos in stored order and numbers the ones she left blank", () => {
    const page = primeiraConversaFromPayload({
      passoAPasso: {
        steps: [
          { numeral: "Um", title: "Você escreve", text: "Uma mensagem curta." },
          { title: "Combinamos", text: "Eu ofereço horários." },
        ],
      },
    });

    expect(page.passoAPasso.steps).toEqual([
      { numeral: "Um", title: "Você escreve", text: "Uma mensagem curta." },
      { numeral: "II", title: "Combinamos", text: "Eu ofereço horários." },
    ]);
  });

  it("drops half-typed rows, and falls back when nothing readable survives", () => {
    const partial = primeiraConversaFromPayload({
      passoAPasso: { steps: [{ title: "Sem texto ainda" }, { title: "II", text: "Pronto." }] },
      logistica: { items: [{ label: "Duração" }, { label: "Idiomas", value: "Português." }] },
      miniFaq: { items: [{ question: "Sem resposta?" }] },
    });

    expect(partial.passoAPasso.steps).toEqual([{ numeral: "II", title: "II", text: "Pronto." }]);
    expect(partial.logistica.items).toEqual([{ label: "Idiomas", value: "Português." }]);
    // Every row was unreadable, so the section falls back rather than vanishing.
    expect(partial.miniFaq.items).toEqual(PRIMEIRA_CONVERSA_DEFAULTS.miniFaq.items);
  });

  it("resolves the plate to its label and image, and to null while the scan is missing", () => {
    const withImage = primeiraConversaFromPayload({
      permissoes: {
        plate: {
          image: upload("/media/soleira.jpg", "uma porta entreaberta"),
          painter: "Vilhelm Hammershøi",
          workTitle: "Interior com portas abertas",
          year: "1905",
        },
      },
    });

    expect(withImage.permissoes.plate).toEqual({
      image: {
        src: "/media/soleira.jpg",
        alt: "uma porta entreaberta",
        width: 1400,
        height: 1000,
      },
      painter: "Vilhelm Hammershøi",
      workTitle: "Interior com portas abertas",
      year: "1905",
    });

    // The label can be recorded before the scan is sourced — the frame stands in
    // for the image alone (REQ-005), and provenance is never invented.
    const labelOnly = primeiraConversaFromPayload({
      permissoes: { plate: { painter: "Vilhelm Hammershøi", year: "1905" } },
    });

    expect(labelOnly.permissoes.plate.image).toBeNull();
    expect(labelOnly.permissoes.plate.painter).toBe("Vilhelm Hammershøi");
    expect(labelOnly.permissoes.plate.workTitle).toBeNull();
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = primeiraConversaFromPayload({
      permissoes: { plate: { image: { url: "/media/sem-medidas.jpg", alt: "x" } } },
    });

    expect(page.permissoes.plate.image).toBeNull();
  });
});
