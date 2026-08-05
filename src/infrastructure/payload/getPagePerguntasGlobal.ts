import "server-only";
import { cache } from "react";
import type { FaqCategory } from "@/domain/faq/FaqCategory";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-perguntas` global exactly as Payload returns it. Named tabs
// flatten to nested objects and every field is optional, so the domain mapper can
// fall back section by section.
//
// The questions are NOT here — they are rows of the `faq` collection, read by
// `findFaqEntries`. This global holds only what wraps them: the opening, the four
// section headings, the plate and the closing hand-off.
//
// `sections` is keyed by `FaqCategory` rather than spelled out, because the global
// generates one group per category from the same list the collection validates
// against; adding a fifth category would then be a type error here rather than a
// section that silently never renders.
//
// Read at `depth: 1` for the plate's upload — depth 0 returns a bare row id with
// no URL or intrinsic size to render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadSection = { heading?: string | null; intro?: string | null } | null;

export type PayloadPagePerguntas = {
  abertura?: {
    heading?: string | null;
    intro?: string | null;
  } | null;
  sections?: Partial<Record<FaqCategory, PayloadSection>> | null;
  plate?: {
    image?: PayloadMediaField;
    painter?: string | null;
    workTitle?: string | null;
    year?: string | null;
  } | null;
  fecho?: {
    heading?: string | null;
    body?: string | null;
    whatsappLabel?: string | null;
    linkLabel?: string | null;
  } | null;
};

/** The `page-perguntas` global, or null when Payload is disabled. */
export const getPagePerguntasGlobal = cache(async function getPagePerguntasGlobal(
  locale: Locale,
): Promise<PayloadPagePerguntas | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-perguntas",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPagePerguntas;
});
