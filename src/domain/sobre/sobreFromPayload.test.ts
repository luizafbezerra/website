import { describe, expect, it } from "vitest";
import type { PayloadPageSobre } from "@/infrastructure/payload/getPageSobreGlobal";
import { SOBRE_DEFAULTS } from "./Sobre";
import { sobreFromPayload } from "./sobreFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "um retrato") => ({ url, alt, width: 1200, height: 1500 });

describe("sobreFromPayload", () => {
  it("maps an untouched global to the defaults", () => {
    expect(sobreFromPayload({})).toEqual(SOBRE_DEFAULTS);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageSobre = {
      abertura: { heading: "   " },
      formacao: { heading: "" },
      aClinica: { linkLabel: "  " },
      assinatura: { closingLine: "\n" },
    };

    const page = sobreFromPayload(doc);

    expect(page.abertura.heading).toBe(SOBRE_DEFAULTS.abertura.heading);
    expect(page.formacao.heading).toBe(SOBRE_DEFAULTS.formacao.heading);
    expect(page.aClinica.linkLabel).toBe(SOBRE_DEFAULTS.aClinica.linkLabel);
    expect(page.assinatura.closingLine).toBe(SOBRE_DEFAULTS.assinatura.closingLine);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = sobreFromPayload({ quemE: { body: emptied }, aClinica: { body: emptied } });

    expect(page.quemE.body).toBe(SOBRE_DEFAULTS.quemE.body);
    expect(page.aClinica.body).toBe(SOBRE_DEFAULTS.aClinica.body);
  });

  it("keeps her wording section by section when she has written it", () => {
    const doc: PayloadPageSobre = {
      abertura: { heading: "Luiza Bezerra" },
      aClinica: { heading: "Como a clínica nasceu" },
    };

    const page = sobreFromPayload(doc);

    expect(page.abertura.heading).toBe("Luiza Bezerra");
    expect(page.aClinica.heading).toBe("Como a clínica nasceu");
    // Untouched siblings still fall back.
    expect(page.quemE.heading).toBe(SOBRE_DEFAULTS.quemE.heading);
  });

  // Payload materializes an untouched array as `[]`, and formação is the section
  // this page exists for, so an empty one reads as un-edited rather than as a
  // deliberate deletion of the record.
  it("falls back on an empty formação array rather than dropping the record", () => {
    const page = sobreFromPayload({ formacao: { items: [] } });

    expect(page.formacao.items).toEqual(SOBRE_DEFAULTS.formacao.items);
  });

  it("keeps the record in stored order, with institution and period as written", () => {
    const page = sobreFromPayload({
      formacao: {
        items: [
          { title: "Graduação em Psicologia", institution: "PUC-SP", period: "1998–2003" },
          { title: "Pós-graduação em Psicologia Analítica", institution: "Instituto Numen" },
        ],
      },
    });

    expect(page.formacao.items).toEqual([
      { title: "Graduação em Psicologia", institution: "PUC-SP", period: "1998–2003" },
      {
        title: "Pós-graduação em Psicologia Analítica",
        institution: "Instituto Numen",
        period: null,
      },
    ]);
  });

  it("keeps a row that has only a course title, and drops one that has no title", () => {
    const page = sobreFromPayload({
      formacao: {
        items: [
          // A course she has typed but not yet attributed still reads as a course.
          { title: "Extensão em Fenômenos Anômalos" },
          // An institution on its own states nothing a reader can verify.
          { institution: "USP", period: "2019" },
        ],
      },
    });

    expect(page.formacao.items).toEqual([
      { title: "Extensão em Fenômenos Anômalos", institution: null, period: null },
    ]);
  });

  it("falls back when a populated array holds nothing readable", () => {
    const page = sobreFromPayload({
      formacao: { items: [{ institution: "PUC-SP" }, { title: "   " }] },
    });

    expect(page.formacao.items).toEqual(SOBRE_DEFAULTS.formacao.items);
  });

  it("blanks a cleared institution or period rather than printing an empty line", () => {
    const page = sobreFromPayload({
      formacao: { items: [{ title: "Aprimoramento", institution: " ", period: "" }] },
    });

    expect(page.formacao.items).toEqual([
      { title: "Aprimoramento", institution: null, period: null },
    ]);
  });

  it("resolves the portrait and the signature, each independently of the other", () => {
    const page = sobreFromPayload({
      quemE: { portrait: upload("/media/luiza.jpg", "Luiza sentada, luz de janela") },
      assinatura: { image: { url: "/media/assinatura.png", alt: "", width: 800, height: 300 } },
    });

    expect(page.quemE.portrait).toEqual({
      src: "/media/luiza.jpg",
      alt: "Luiza sentada, luz de janela",
      width: 1200,
      height: 1500,
    });
    expect(page.assinatura.image).toEqual({
      src: "/media/assinatura.png",
      alt: "",
      width: 800,
      height: 300,
    });

    // The signature can land months before the portrait shoot, and the reverse.
    const portraitOnly = sobreFromPayload({ quemE: { portrait: upload("/media/luiza.jpg") } });
    expect(portraitOnly.quemE.portrait).not.toBeNull();
    expect(portraitOnly.assinatura.image).toBeNull();
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = sobreFromPayload({
      quemE: { portrait: { url: "/media/sem-medidas.jpg", alt: "x" } },
      assinatura: { image: { url: "/media/sem-medidas.png", alt: "x" } },
    });

    expect(page.quemE.portrait).toBeNull();
    expect(page.assinatura.image).toBeNull();
  });
});
