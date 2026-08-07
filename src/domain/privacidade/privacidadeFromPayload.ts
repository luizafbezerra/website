import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import type { PayloadPagePrivacidade } from "@/infrastructure/payload/getPagePrivacidadeGlobal";
import { PRIVACIDADE_DEFAULTS, type Privacidade, type PrivacyItem } from "./Privacidade";

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
// finding recorded in TASK-035's notes). Of the two readings only one is safe
// here, and on this page the reason is stronger than layout: a privacy page that
// renders an empty "o que o site guarda" because the rows were cleared does not
// merely look unfinished — it tells the reader the site keeps nothing, which is
// false. So an empty array is read as un-edited and the written list stands.
//
// Within a populated array a row missing either half is dropped: both fields are
// `required` in the admin, so the only way to reach here half-typed is an API
// write, and a `<dt>` with no `<dd>` is neither valid nor readable.
// ---------------------------------------------------------------------------

/** Both lists store the same row shape, so one normalization serves both. */
function itemsFrom(
  raw: NonNullable<PayloadPagePrivacidade["guarda"]>["items"],
  fallback: PrivacyItem[],
): PrivacyItem[] {
  if (!Array.isArray(raw)) return fallback;

  const items = raw
    .map((row) => ({ title: filled(row?.title), text: filled(row?.text) }))
    .filter((row): row is PrivacyItem => row.title !== null && row.text !== null);

  return items.length > 0 ? items : fallback;
}

/**
 * Normalize the raw `page-privacidade` global, falling back field by field to the
 * defaults **of the locale being read** — the one page on the site where an
 * English reader must never be handed Portuguese (see `Privacidade.ts`).
 */
export function privacidadeFromPayload(doc: PayloadPagePrivacidade, locale: Locale): Privacidade {
  const defaults = PRIVACIDADE_DEFAULTS[locale];

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      body: filledRichText(doc.abertura?.body) ?? defaults.abertura.body,
    },
    guarda: {
      heading: filled(doc.guarda?.heading) ?? defaults.guarda.heading,
      items: itemsFrom(doc.guarda?.items, defaults.guarda.items),
    },
    nuncaFaz: {
      heading: filled(doc.nuncaFaz?.heading) ?? defaults.nuncaFaz.heading,
      items: itemsFrom(doc.nuncaFaz?.items, defaults.nuncaFaz.items),
    },
    bilheteNota: {
      heading: filled(doc.bilheteNota?.heading) ?? defaults.bilheteNota.heading,
      body: filled(doc.bilheteNota?.body) ?? defaults.bilheteNota.body,
      linkLabel: filled(doc.bilheteNota?.linkLabel) ?? defaults.bilheteNota.linkLabel,
    },
    responsavel: {
      heading: filled(doc.responsavel?.heading) ?? defaults.responsavel.heading,
      body: filledRichText(doc.responsavel?.body) ?? defaults.responsavel.body,
      rights: filled(doc.responsavel?.rights) ?? defaults.responsavel.rights,
      confidentiality:
        filled(doc.responsavel?.confidentiality) ?? defaults.responsavel.confidentiality,
    },
  };
}
