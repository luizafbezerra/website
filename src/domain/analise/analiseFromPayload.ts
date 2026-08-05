import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { ZODIAC_SIGN_IDS, type ZodiacSignId } from "@/domain/zodiac/zodiacContent";
import type { PayloadPageAnalise } from "@/infrastructure/payload/getPageAnaliseGlobal";
import {
  ANALISE_DEFAULTS,
  type Analise,
  type DreamParallel,
  type MethodTool,
  type Pillar,
  type SignReading,
} from "./Analise";

/** Blank strings are absences, not values — a cleared field must fall back. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/**
 * A rich-text field is empty when Lexical has no paragraphs, which is what an
 * editor who selected everything and deleted leaves behind — not `null`.
 */
function filledRichText(value: RichTextContent | null | undefined): RichTextContent | null {
  if (!value) return null;
  const children = value.root?.children;
  return Array.isArray(children) && children.length > 0 ? value : null;
}

// ---------------------------------------------------------------------------
// The empty-array rule, decided per array (the finding recorded in TASK-035's
// notes: Payload materializes an untouched array field as `[]`, so "she cleared
// this section" and "she never opened this tab" arrive as the same value).
//
//   · `oMetodo.tools` and `oQueTrazem.pillars` fall back to the defaults. Both
//     belong to sections CONCEPT §6 requires by name — the symbolic tools and the
//     three pillars *are* those sections — and neither has a designed empty
//     state, so of the two readings only "un-edited" is safe. The pillars matter
//     most: they are her own words, and an empty array must never delete them.
//   · `pratico.items` likewise: a prático section with no facts but a price is a
//     page that stopped answering the question a comparing reader came with.
//   · `sonhoAmpliado.parallels` is the one array that reads `[]` literally.
//     That section has a designed partial state by construction — a parallel
//     renders only once she has curated it (CONCEPT §9.3), so all three being
//     absent is the *launch* state, not a fault. Falling back would print three
//     labels with nothing to read.
//
// Within a populated array, a row with no readable text is still dropped: a
// half-typed row has nothing a visitor could read.
// ---------------------------------------------------------------------------

const ROMAN_NUMERALS = ["I", "II", "III"];

function toolsFrom(raw: NonNullable<PayloadPageAnalise["oMetodo"]>["tools"]): MethodTool[] {
  if (!Array.isArray(raw)) return ANALISE_DEFAULTS.oMetodo.tools;

  const tools = raw
    .map((tool) => ({ title: filled(tool?.title), text: filled(tool?.text) }))
    .filter((tool): tool is MethodTool => tool.title !== null && tool.text !== null);

  return tools.length > 0 ? tools : ANALISE_DEFAULTS.oMetodo.tools;
}

function pillarsFrom(raw: NonNullable<PayloadPageAnalise["oQueTrazem"]>["pillars"]): Pillar[] {
  if (!Array.isArray(raw)) return ANALISE_DEFAULTS.oQueTrazem.pillars;

  const pillars = raw
    .map((pillar, index) => ({
      // A missing numeral is scaffolding she should not have to type.
      numeral: filled(pillar?.numeral) ?? ROMAN_NUMERALS[index] ?? String(index + 1),
      title: filled(pillar?.title),
      text: filled(pillar?.text),
    }))
    .filter((pillar): pillar is Pillar => pillar.title !== null && pillar.text !== null);

  return pillars.length > 0 ? pillars : ANALISE_DEFAULTS.oQueTrazem.pillars;
}

function praticoItemsFrom(raw: NonNullable<PayloadPageAnalise["pratico"]>["items"]): FactRow[] {
  if (!Array.isArray(raw)) return ANALISE_DEFAULTS.pratico.items;

  const rows = raw
    .map((row) => ({ label: filled(row?.label), value: filled(row?.value) }))
    .filter((row): row is FactRow => row.label !== null && row.value !== null);

  return rows.length > 0 ? rows : ANALISE_DEFAULTS.pratico.items;
}

/**
 * The three parallels of Sonho ampliado. No fallback: an empty array is the
 * launch state, and a parallel with only a label has nothing a visitor could
 * read — its content is her curation (CONCEPT §9.3), so it waits.
 *
 * What counts as content: her line, a painting, or a recorded provenance. The
 * last one is REQ-005's case reaching this section — she can name the work while
 * the scan is still being sourced, and the frame stands in for the image alone. A
 * parallel with a label and nothing else does not render.
 */
