import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-primeira-conversa` global exactly as Payload returns it. Named
// tabs flatten to nested objects and every field is optional, so the domain mapper
// can fall back section by section.
//
// Read at `depth: 1` for the plate's upload — depth 0 returns a bare row id with
// no URL or intrinsic size to render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

export type PayloadPagePrimeiraConversa = {
  abertura?: {
    heading?: string | null;
    lead?: RichTextContent | null;
  } | null;
  passoAPasso?: {
    heading?: string | null;
    steps?: PayloadArrayRow<{
      numeral?: string | null;
      title?: string | null;
      text?: string | null;
    }>;
    permissoes?: {
      items?: PayloadArrayRow<{ text?: string | null }>;
      plate?: {
        image?: PayloadMediaField;
        painter?: string | null;
        workTitle?: string | null;
        year?: string | null;
      } | null;
    } | null;
  } | null;
  logistica?: {
    heading?: string | null;
    items?: PayloadArrayRow<{ label?: string | null; value?: string | null }>;
    doubts?: PayloadArrayRow<{ question?: string | null; answer?: string | null }>;
    linkLabel?: string | null;
  } | null;
  bilhete?: {
    heading?: string | null;
    intro?: RichTextContent | null;
    chooseLabel?: string | null;
  } | null;
};

/** The `page-primeira-conversa` global, or null when Payload is disabled. */
export const getPagePrimeiraConversaGlobal = cache(async function getPagePrimeiraConversaGlobal(
  locale: Locale,
): Promise<PayloadPagePrimeiraConversa | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-primeira-conversa",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPagePrimeiraConversa;
});
