import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";

// ---------------------------------------------------------------------------
// The raw `page-privacidade` global exactly as Payload returns it. Named tabs
// flatten to nested objects and every field is optional, so the domain mapper can
// fall back section by section.
//
// Read at `depth: 0`: this page holds no upload and no relationship, so there is
// nothing for a deeper read to resolve. It is the one page global that carries no
// plate (the exemption is argued in plan/feature-page-privacidade-1.md).
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

type PayloadPrivacyItems = PayloadArrayRow<{
  title?: string | null;
  text?: string | null;
}>;

export type PayloadPagePrivacidade = {
  abertura?: {
    heading?: string | null;
    body?: RichTextContent | null;
  } | null;
  guarda?: {
    heading?: string | null;
    items?: PayloadPrivacyItems;
  } | null;
  nuncaFaz?: {
    heading?: string | null;
    items?: PayloadPrivacyItems;
  } | null;
  bilheteNota?: {
    heading?: string | null;
    body?: string | null;
    linkLabel?: string | null;
  } | null;
  responsavel?: {
    heading?: string | null;
    body?: RichTextContent | null;
    rights?: string | null;
    confidentiality?: string | null;
  } | null;
};

/** The `page-privacidade` global, or null when Payload is disabled. */
export const getPagePrivacidadeGlobal = cache(async function getPagePrivacidadeGlobal(
  locale: Locale,
): Promise<PayloadPagePrivacidade | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-privacidade",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadPagePrivacidade;
});
