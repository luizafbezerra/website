import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";

// ---------------------------------------------------------------------------
// The raw `settings` global exactly as Payload returns it. Groups flatten to
// nested objects and every field is optional, so the domain mapper can fall
// back field-by-field. Read at depth 1 so `ogImage` arrives as a media object
// rather than an id.
//
// `cache` is React's request-scoped memoizer, not a UI concern: it keeps one
// database read per request, which is the accessor's own responsibility. Every
// accessor in this folder wraps itself the same way so the domain layer above
// can stay free of framework imports.
// ---------------------------------------------------------------------------

type PayloadMediaObject = { url?: string | null };

export type PayloadSettings = {
  siteName?: string | null;
  description?: string | null;
  ogImage?: PayloadMediaObject | string | number | null;
  social?: Array<{ label?: string | null; url?: string | null }> | null;
  tagline?: string | null;
  identity?: {
    fullName?: string | null;
    shortName?: string | null;
    role?: string | null;
    tradition?: string | null;
    credential?: string | null;
  } | null;
  nap?: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
  } | null;
  contact?: {
    phoneE164?: string | null;
    phoneDisplay?: string | null;
    email?: string | null;
    instagramUrl?: string | null;
    instagramHandle?: string | null;
  } | null;
  availability?: {
    hours?: string | null;
    responseNote?: string | null;
  } | null;
  chrome?: {
    headerByline?: string | null;
    footerByline?: string | null;
  } | null;
};

/** The `settings` global, or null when Payload is disabled. */
export const getSettingsGlobal = cache(
  async function getSettingsGlobal(): Promise<PayloadSettings | null> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({ slug: "settings", depth: 1, overrideAccess: true });
    return doc as PayloadSettings;
  },
);
