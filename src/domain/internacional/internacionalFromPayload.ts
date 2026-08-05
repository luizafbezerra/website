import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { PayloadPageInternacional } from "@/infrastructure/payload/getPageInternacionalGlobal";
import { type CityNote, INTERNACIONAL_DEFAULTS, type Internacional } from "./Internacional";

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
// Both arrays on this page fall back to the defaults when they arrive empty.
//
// Payload materializes an untouched array field as `[]` rather than as absent, so
// "she cleared this" and "she never opened this tab" are the same value (the
// finding recorded in TASK-035's notes). Neither array here has a designed empty
// state and both belong to sections CONCEPT §6 requires — the city examples are
// named in the map itself ("with city examples (Lisboa, Londres, Nova York)"), and
// the prático rows are the page's whole answer about fuso, payment and language —
// so of the two readings only one is safe: an empty array is treated as un-edited.
//
// The cost is that emptying the cities in the admin restores them, which is the
// lesser failure: a fresh database or a failed seed would otherwise leave the
// page's craft moment silently absent, and CONCEPT does not offer this page a
// version without city examples.
//
// Within a populated array, a row with no readable text is still dropped: a
// half-typed row has nothing a visitor could read.
// ---------------------------------------------------------------------------

function citiesFrom(
  raw: NonNullable<PayloadPageInternacional["brasileirosFora"]>["cities"],
): CityNote[] {
  if (!Array.isArray(raw)) return INTERNACIONAL_DEFAULTS.brasileirosFora.cities;

  const cities = raw
    .map((row) => ({ city: filled(row?.city), note: filled(row?.note) }))
    .filter((row): row is CityNote => row.city !== null && row.note !== null);

  return cities.length > 0 ? cities : INTERNACIONAL_DEFAULTS.brasileirosFora.cities;
}

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
      cities: citiesFrom(doc.brasileirosFora?.cities),
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
