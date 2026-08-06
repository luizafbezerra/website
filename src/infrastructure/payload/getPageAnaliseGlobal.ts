import "server-only";
import { cache } from "react";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { Locale } from "@/domain/site/Locale";
import type { ZodiacSignId } from "@/domain/zodiac/zodiacContent";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadMediaField } from "./PayloadMedia";

// ---------------------------------------------------------------------------
// The raw `page-analise` global exactly as Payload returns it. Named tabs flatten
// to nested objects and every field is optional, so the domain mapper can fall
// back section by section.
//
// The `mandala` tab's twelve sign groups are direct children of the tab: the
// admin's four `collapsible` wrappers (fogo · terra · ar · água) are presentation
// only and add no level to the stored document. They are typed through
// `PayloadSignReadings` rather than spelled out twelve times.
//
// Read at `depth: 1` for the plate uploads — depth 0 returns a bare row id with
// no URL or intrinsic size to render.
//
// `cache` is React's request-scoped memoizer, kept here — on the I/O — so the
// domain layer above stays free of framework imports.
// ---------------------------------------------------------------------------

type PayloadArrayRow<T> = Array<T & { id?: string | null }> | null;

type PayloadPlate = {
  image?: PayloadMediaField;
  painter?: string | null;
  workTitle?: string | null;
  year?: string | null;
} | null;

/** Her prose for one sign — both halves empty until she writes them (REQ-007). */
export type PayloadSignReading = {
  reading?: string | null;
  vedicReading?: string | null;
} | null;

export type PayloadSignReadings = Partial<Record<ZodiacSignId, PayloadSignReading>>;

export type PayloadPageAnalise = {
  abertura?: {
    heading?: string | null;
    body?: RichTextContent | null;
  } | null;
  oQueTrazem?: {
    heading?: string | null;
    note?: string | null;
    pillars?: PayloadArrayRow<{
      numeral?: string | null;
      title?: string | null;
      text?: string | null;
    }>;
    boundary?: string | null;
    linkLabel?: string | null;
  } | null;
  oMetodo?: {
    heading?: string | null;
    body?: RichTextContent | null;
    toolsLine?: string | null;
    individuacao?: RichTextContent | null;
    closingLine?: string | null;
    plate?: PayloadPlate;
  } | null;
  sonhoAmpliado?: {
    heading?: string | null;
    intro?: string | null;
    motif?: string | null;
    parallels?: PayloadArrayRow<
      {
        label?: string | null;
        text?: string | null;
      } & NonNullable<PayloadPlate>
    >;
    closingLine?: string | null;
  } | null;
  pratico?: {
    heading?: string | null;
    items?: PayloadArrayRow<{ label?: string | null; value?: string | null }>;
    comecar?: { body?: string | null; linkLabel?: string | null } | null;
  } | null;
  mandala?:
    | ({
        heading?: string | null;
        intro?: string | null;
      } & PayloadSignReadings)
    | null;
};

/** The `page-analise` global, or null when Payload is disabled. */
export const getPageAnaliseGlobal = cache(async function getPageAnaliseGlobal(
  locale: Locale,
): Promise<PayloadPageAnalise | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "page-analise",
    locale,
    depth: 1,
    overrideAccess: true,
  });
  return doc as PayloadPageAnalise;
});