function parallelsFrom(
  raw: NonNullable<PayloadPageAnalise["sonhoAmpliado"]>["parallels"],
): DreamParallel[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((parallel) => ({
      label: filled(parallel?.label),
      text: filled(parallel?.text),
      plate: pagePlateFrom(parallel),
    }))
    .filter(
      (parallel): parallel is DreamParallel =>
        parallel.label !== null &&
        (parallel.text !== null ||
          parallel.plate.image !== null ||
          parallel.plate.painter !== null),
    );
}

/**
 * Her twelve readings. Every sign is present in the result so the wheel can look
 * any of them up, and every unwritten half is `null` — REQ-007's gate is this
 * mapping, not a component's conditional.
 */
function readingsFrom(raw: PayloadPageAnalise["mandala"]): Record<ZodiacSignId, SignReading> {
  return Object.fromEntries(
    ZODIAC_SIGN_IDS.map((id) => {
      const stored = raw?.[id];
      return [id, { reading: filled(stored?.reading), vedicReading: filled(stored?.vedicReading) }];
    }),
  ) as Record<ZodiacSignId, SignReading>;
}

/** Normalize the raw `page-analise` global, falling back field by field. */
export function analiseFromPayload(doc: PayloadPageAnalise): Analise {
  const defaults = ANALISE_DEFAULTS;

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      body: filledRichText(doc.abertura?.body) ?? defaults.abertura.body,
    },
    aVisao: {
      heading: filled(doc.aVisao?.heading) ?? defaults.aVisao.heading,
      body: filledRichText(doc.aVisao?.body) ?? defaults.aVisao.body,
      plate: pagePlateFrom(doc.aVisao?.plate),
    },
    oMetodo: {
      heading: filled(doc.oMetodo?.heading) ?? defaults.oMetodo.heading,
      body: filledRichText(doc.oMetodo?.body) ?? defaults.oMetodo.body,
      tools: toolsFrom(doc.oMetodo?.tools),
      closingLine: filled(doc.oMetodo?.closingLine) ?? defaults.oMetodo.closingLine,
    },
    mandala: {
      heading: filled(doc.mandala?.heading) ?? defaults.mandala.heading,
      intro: filled(doc.mandala?.intro) ?? defaults.mandala.intro,
      readings: readingsFrom(doc.mandala),
    },
    oQueTrazem: {
      heading: filled(doc.oQueTrazem?.heading) ?? defaults.oQueTrazem.heading,
      intro: filledRichText(doc.oQueTrazem?.intro) ?? defaults.oQueTrazem.intro,
      note: filled(doc.oQueTrazem?.note) ?? defaults.oQueTrazem.note,
      pillars: pillarsFrom(doc.oQueTrazem?.pillars),
      boundary: filled(doc.oQueTrazem?.boundary) ?? defaults.oQueTrazem.boundary,
      linkLabel: filled(doc.oQueTrazem?.linkLabel) ?? defaults.oQueTrazem.linkLabel,
    },
    sonhoAmpliado: {
      heading: filled(doc.sonhoAmpliado?.heading) ?? defaults.sonhoAmpliado.heading,
      intro: filled(doc.sonhoAmpliado?.intro) ?? defaults.sonhoAmpliado.intro,
      // The one field on the page that does NOT fall back, and the only place
      // where this mapper and `ANALISE_DEFAULTS` deliberately disagree.
      //
      // The motif is the section's own switch: clearing it removes Sonho ampliado
      // from the site, which is her escape hatch if she would rather not
      // demonstrate the method at all (the drafted motif is a quoted dream, not
      // her clinical prose, but it is still not a line she wrote). Falling back
      // would make that switch unreachable without a deploy. The default is still
      // real — it is what the seed writes and what renders when Payload is off —
      // so the only state that reaches `null` here is a document whose motif she
      // emptied on purpose. Início's Instagram tiles take the same shape of
      // decision for the same reason: a designed empty state must be reachable.
      motif: filled(doc.sonhoAmpliado?.motif),
      parallels: parallelsFrom(doc.sonhoAmpliado?.parallels),
      closingLine: filled(doc.sonhoAmpliado?.closingLine),
    },
    pratico: {
      heading: filled(doc.pratico?.heading) ?? defaults.pratico.heading,
      items: praticoItemsFrom(doc.pratico?.items),
    },
    paraComecar: {
      heading: filled(doc.paraComecar?.heading) ?? defaults.paraComecar.heading,
      body: filled(doc.paraComecar?.body) ?? defaults.paraComecar.body,
      linkLabel: filled(doc.paraComecar?.linkLabel) ?? defaults.paraComecar.linkLabel,
    },
  };
}
