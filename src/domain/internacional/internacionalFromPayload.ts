import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { PayloadPageInternacional } from "@/infrastructure/payload/getPageInternacionalGlobal";
import { INTERNACIONAL_DEFAULTS, type Internacional } from "./Internacional";

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
// The one array on this page falls back to the defaults when it arrives empty.
//
// Payload materializes an untouched array field as `[]` rather than as absent, so
// "she cleared this" and "she never opened this tab" are the same value (the
// finding recorded in TASK-035's notes). The prático rows have no designed empty
// state — they are the page's whole answer about fuso, payment and language — so
// of the two readings only one is safe: an empty array is treated as un-edited.
//
// Within a populated array, a row with no readable text is still dropped: a
// half-typed row has nothing a visitor could read.
//
// The `cities` array that used to sit beside this one is gone (2026-08-10): the
// time difference is computed live by `HorasDaClinica` from `domain/clinica/reach`
// rather than written down, which is how the list grew from three countries to
// five without growing a paragraph.
// ---------------------------------------------------------------------------

function praticoFrom(raw: NonNullable<PayloadPageInternacional["pratico"]>["items"]): FactRow[] {
  if (!Array.isArray(raw)) return INTERNACIONAL_DEFAULTS.pratico.items;

  const rows = raw
    .map((row) => ({ label: filled(row?.label), value: filled(row?.value) }))
    .filter((row): row is FactRow => row.label !== null && row.value !== null);

  return rows.length > 0 ? rows : INTERNACIONAL_DEFAULTS.pratico.items;
}

/** Normalize the raw `page-internacional` global, falling back field by field. */
export function internacionalFromPayload(doc: PayloadPageInternacional): Internacional {
  const defaults = INTERNACIONAL_DEFAULTS;

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      body: filledRichText(doc.abertura?.body) ?? defaults.abertura.body,
      trustLine: filled(doc.abertura?.trustLine) ?? defaults.abertura.trustLine,
    },
    brasileirosFora: {
      heading: filled(doc.brasileirosFora?.heading) ?? defaults.brasileirosFora.heading,
      body: filledRichText(doc.brasileirosFora?.body) ?? defaults.brasileirosFora.body,
      plate: pagePlateFrom(doc.brasileirosFora?.plate),
    },
    // Not localized in the CMS, so the same English prose arrives in both locales;
    // `inEnglishSectionFor` is what keeps it off the English mirror.
    inEnglish: {
      heading: filled(doc.inEnglish?.heading) ?? defaults.inEnglish.heading,
      body: filled(doc.inEnglish?.body) ?? defaults.inEnglish.body,
      linkLabel: filled(doc.inEnglish?.linkLabel) ?? defaults.inEnglish.linkLabel,
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
