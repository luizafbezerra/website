import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";

// ---------------------------------------------------------------------------
// The raw `clinica` global exactly as Payload returns it. Named tabs flatten to
// nested objects and every field is optional, so the domain mapper can fall back
// field by field.
//
// `cache` is React's request-scoped memoizer, not a UI concern: it keeps one
// database read per request and locale, which is the accessor's own
// responsibility. Every accessor in this folder wraps itself the same way so the
// domain layer above can stay free of framework imports.
//
// The `locale` argument is the Payload content locale (REQ-002). With
// `fallback: true` in the config, an untranslated en field arrives filled with
// its pt value, so the domain mappers never have to know a locale exists.
// ---------------------------------------------------------------------------

export type PayloadClinica = {
  identity?: {
    clinicName?: string | null;
    fullName?: string | null;
    shortName?: string | null;
    role?: string | null;
    credential?: string | null;
    credentials?: Array<{ item?: string | null }> | null;
    positioning?: string | null;
  } | null;
  contact?: {
    whatsappE164?: string | null;
    whatsappDisplay?: string | null;
    email?: string | null;
    instagramUrl?: string | null;
    instagramHandle?: string | null;
  } | null;
  availability?: {
    state?: string | null;
    responseWindow?: string | null;
  } | null;
  fees?: {
    analysis?: string | null;
    careerGuidance?: string | null;
    internationalNote?: string | null;
  } | null;
  notes?: {
    analysis?: string | null;
    careerGuidance?: string | null;
    unsure?: string | null;
    english?: string | null;
    international?: string | null;
  } | null;
  jung?: {
    passages?: Array<{ text?: string | null; attribution?: string | null }> | null;
  } | null;
  privacy?: { line?: string | null } | null;
};

/** The `clinica` global, or null when Payload is disabled. */
export const getClinicaGlobal = cache(async function getClinicaGlobal(
  locale: Locale,
): Promise<PayloadClinica | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "clinica",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadClinica;
});
