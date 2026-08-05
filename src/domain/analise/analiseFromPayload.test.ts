import { describe, expect, it } from "vitest";
import { ZODIAC_SIGN_IDS } from "@/domain/zodiac/zodiacContent";
import type { PayloadPageAnalise } from "@/infrastructure/payload/getPageAnaliseGlobal";
import { ANALISE_DEFAULTS } from "./Analise";
import { analiseFromPayload } from "./analiseFromPayload";

/** A populated `media` upload as Payload returns it at depth 1. */
const upload = (url: string, alt = "uma pintura") => ({ url, alt, width: 1400, height: 1000 });

describe("analiseFromPayload", () => {
  it("maps an untouched global to the defaults, except the motif that gates its section", () => {
    expect(analiseFromPayload({})).toEqual({
      ...ANALISE_DEFAULTS,
      sonhoAmpliado: { ...ANALISE_DEFAULTS.sonhoAmpliado, motif: null, parallels: [] },
    });
    // Everything else agrees field for field, so a page rendered from a blank
    // document and a page rendered with Payload off read the same.
    expect(analiseFromPayload({}).oQueTrazem).toEqual(ANALISE_DEFAULTS.oQueTrazem);
    expect(analiseFromPayload({}).pratico).toEqual(ANALISE_DEFAULTS.pratico);
  });

  it("treats a cleared field as an absence, not as a value", () => {
    const doc: PayloadPageAnalise = {
      abertura: { heading: "   " },
      oMetodo: { closingLine: "" },
      mandala: { intro: "  " },
      oQueTrazem: { linkLabel: " " },
      paraComecar: { body: "\n" },
    };

    const page = analiseFromPayload(doc);

    expect(page.abertura.heading).toBe(ANALISE_DEFAULTS.abertura.heading);
    expect(page.oMetodo.closingLine).toBe(ANALISE_DEFAULTS.oMetodo.closingLine);
    expect(page.mandala.intro).toBe(ANALISE_DEFAULTS.mandala.intro);
    expect(page.oQueTrazem.linkLabel).toBe(ANALISE_DEFAULTS.oQueTrazem.linkLabel);
    expect(page.paraComecar.body).toBe(ANALISE_DEFAULTS.paraComecar.body);
  });

  it("falls back on rich text that Lexical left with no paragraphs", () => {
    const emptied = { root: { children: [] } } as never;

    const page = analiseFromPayload({
      abertura: { body: emptied },
      aVisao: { body: emptied },
      oQueTrazem: { intro: emptied },
    });

    expect(page.abertura.body).toBe(ANALISE_DEFAULTS.abertura.body);
    expect(page.aVisao.body).toBe(ANALISE_DEFAULTS.aVisao.body);
    // Her five paragraphs. An emptied editor state must never delete them.
    expect(page.oQueTrazem.intro).toBe(ANALISE_DEFAULTS.oQueTrazem.intro);
  });

  it("keeps her wording section by section when she has written it", () => {
    const page = analiseFromPayload({
      abertura: { heading: "A análise" },
      pratico: { heading: "O combinado" },
    });

    expect(page.abertura.heading).toBe("A análise");
    expect(page.pratico.heading).toBe("O combinado");
    // Untouched siblings still fall back.
    expect(page.aVisao.heading).toBe(ANALISE_DEFAULTS.aVisao.heading);
  });

  // Payload materializes an untouched array as `[]`. The three arrays belonging
  // to sections CONCEPT §6 requires read that as un-edited; `parallels` does not.
  it("falls back on the required sections' empty arrays", () => {
    const page = analiseFromPayload({
      oMetodo: { tools: [] },
      oQueTrazem: { pillars: [] },
      pratico: { items: [] },
    });

    expect(page.oMetodo.tools).toEqual(ANALISE_DEFAULTS.oMetodo.tools);
    expect(page.oQueTrazem.pillars).toEqual(ANALISE_DEFAULTS.oQueTrazem.pillars);
    expect(page.pratico.items).toEqual(ANALISE_DEFAULTS.pratico.items);
  });

  it("reads an empty parallels array literally — that is the launch state", () => {
    const page = analiseFromPayload({
      sonhoAmpliado: { motif: ANALISE_DEFAULTS.sonhoAmpliado.motif, parallels: [] },
    });

    expect(page.sonhoAmpliado.parallels).toEqual([]);
    // The section still renders: its intro and motif carry it (CONCEPT §9.3).
    expect(page.sonhoAmpliado.motif).toBe(ANALISE_DEFAULTS.sonhoAmpliado.motif);
    expect(page.sonhoAmpliado.intro).toBe(ANALISE_DEFAULTS.sonhoAmpliado.intro);
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
      oMetodo: { tools: [{ title: "Sem texto ainda" }, { title: "Os sonhos", text: "Pronto." }] },
      pratico: { items: [{ label: "Duração" }, { label: "Idiomas", value: "Português." }] },
      oQueTrazem: { pillars: [{ title: "Sem texto" }] },
    });

    expect(page.oMetodo.tools).toEqual([{ title: "Os sonhos", text: "Pronto." }]);
    expect(page.pratico.items).toEqual([{ label: "Idiomas", value: "Português." }]);
    // Every pillar was unreadable, so her three survive rather than vanishing.
    expect(page.oQueTrazem.pillars).toEqual(ANALISE_DEFAULTS.oQueTrazem.pillars);
  });

  it("resolves the visão plate to its label and image, and to null while the scan is missing", () => {
    const withImage = analiseFromPayload({
      aVisao: {
        plate: {
          image: upload("/media/individuacao.jpg", "uma figura ao amanhecer"),
          painter: "Odilon Redon",
          workTitle: "O nascimento de Vênus",
          year: "1912",
        },
      },
    });

    expect(withImage.aVisao.plate).toEqual({
      image: {
        src: "/media/individuacao.jpg",
        alt: "uma figura ao amanhecer",
        width: 1400,
        height: 1000,
      },
      painter: "Odilon Redon",
      workTitle: "O nascimento de Vênus",
      year: "1912",
    });

    // Provenance can be recorded before the scan is sourced (REQ-005), and is
    // never invented — an unset line stays null rather than being guessed.
    const labelOnly = analiseFromPayload({ aVisao: { plate: { painter: "Odilon Redon" } } });

    expect(labelOnly.aVisao.plate.image).toBeNull();
    expect(labelOnly.aVisao.plate.painter).toBe("Odilon Redon");
    expect(labelOnly.aVisao.plate.workTitle).toBeNull();
  });

  it("refuses an upload with no intrinsic size rather than shipping layout shift", () => {
    const page = analiseFromPayload({
      aVisao: { plate: { image: { url: "/media/sem-medidas.jpg", alt: "x" } } },
    });

    expect(page.aVisao.plate.image).toBeNull();
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
  // Sonho ampliado — a parallel renders only once it has something to read.
  // -------------------------------------------------------------------------

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

  it("keeps a parallel that is only a painting, with no line and no label yet", () => {
    // The likelier order of work: she uploads the detail she found, then types
    // the credit. The image alone is already the parallel.
    const page = analiseFromPayload({
      sonhoAmpliado: {
        parallels: [{ label: "Uma pintura", image: upload("/media/porta.jpg", "uma porta") }],
      },
    });

    expect(page.sonhoAmpliado.parallels).toHaveLength(1);
    expect(page.sonhoAmpliado.parallels[0]?.plate.image?.src).toBe("/media/porta.jpg");
    expect(page.sonhoAmpliado.parallels[0]?.plate.painter).toBeNull();
    expect(page.sonhoAmpliado.parallels[0]?.text).toBeNull();
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

  it("lets a cleared motif hide the section, and keeps a written one", () => {
    // The one field with no code fallback: her switch for the whole section.
    expect(analiseFromPayload({ sonhoAmpliado: { motif: "   " } }).sonhoAmpliado.motif).toBeNull();
    expect(analiseFromPayload({ sonhoAmpliado: {} }).sonhoAmpliado.motif).toBeNull();

    expect(
      analiseFromPayload({ sonhoAmpliado: { motif: "Sonhei com o mar." } }).sonhoAmpliado.motif,
    ).toBe("Sonhei com o mar.");

    // But the code default is still a real motif, so a page rendered with Payload
    // off shows the section rather than losing it.
    expect(ANALISE_DEFAULTS.sonhoAmpliado.motif).not.toBeNull();
  });

  it("leaves the closing line absent until she writes it", () => {
    expect(analiseFromPayload({}).sonhoAmpliado.closingLine).toBeNull();
    expect(
      analiseFromPayload({ sonhoAmpliado: { closingLine: "O cômodo era sempre dela." } })
        .sonhoAmpliado.closingLine,
    ).toBe("O cômodo era sempre dela.");
  });
});
