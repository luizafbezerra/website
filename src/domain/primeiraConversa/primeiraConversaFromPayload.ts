import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { PayloadPagePrimeiraConversa } from "@/infrastructure/payload/getPagePrimeiraConversaGlobal";
import {
  type MiniFaqEntry,
  PRIMEIRA_CONVERSA_DEFAULTS,
  type PrimeiraConversa,
  type Step,
} from "./PrimeiraConversa";

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
// "she cleared this" and "she never opened this tab" are the same value (the
// finding recorded in TASK-035's notes). All four arrays here belong to sections
// CONCEPT §6 requires — the tempos, the three permissions, the practical facts,
// the threshold doubts — so of the two readings only one is safe: an empty array
// is treated as un-edited. Início's Instagram tiles take the opposite rule
// because that section has a designed empty state; none of these do.
//
// Within a populated array, a row with no text is still dropped: a half-typed row
// has nothing a visitor could read.
// ---------------------------------------------------------------------------

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V"];

function stepsFrom(raw: NonNullable<PayloadPagePrimeiraConversa["passoAPasso"]>["steps"]): Step[] {
  if (!Array.isArray(raw)) return PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.steps;

  const steps = raw
    .map((step, index) => ({
      // A missing numeral is scaffolding she should not have to type.
      numeral: filled(step?.numeral) ?? ROMAN_NUMERALS[index] ?? String(index + 1),
      title: filled(step?.title),
      text: filled(step?.text),
    }))
    .filter((step): step is Step => step.title !== null && step.text !== null);

  return steps.length > 0 ? steps : PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.steps;
}

function permissionsFrom(
  raw: NonNullable<NonNullable<PayloadPagePrimeiraConversa["passoAPasso"]>["permissoes"]>["items"],
): string[] {
  if (!Array.isArray(raw)) return PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.permissoes.items;

  const items = raw
    .map((item) => filled(item?.text))
    .filter((text): text is string => text !== null);

  return items.length > 0 ? items : PRIMEIRA_CONVERSA_DEFAULTS.passoAPasso.permissoes.items;
}

function logisticsFrom(
  raw: NonNullable<PayloadPagePrimeiraConversa["logistica"]>["items"],
): FactRow[] {
  if (!Array.isArray(raw)) return PRIMEIRA_CONVERSA_DEFAULTS.logistica.items;

  const rows = raw
    .map((row) => ({ label: filled(row?.label), value: filled(row?.value) }))
    .filter((row): row is FactRow => row.label !== null && row.value !== null);

  return rows.length > 0 ? rows : PRIMEIRA_CONVERSA_DEFAULTS.logistica.items;
}

function doubtsFrom(
  raw: NonNullable<PayloadPagePrimeiraConversa["logistica"]>["doubts"],
): MiniFaqEntry[] {
  if (!Array.isArray(raw)) return PRIMEIRA_CONVERSA_DEFAULTS.logistica.doubts;

  const entries = raw
    .map((entry) => ({ question: filled(entry?.question), answer: filled(entry?.answer) }))
    .filter((entry): entry is MiniFaqEntry => entry.question !== null && entry.answer !== null);

  return entries.length > 0 ? entries : PRIMEIRA_CONVERSA_DEFAULTS.logistica.doubts;
}

/** Normalize the raw `page-primeira-conversa` global, falling back field by field. */
export function primeiraConversaFromPayload(doc: PayloadPagePrimeiraConversa): PrimeiraConversa {
  const defaults = PRIMEIRA_CONVERSA_DEFAULTS;

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      lead: filledRichText(doc.abertura?.lead) ?? defaults.abertura.lead,
    },
    passoAPasso: {
      heading: filled(doc.passoAPasso?.heading) ?? defaults.passoAPasso.heading,
      steps: stepsFrom(doc.passoAPasso?.steps),
      permissoes: {
        items: permissionsFrom(doc.passoAPasso?.permissoes?.items),
        plate: pagePlateFrom(doc.passoAPasso?.permissoes?.plate),
      },
    },
    logistica: {
      heading: filled(doc.logistica?.heading) ?? defaults.logistica.heading,
      items: logisticsFrom(doc.logistica?.items),
      doubts: doubtsFrom(doc.logistica?.doubts),
      linkLabel: filled(doc.logistica?.linkLabel) ?? defaults.logistica.linkLabel,
    },
    bilhete: {
      heading: filled(doc.bilhete?.heading) ?? defaults.bilhete.heading,
      intro: filledRichText(doc.bilhete?.intro) ?? defaults.bilhete.intro,
      chooseLabel: filled(doc.bilhete?.chooseLabel) ?? defaults.bilhete.chooseLabel,
    },
  };
}
