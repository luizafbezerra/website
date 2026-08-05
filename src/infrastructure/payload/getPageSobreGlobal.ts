import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-sobre` global exactly as Payload returns it. Named tabs flatten
// to nested objects and every field is optional, so the domain mapper can fall
// back section by section.
//
// Read at `depth: 1` for the two uploads this page carries — the portrait and the
// scanned signature. At depth 0 both come back as bare row ids with no URL and no
// intrinsic size, which is nothing a page can render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

export type PayloadPageSobre = {
  abertura?: {
    heading?: string | null;
    lead?: RichTextContent | null;
  } | null;
  quemE?: {
    heading?: string | null;
    body?: RichTextContent | null;
    portrait?: PayloadMediaField;
  } | null;
  formacao?: {
    heading?: string | null;
    items?: PayloadArrayRow<{
      title?: string | null;
      institution?: string | null;
      period?: string | null;
    }>;
  } | null;
  aClinica?: {
    heading?: string | null;
    body?: RichTextContent | null;
    linkLabel?: string | null;
  } | null;
  assinatura?: {
    image?: PayloadMediaField;
    closingLine?: string | null;
  } | null;
};

/** The `page-sobre` global, or null when Payload is disabled. */
export const getPageSobreGlobal = cache(async function getPageSobreGlobal(
  locale: Locale,
): Promise<PayloadPageSobre | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-sobre",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPageSobre;
});
