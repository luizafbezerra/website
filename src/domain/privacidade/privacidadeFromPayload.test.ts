import { describe, expect, it } from "vitest";
import type { PayloadPagePrivacidade } from "@/infrastructure/payload/getPagePrivacidadeGlobal";
import { PRIVACIDADE_DEFAULTS } from "./Privacidade";
import { privacidadeFromPayload } from "./privacidadeFromPayload";

describe("privacidadeFromPayload", () => {
  it("maps an untouched global to the defaults of the locale being read", () => {
    expect(privacidadeFromPayload({}, "pt")).toEqual(PRIVACIDADE_DEFAULTS.pt);
    expect(privacidadeFromPayload({}, "en")).toEqual(PRIVACIDADE_DEFAULTS.en);
  });

  // The whole reason this page's defaults are keyed by locale: an anglophone
  // checking whether the site can be trusted with them must not be answered in
  // Portuguese, even with Payload switched off.
  it("never hands an English reader the Portuguese page", () => {
    const en = privacidadeFromPayload({}, "en");

    expect(en.abertura.heading).not.toBe(PRIVACIDADE_DEFAULTS.pt.abertura.heading);
    expect(en.guarda.heading).not.toBe(PRIVACIDADE_DEFAULTS.pt.guarda.heading);
    expect(en.nuncaFaz.heading).not.toBe(PRIVACIDADE_DEFAULTS.pt.nuncaFaz.heading);
    expect(en.bilheteNota.heading).not.toBe(PRIVACIDADE_DEFAULTS.pt.bilheteNota.heading);
    expect(en.responsavel.heading).not.toBe(PRIVACIDADE_DEFAULTS.pt.responsavel.heading);
    expect(en.guarda.items).not.toEqual(PRIVACIDADE_DEFAULTS.pt.guarda.items);
    expect(en.nuncaFaz.items).not.toEqual(PRIVACIDADE_DEFAULTS.pt.nuncaFaz.items);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPagePrivacidade = {
      abertura: { heading: "   " },
      bilheteNota: { body: "", linkLabel: "  " },
      responsavel: { rights: " ", confidentiality: "\n" },
    };

    const page = privacidadeFromPayload(doc, "pt");

    expect(page.abertura.heading).toBe(PRIVACIDADE_DEFAULTS.pt.abertura.heading);
    expect(page.bilheteNota.body).toBe(PRIVACIDADE_DEFAULTS.pt.bilheteNota.body);
    expect(page.bilheteNota.linkLabel).toBe(PRIVACIDADE_DEFAULTS.pt.bilheteNota.linkLabel);
    expect(page.responsavel.rights).toBe(PRIVACIDADE_DEFAULTS.pt.responsavel.rights);
    expect(page.responsavel.confidentiality).toBe(
      PRIVACIDADE_DEFAULTS.pt.responsavel.confidentiality,
    );
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = privacidadeFromPayload(
      { abertura: { body: emptied }, responsavel: { body: emptied } },
      "pt",
    );

    expect(page.abertura.body).toBe(PRIVACIDADE_DEFAULTS.pt.abertura.body);
    expect(page.responsavel.body).toBe(PRIVACIDADE_DEFAULTS.pt.responsavel.body);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPagePrivacidade = {
      abertura: { heading: "O que este site sabe" },
      nuncaFaz: { heading: "O que ele nunca faz" },
    };

    const page = privacidadeFromPayload(doc, "pt");

    expect(page.abertura.heading).toBe("O que este site sabe");
    expect(page.nuncaFaz.heading).toBe("O que ele nunca faz");
    // Untouched siblings still fall back.
    expect(page.guarda.heading).toBe(PRIVACIDADE_DEFAULTS.pt.guarda.heading);
    expect(page.responsavel.heading).toBe(PRIVACIDADE_DEFAULTS.pt.responsavel.heading);
  });

  // Payload materializes an untouched array as `[]`, and on this page an empty
  // list would state something false about the site rather than merely look thin.
  it("falls back on an empty list rather than claiming the site keeps nothing", () => {
    const page = privacidadeFromPayload({ guarda: { items: [] }, nuncaFaz: { items: [] } }, "pt");

    expect(page.guarda.items).toEqual(PRIVACIDADE_DEFAULTS.pt.guarda.items);
    expect(page.nuncaFaz.items).toEqual(PRIVACIDADE_DEFAULTS.pt.nuncaFaz.items);
  });

  it("keeps her list in stored order", () => {
    const page = privacidadeFromPayload(
      {
        guarda: {
          items: [
            { title: "Estatísticas", text: "Anônimas e agregadas." },
            { title: "Idioma", text: "No seu navegador." },
          ],
        },
      },
      "pt",
    );

    expect(page.guarda.items).toEqual([
      { title: "Estatísticas", text: "Anônimas e agregadas." },
      { title: "Idioma", text: "No seu navegador." },
    ]);
  });

  it("drops a half-typed row, and falls back when nothing readable survives", () => {
    const page = privacidadeFromPayload(
      {
        guarda: {
          items: [{ title: "Sem texto ainda" }, { title: "Idioma", text: "No seu navegador." }],
        },
        nuncaFaz: { items: [{ text: "Sem título ainda." }] },
      },
      "pt",
    );

    expect(page.guarda.items).toEqual([{ title: "Idioma", text: "No seu navegador." }]);
    // Every row was unreadable, so the list falls back rather than vanishing.
    expect(page.nuncaFaz.items).toEqual(PRIVACIDADE_DEFAULTS.pt.nuncaFaz.items);
  });

  // Both halves of the drop condition matter, and each fails for its own reason:
  // a title with no text renders a term with no definition, a text with no title
  // renders a fact nobody can scan.
  it("drops a row for a missing title as readily as for a missing text", () => {
    const page = privacidadeFromPayload(
      {
        nuncaFaz: {
          items: [
            { title: "Não segue você.", text: "Sem pixel, sem identificador." },
            { title: "   ", text: "Um texto órfão." },
            { title: "Não vende nada.", text: "  " },
          ],
        },
      },
      "pt",
    );

    expect(page.nuncaFaz.items).toEqual([
      { title: "Não segue você.", text: "Sem pixel, sem identificador." },
    ]);
  });

  // The two lists are normalized by one function and must not share a fallback:
  // reading the "keeps" rows into the "never does" list would be a plausible bug
  // with a catastrophic reading.
  it("keeps the two lists apart", () => {
    const page = privacidadeFromPayload(
      { guarda: { items: [{ title: "Idioma", text: "No seu navegador." }] } },
      "pt",
    );

    expect(page.guarda.items).toEqual([{ title: "Idioma", text: "No seu navegador." }]);
    expect(page.nuncaFaz.items).toEqual(PRIVACIDADE_DEFAULTS.pt.nuncaFaz.items);
    expect(page.nuncaFaz.items).not.toEqual(page.guarda.items);
  });
});
