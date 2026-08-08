import { describe, expect, it } from "vitest";
import { ZODIAC_SIGN_IDS } from "@/domain/zodiac/zodiacContent";
import type { PayloadPageAnalise } from "@/infrastructure/payload/getPageAnaliseGlobal";
import { ANALISE_DEFAULTS } from "./Analise";
import { analiseFromPayload } from "./analiseFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("analiseFromPayload", () => {
  it("maps an untouched global to the defaults, except the parallels' launch state", () => {
    expect(analiseFromPayload({})).toEqual({
      ...ANALISE_DEFAULTS,
      // The one deliberate disagreement: the defaults carry three labeled rows
      // for the seed to write, but the mapper reads an absent array literally —
      // a parallel with nothing to read does not render.
      sonhoAmpliado: { ...ANALISE_DEFAULTS.sonhoAmpliado, parallels: [] },
    });
    // A page rendered from a blank document and a page rendered with Payload
    // off read the same — including Sonho ampliado, whose default motif is null
    // (the section waits for her words everywhere).
    expect(analiseFromPayload({}).sonhoAmpliado.motif).toBeNull();
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageAnalise = {
      abertura: { heading: "   " },
      oMetodo: { closingLine: "", toolsLine: "  " },
      mandala: { intro: "  " },
      oQueTrazem: { linkLabel: " " },
      pratico: { comecar: { body: "\n" } },
    };

    const page = analiseFromPayload(doc);

    expect(page.abertura.heading).toBe(ANALISE_DEFAULTS.abertura.heading);
    expect(page.oMetodo.closingLine).toBe(ANALISE_DEFAULTS.oMetodo.closingLine);
    expect(page.oMetodo.toolsLine).toBe(ANALISE_DEFAULTS.oMetodo.toolsLine);
    expect(page.mandala.intro).toBe(ANALISE_DEFAULTS.mandala.intro);
    expect(page.oQueTrazem.linkLabel).toBe(ANALISE_DEFAULTS.oQueTrazem.linkLabel);
    expect(page.pratico.comecar.body).toBe(ANALISE_DEFAULTS.pratico.comecar.body);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = analiseFromPayload({
      abertura: { body: emptied },
      oMetodo: { body: emptied, individuacao: emptied },
    });

    expect(page.abertura.body).toBe(ANALISE_DEFAULTS.abertura.body);
    // Her five paragraphs. An emptied editor state must never delete them.
    expect(page.oMetodo.body).toBe(ANALISE_DEFAULTS.oMetodo.body);
    expect(page.oMetodo.individuacao).toBe(ANALISE_DEFAULTS.oMetodo.individuacao);
  });

  it("keeps her wording section by section when she has written it", () => {
    const page = analiseFromPayload({
      abertura: { heading: "A análise" },
      pratico: { heading: "O combinado", comecar: { body: "Me escreva." } },
    });

    expect(page.abertura.heading).toBe("A análise");
    expect(page.pratico.heading).toBe("O combinado");
    expect(page.pratico.comecar.body).toBe("Me escreva.");
    // Untouched siblings still fall back.
    expect(page.oMetodo.heading).toBe(ANALISE_DEFAULTS.oMetodo.heading);
    expect(page.pratico.comecar.linkLabel).toBe(ANALISE_DEFAULTS.pratico.comecar.linkLabel);
  });

  // Payload materializes an untouched array as `[]`. The two arrays belonging
  // to sections CONCEPT §6 requires read that as un-edited; `parallels` does not.
  it("falls back on the required sections' empty arrays", () => {
    const page = analiseFromPayload({
      oQueTrazem: { pillars: [] },
      pratico: { items: [] },
    });

    expect(page.oQueTrazem.pillars).toEqual(ANALISE_DEFAULTS.oQueTrazem.pillars);
    expect(page.pratico.items).toEqual(ANALISE_DEFAULTS.pratico.items);
  });

  it("keeps the pillars in stored order and numbers the ones she left blank", () => {
    const page = analiseFromPayload({
      oQueTrazem: {
        pillars: [
          { numeral: "Um", title: "Ansiedade", text: "O peito aperta." },
          { title: "Relações", text: "Lutos e separações." },
        ],
      },
    });

    expect(page.oQueTrazem.pillars).toEqual([
      { numeral: "Um", title: "Ansiedade", text: "O peito aperta." },
      { numeral: "II", title: "Relações", text: "Lutos e separações." },
    ]);
  });

  it("drops half-typed rows, and falls back when nothing readable survives", () => {
    const page = analiseFromPayload({
      pratico: { items: [{ label: "Duração" }, { label: "Idiomas", value: "Português." }] },
      oQueTrazem: { pillars: [{ title: "Sem texto" }] },
    });

    expect(page.pratico.items).toEqual([{ label: "Idiomas", value: "Português." }]);
    // Every pillar was unreadable, so her three survive rather than vanishing.
    expect(page.oQueTrazem.pillars).toEqual(ANALISE_DEFAULTS.oQueTrazem.pillars);
  });

  it("resolves the método plate to its label and image, and to null while the scan is missing", () => {
    const withImage = analiseFromPayload({
      oMetodo: {
        plate: {
          image: upload("/media/individuacao.jpg", "uma figura ao amanhecer"),
          painter: "Odilon Redon",
          workTitle: "O nascimento de Vênus",
          year: "1912",
        },
      },
    });

    expect(withImage.oMetodo.plate).toEqual({
      image: {
        src: "/media/individuacao.jpg",
        alt: "uma figura ao amanhecer",
        width: 1400,
        height: 1000,
        blurDataURL: null,
      },
      painter: "Odilon Redon",
      workTitle: "O nascimento de Vênus",
      year: "1912",
    });

    // Provenance can be recorded before the scan is sourced (REQ-005), and is
    // never invented — an unset line stays null rather than being guessed.
    const labelOnly = analiseFromPayload({ oMetodo: { plate: { painter: "Odilon Redon" } } });

    expect(labelOnly.oMetodo.plate.image).toBeNull();
    expect(labelOnly.oMetodo.plate.painter).toBe("Odilon Redon");
    expect(labelOnly.oMetodo.plate.workTitle).toBeNull();
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = analiseFromPayload({
      oMetodo: { plate: { image: { url: "/media/sem-medidas.jpg", alt: "x" } } },
    });

    expect(page.oMetodo.plate.image).toBeNull();
  });

  // -------------------------------------------------------------------------
  // REQ-007 — the wheel is visual-only until her readings exist, and this mapper
  // is where that gate lives.
  // -------------------------------------------------------------------------

  it("returns every sign with both readings null on an untouched mandala tab", () => {
    const { readings } = analiseFromPayload({}).mandala;

    expect(Object.keys(readings)).toEqual([...ZODIAC_SIGN_IDS]);
    for (const id of ZODIAC_SIGN_IDS) {
      expect(readings[id], id).toEqual({ reading: null, vedicReading: null });
    }
  });

  it("carries the readings she has written, one sign at a time", () => {
    const { readings } = analiseFromPayload({
      mandala: {
        aries: { reading: "Áries marca o impulso." },
        pisces: { vedicReading: "As três mansões de Peixes." },
      },
    }).mandala;

    expect(readings.aries).toEqual({ reading: "Áries marca o impulso.", vedicReading: null });
    expect(readings.pisces).toEqual({
      reading: null,
      vedicReading: "As três mansões de Peixes.",
    });
    // Every other sign stays silent.
    expect(readings.leo).toEqual({ reading: null, vedicReading: null });
  });

  it("treats a whitespace-only reading as unwritten, so the wheel stays visual", () => {
    const { readings } = analiseFromPayload({
      mandala: { taurus: { reading: "   ", vedicReading: "\n" } },
    }).mandala;

    expect(readings.taurus).toEqual({ reading: null, vedicReading: null });
  });

  // -------------------------------------------------------------------------
  // Sonho ampliado — gated on the motif, and a parallel renders only once it
  // has something to read.
  // -------------------------------------------------------------------------

  it("stays hidden until she writes the motif, and turns on with it", () => {
    // The one field with no code fallback: her switch for the whole section.
    // The default is null too, so the section waits everywhere by default.
    expect(ANALISE_DEFAULTS.sonhoAmpliado.motif).toBeNull();
    expect(analiseFromPayload({ sonhoAmpliado: { motif: "   " } }).sonhoAmpliado.motif).toBeNull();
    expect(analiseFromPayload({ sonhoAmpliado: {} }).sonhoAmpliado.motif).toBeNull();

    expect(
      analiseFromPayload({ sonhoAmpliado: { motif: "Sonhei com o mar." } }).sonhoAmpliado.motif,
    ).toBe("Sonhei com o mar.");
  });

  it("reads an empty parallels array literally — that is the resting state", () => {
    const page = analiseFromPayload({
      sonhoAmpliado: { motif: "Sonhei com o mar.", parallels: [] },
    });

    expect(page.sonhoAmpliado.parallels).toEqual([]);
    // The section still renders: its intro and motif carry it (CONCEPT §9.3).
    expect(page.sonhoAmpliado.intro).toBe(ANALISE_DEFAULTS.sonhoAmpliado.intro);
  });

  it("keeps a parallel with text, a parallel with only a painting, and drops a bare label", () => {
    const page = analiseFromPayload({
      sonhoAmpliado: {
        parallels: [
          {
            label: "Uma pintura",
            image: upload("/media/comodo.jpg", "um interior com porta entreaberta"),
            painter: "Vilhelm Hammershøi",
            workTitle: "Interior com portas abertas",
            year: "1905",
          },
          { label: "Um mito", text: "Psique abre a porta que lhe foi proibida." },
          { label: "Uma passagem" },
        ],
      },
    });

    expect(page.sonhoAmpliado.parallels).toHaveLength(2);
    expect(page.sonhoAmpliado.parallels[0]?.text).toBeNull();
    expect(page.sonhoAmpliado.parallels[0]?.plate.painter).toBe("Vilhelm Hammershøi");
    expect(page.sonhoAmpliado.parallels[1]).toEqual({
      label: "Um mito",
      text: "Psique abre a porta que lhe foi proibida.",
      plate: { image: null, painter: null, workTitle: null, year: null },
    });
  });

  it("keeps a parallel whose provenance is recorded before its scan exists", () => {
    // REQ-005 reaching this section: the frame stands in for the image alone, and
    // the gallery label is already something to read.
    const page = analiseFromPayload({
      sonhoAmpliado: {
        parallels: [{ label: "Uma pintura", painter: "Vilhelm Hammershøi", year: "1905" }],
      },
    });

    expect(page.sonhoAmpliado.parallels).toHaveLength(1);
    expect(page.sonhoAmpliado.parallels[0]?.plate.image).toBeNull();
    expect(page.sonhoAmpliado.parallels[0]?.plate.painter).toBe("Vilhelm Hammershøi");
  });

  it("drops a parallel whose text is written but whose label was cleared", () => {
    const page = analiseFromPayload({
      sonhoAmpliado: { parallels: [{ label: "  ", text: "Um mito sem rótulo." }] },
    });

    expect(page.sonhoAmpliado.parallels).toEqual([]);
  });

  it("leaves the closing line absent until she writes it", () => {
    expect(analiseFromPayload({}).sonhoAmpliado.closingLine).toBeNull();
    expect(
      analiseFromPayload({ sonhoAmpliado: { closingLine: "O cômodo era sempre dela." } })
        .sonhoAmpliado.closingLine,
    ).toBe("O cômodo era sempre dela.");
  });
});
