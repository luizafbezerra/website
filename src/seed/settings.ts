import type { Payload } from "payload";
import { IDENTITY_DEFAULTS } from "@/core/identity";

/**
 * Seed the `settings` global from `IDENTITY_DEFAULTS` — the same hardcoded
 * values the site falls back to when Payload is off — so the DB row and the
 * code fallback start from one source of truth.
 *
 * Idempotent: globals are a single row, so `updateGlobal` upserts. Safe to run
 * repeatedly. Passes `context.skipRevalidate` so the global's `afterChange`
 * hook doesn't call `revalidatePath` (which throws outside a Next request).
 */
export async function seedSettings(payload: Payload): Promise<void> {
  const d = IDENTITY_DEFAULTS;

  await payload.updateGlobal({
    slug: "settings",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: {
      siteName: d.siteName,
      description: d.description,
      tagline: d.tagline,
      identity: {
        fullName: d.fullName,
        shortName: d.shortName,
        role: d.role,
        tradition: d.tradition,
        credential: d.credential,
      },
      nap: {
        city: d.city,
        region: d.region,
        country: d.country,
        countryCode: d.countryCode,
      },
      contact: {
        phoneE164: d.phoneE164,
        phoneDisplay: d.phoneDisplay,
        email: d.email,
        instagramUrl: d.instagramUrl,
        instagramHandle: d.instagramHandle,
      },
      availability: {
        hours: d.availability.hours,
        responseNote: d.availability.responseNote,
      },
      chrome: {
        headerByline: d.headerByline,
        footerByline: d.footerByline,
      },
    },
  });

  payload.logger.info("  ✓ settings global");
}
