import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-internacional` global exactly as Payload returns it. Named tabs
// flatten to nested objects and every field is optional, so the domain mapper can
// fall back section by section.
//
// Read at `depth: 1` for the plate's upload — depth 0 returns a bare row id with
// no URL or intrinsic size to render.
//
// The `inEnglish` fields are not localized, so they arrive identical in both
// locales; which locale actually renders that section is a domain rule
// (`inEnglishSectionFor`), not something this read can express.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

export type PayloadPageInternacional = {
  abertura?: {
    heading?: string | null;
    body?: RichTextContent | null;
    trustLine?: string | null;
  } | null;
  brasileirosFora?: {
    heading?: string | null;
    body?: RichTextContent | null;
    plate?: {
      image?: PayloadMediaField;
      painter?: string | null;
      workTitle?: string | null;
      year?: string | null;
    } | null;
  } | null;
  inEnglish?: {
    heading?: string | null;
    body?: string | null;
    linkLabel?: string | null;
  } | null;
  pratico?: {
    heading?: string | null;
    items?: PayloadArrayRow<{ label?: string | null; value?: string | null }>;
  } | null;
  comecar?: {
    heading?: string | null;
    body?: string | null;
    linkLabel?: string | null;
  } | null;
};

/** The `page-internacional` global, or null when Payload is disabled. */
export const getPageInternacionalGlobal = cache(async function getPageInternacionalGlobal(
  locale: Locale,
): Promise<PayloadPageInternacional | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-internacional",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPageInternacional;
});
