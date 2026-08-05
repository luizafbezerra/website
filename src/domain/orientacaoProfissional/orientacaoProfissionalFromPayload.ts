import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { PayloadPageOrientacaoProfissional } from "@/infrastructure/payload/getPageOrientacaoProfissionalGlobal";
import {
  type CareerCase,
  type Distinction,
  ORIENTACAO_PROFISSIONAL_DEFAULTS,
  type OrientacaoProfissional,
  type PercursoStep,
} from "./OrientacaoProfissional";

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
// Every array on this page falls back to the defaults when it arrives empty.
//
// Payload materializes an untouched array field as `[]` rather than as absent, so
// "she cleared this" and "she never opened this tab" are the same value (TASK-035's
// finding). All three arrays here belong to sections CONCEPT §6 requires — the four
// situations, the movements of the percurso, the distinctions that decide the page
// — and none of them has a designed empty state, so of the two readings only one is
// safe: an empty array is treated as un-edited.
//
// The two *scalar* slots that may legitimately be absent are handled the other way
// round, and deliberately: `nemCoaching.anchor` is one Jungian sentence and
// `oPercurso.deliverable` is the promise, both of which have code drafts, so they
// fall back like any other field — but both are typed `string | null` because a
// draft could be removed from the defaults without the view breaking. The plate is
// the only genuinely absent-able thing on the page, and provenance is never
// invented (CONCEPT §11), which is why `pagePlateFrom` gives it no default.
//
// Within a populated array, a row with no readable text is still dropped: a
// half-typed row has nothing a visitor could read.
// ---------------------------------------------------------------------------

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

function casesFrom(
  raw: NonNullable<PayloadPageOrientacaoProfissional["paraQuem"]>["cases"],
): CareerCase[] {
  if (!Array.isArray(raw)) return ORIENTACAO_PROFISSIONAL_DEFAULTS.paraQuem.cases;

  const cases = raw
    .map((entry) => ({ title: filled(entry?.title), text: filled(entry?.text) }))
    .filter((entry): entry is CareerCase => entry.title !== null && entry.text !== null);

  return cases.length > 0 ? cases : ORIENTACAO_PROFISSIONAL_DEFAULTS.paraQuem.cases;
}

function stepsFrom(
  raw: NonNullable<PayloadPageOrientacaoProfissional["oPercurso"]>["steps"],
): PercursoStep[] {
  if (!Array.isArray(raw)) return ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.steps;

  const steps = raw
    .map((step, index) => ({
      // A missing numeral is scaffolding she should not have to type: the section
      // is ordered by construction, so the position is the numeral.
      numeral: filled(step?.numeral) ?? ROMAN_NUMERALS[index] ?? String(index + 1),
      title: filled(step?.title),
      text: filled(step?.text),
    }))
    .filter((step): step is PercursoStep => step.title !== null && step.text !== null);

  return steps.length > 0 ? steps : ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.steps;
}

function distinctionsFrom(
  raw: NonNullable<PayloadPageOrientacaoProfissional["nemCoaching"]>["distinctions"],
): Distinction[] {
  if (!Array.isArray(raw)) return ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.distinctions;

  const distinctions = raw
    .map((entry) => ({ title: filled(entry?.title), text: filled(entry?.text) }))
    .filter((entry): entry is Distinction => entry.title !== null && entry.text !== null);

  return distinctions.length > 0
    ? distinctions
    : ORIENTACAO_PROFISSIONAL_DEFAULTS.nemCoaching.distinctions;
}

function praticoFrom(
  raw: NonNullable<PayloadPageOrientacaoProfissional["pratico"]>["items"],
): FactRow[] {
  if (!Array.isArray(raw)) return ORIENTACAO_PROFISSIONAL_DEFAULTS.pratico.items;

  const rows = raw
    .map((row) => ({ label: filled(row?.label), value: filled(row?.value) }))
    .filter((row): row is FactRow => row.label !== null && row.value !== null);

  return rows.length > 0 ? rows : ORIENTACAO_PROFISSIONAL_DEFAULTS.pratico.items;
}

/** Normalize the raw `page-orientacao-profissional` global, falling back field by field. */
export function orientacaoProfissionalFromPayload(
  doc: PayloadPageOrientacaoProfissional,
): OrientacaoProfissional {
  const defaults = ORIENTACAO_PROFISSIONAL_DEFAULTS;

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      body: filledRichText(doc.abertura?.body) ?? defaults.abertura.body,
    },
    paraQuem: {
      heading: filled(doc.paraQuem?.heading) ?? defaults.paraQuem.heading,
      cases: casesFrom(doc.paraQuem?.cases),
    },
    oPercurso: {
      heading: filled(doc.oPercurso?.heading) ?? defaults.oPercurso.heading,
      body: filledRichText(doc.oPercurso?.body) ?? defaults.oPercurso.body,
      steps: stepsFrom(doc.oPercurso?.steps),
      deliverable: filled(doc.oPercurso?.deliverable) ?? defaults.oPercurso.deliverable,
    },
    nemCoaching: {
      heading: filled(doc.nemCoaching?.heading) ?? defaults.nemCoaching.heading,
      body: filledRichText(doc.nemCoaching?.body) ?? defaults.nemCoaching.body,
      distinctions: distinctionsFrom(doc.nemCoaching?.distinctions),
      anchor: filled(doc.nemCoaching?.anchor) ?? defaults.nemCoaching.anchor,
      plate: pagePlateFrom(doc.nemCoaching?.plate),
    },
    perguntaMaisFunda: {
      heading: filled(doc.perguntaMaisFunda?.heading) ?? defaults.perguntaMaisFunda.heading,
      body: filled(doc.perguntaMaisFunda?.body) ?? defaults.perguntaMaisFunda.body,
      linkLabel: filled(doc.perguntaMaisFunda?.linkLabel) ?? defaults.perguntaMaisFunda.linkLabel,
    },
    pratico: {
      heading: filled(doc.pratico?.heading) ?? defaults.pratico.heading,
      items: praticoFrom(doc.pratico?.items),
    },
    comecar: {
      heading: filled(doc.comecar?.heading) ?? defaults.comecar.heading,
      body: filled(doc.comecar?.body) ?? defaults.comecar.body,
      linkLabel: filled(doc.comecar?.linkLabel) ?? defaults.comecar.linkLabel,
    },
  };
}
