import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-inicio` global exactly as Payload returns it. Named tabs flatten
// to nested objects and every field is optional, so the domain mapper can fall
// back section by section.
//
// Read at `depth: 1`, unlike `getClinicaGlobal`: this page has upload slots (the
// portrait, A Lâmina's plate) and depth 0 would return bare row ids with no URL
// or intrinsic size to render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

export type PayloadPageInicio = {
  hero?: {
    lead?: RichTextContent | null;
    ctaPrimaryLabel?: string | null;
    ctaSecondaryLabel?: string | null;
    portrait?: PayloadMediaField;
  } | null;
  instagram?: {
    heading?: string | null;
    intro?: string | null;
  } | null;
  doisCaminhos?: {
    heading?: string | null;
    intro?: string | null;
    analysis?: { title?: string | null; body?: string | null; linkLabel?: string | null } | null;
    careerGuidance?: {
      title?: string | null;
      body?: string | null;
      linkLabel?: string | null;
    } | null;
    boundary?: string | null;
  } | null;
  oSintoma?: {
    heading?: string | null;
    body?: RichTextContent | null;
    linkLabel?: string | null;
  } | null;
  cosmos?: {
    caption?: string | null;
  } | null;
  sobreDigest?: {
    heading?: string | null;
    body?: RichTextContent | null;
    linkLabel?: string | null;
  } | null;
  brasilExterior?: {
    heading?: string | null;
    body?: string | null;
    linkLabel?: string | null;
  } | null;
  comoComecar?: {
    heading?: string | null;
    beats?: PayloadArrayRow<{ numeral?: string | null; text?: string | null }>;
    linkLabel?: string | null;
  } | null;
  vozes?: { heading?: string | null } | null;
  contato?: {
    eyebrow?: string | null;
    heading?: string | null;
    body?: RichTextContent | null;
    whatsappLabel?: string | null;
  } | null;
};

/** The `page-inicio` global, or null when Payload is disabled. */
export const getPageInicioGlobal = cache(async function getPageInicioGlobal(
  locale: Locale,
): Promise<PayloadPageInicio | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-inicio",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPageInicio;
});
