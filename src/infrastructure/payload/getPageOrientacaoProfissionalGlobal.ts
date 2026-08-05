import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-orientacao-profissional` global exactly as Payload returns it.
// Named tabs flatten to nested objects and every field is optional, so the domain
// mapper can fall back section by section.
//
// Read at `depth: 1` for the plate's upload — depth 0 returns a bare row id with
// no URL or intrinsic size to render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

export type PayloadPageOrientacaoProfissional = {
  abertura?: {
    heading?: string | null;
    body?: RichTextContent | null;
  } | null;
  paraQuem?: {
    heading?: string | null;
    cases?: PayloadArrayRow<{ title?: string | null; text?: string | null }>;
  } | null;
  oPercurso?: {
    heading?: string | null;
    body?: RichTextContent | null;
    steps?: PayloadArrayRow<{
      numeral?: string | null;
      title?: string | null;
      text?: string | null;
    }>;
    deliverable?: string | null;
  } | null;
  nemCoaching?: {
    heading?: string | null;
    body?: RichTextContent | null;
    distinctions?: PayloadArrayRow<{ title?: string | null; text?: string | null }>;
    anchor?: string | null;
    plate?: {
      image?: PayloadMediaField;
      painter?: string | null;
      workTitle?: string | null;
      year?: string | null;
    } | null;
  } | null;
  perguntaMaisFunda?: {
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

/** The `page-orientacao-profissional` global, or null when Payload is disabled. */
export const getPageOrientacaoProfissionalGlobal = cache(
  async function getPageOrientacaoProfissionalGlobal(
    locale: Locale,
  ): Promise<PayloadPageOrientacaoProfissional | null> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({
      slug: "page-orientacao-profissional",
      locale,
      depth: 1,
      overrideAccess: true,
    });
    return doc as PayloadPageOrientacaoProfissional;
  },
);
