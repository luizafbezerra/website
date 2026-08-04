import type { RichTextContent } from "@/domain/richText/RichTextContent";

// ---------------------------------------------------------------------------
// The raw shapes of the six homepage globals, shared by the accessors that read
// them. One shape per global, loose in the same way Payload is loose: every
// field optional so the domain mapper falls back field-by-field.
// ---------------------------------------------------------------------------

/** An upload relationship read at depth 0: an id, or the populated document. */
export type PayloadMedia = { url?: string | null } | string | number | null;

type PayloadRich = RichTextContent | null | undefined;

/** The repurposed `home` global: only page structure + off-page nav links. */
export type PayloadHomeStructure = {
  sections?: Array<{ type?: string | null; enabled?: boolean | null }> | null;
  navExtraLinks?: Array<{ label?: string | null; href?: string | null }> | null;
} | null;

export type PayloadHomeHero = {
  subtitle?: string | null;
  lead?: PayloadRich;
  ctaPrimaryLabel?: string | null;
  ctaSecondaryLabel?: string | null;
  portrait?: PayloadMedia;
} | null;

export type PayloadHomePillars = {
  eyebrow?: string | null;
  heading?: PayloadRich;
  intro?: PayloadRich;
  note?: string | null;
  items?: Array<{
    numeral?: string | null;
    title?: string | null;
    paragraph?: string | null;
  }> | null;
} | null;

export type PayloadHomeAbout = {
  heading?: PayloadRich;
  bio?: PayloadRich;
  formacao?: string | null;
  idiomas?: string | null;
} | null;

export type PayloadHomeVoices = { heading?: string | null } | null;

export type PayloadHomeContact = {
  eyebrow?: string | null;
  heading?: PayloadRich;
  body?: PayloadRich;
  whatsappLabel?: string | null;
  faqLinkLabel?: string | null;
} | null;
