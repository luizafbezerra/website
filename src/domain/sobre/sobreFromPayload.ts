import { pageImageFrom } from "@/domain/media/pageImageFrom";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { PayloadPageSobre } from "@/infrastructure/payload/getPageSobreGlobal";
import { type FormacaoItem, SOBRE_DEFAULTS, type Sobre } from "./Sobre";

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
// The formação array falls back to the defaults when it arrives empty.
//
// Payload materializes an untouched array field as `[]` rather than as absent, so
// "she cleared this" and "she never opened this tab" are the same value (the
// finding recorded in TASK-035's notes). This array belongs to the section
// CONCEPT §6 makes this page's load-bearing one — the sceptical reader's whole
// reason to be here is to check the record — and it has no designed empty state,
// so of the two readings only one is safe: an empty array is treated as un-edited.
// Início's Instagram tiles take the opposite rule because that section *does* have
// a designed empty state.
//
// Within a populated array, a row is kept as soon as it has a course title and
// dropped otherwise. `title` is the one field that names a line of the record;
// an institution alone ("PUC-SP") states nothing a reader can verify, while a
// course with no institution yet still reads as a course.
// ---------------------------------------------------------------------------

function formacaoFrom(raw: NonNullable<PayloadPageSobre["formacao"]>["items"]): FormacaoItem[] {
  if (!Array.isArray(raw)) return SOBRE_DEFAULTS.formacao.items;

  const items = raw
    .map((item) => ({
      title: filled(item?.title),
      institution: filled(item?.institution),
      period: filled(item?.period),
    }))
    .filter((item): item is FormacaoItem => item.title !== null);

  return items.length > 0 ? items : SOBRE_DEFAULTS.formacao.items;
}

/** Normalize the raw `page-sobre` global, falling back field by field. */
export function sobreFromPayload(doc: PayloadPageSobre): Sobre {
  const defaults = SOBRE_DEFAULTS;

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      lead: filledRichText(doc.abertura?.lead) ?? defaults.abertura.lead,
    },
    quemE: {
      heading: filled(doc.quemE?.heading) ?? defaults.quemE.heading,
      body: filledRichText(doc.quemE?.body) ?? defaults.quemE.body,
      // No default: the portrait has none to fall back to, and `null` is exactly
      // what the labeled frame knows how to render (REQ-005).
      portrait: pageImageFrom(doc.quemE?.portrait),
    },
    formacao: {
      heading: filled(doc.formacao?.heading) ?? defaults.formacao.heading,
      items: formacaoFrom(doc.formacao?.items),
    },
    aClinica: {
      heading: filled(doc.aClinica?.heading) ?? defaults.aClinica.heading,
      body: filledRichText(doc.aClinica?.body) ?? defaults.aClinica.body,
      linkLabel: filled(doc.aClinica?.linkLabel) ?? defaults.aClinica.linkLabel,
    },
    assinatura: {
      // Same rule as the portrait: a signature is a scanned asset or it is a
      // labeled frame. Typeset script would be the banned stand-in (DESIGN §6).
      image: pageImageFrom(doc.assinatura?.image),
      closingLine: filled(doc.assinatura?.closingLine) ?? defaults.assinatura.closingLine,
    },
  };
}
