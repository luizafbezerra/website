import type { Payload } from "payload";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";

/**
 * Seed the `clinica` global from `CLINICA_DEFAULTS` — the same values the site
 * falls back to when Payload is off — so the row and the code fallback start from
 * one source of truth.
 *
 * Written once per locale. Both passes carry the whole document rather than just
 * the localized fields: a non-localized value is shared between locales, so
 * repeating it is free, and it keeps the write independent of how Payload merges
 * partial group data. The only fields that actually differ are the two whose
 * English wording is a rule rather than a translation choice; the rest of the
 * English site falls back to her Portuguese until her polish pass (RISK-001).
 *
 * Idempotent: globals are a single row, so `updateGlobal` upserts. Passes
 * `context.skipRevalidate` because `revalidatePath` throws outside a Next request.
 */

/**
 * CON-002: in English she is a "clinical psychologist working in the Jungian
 * tradition" — never a "Jungian analyst", which is a formally protected title.
 */
const ENGLISH = {
  role: "Clinical psychologist working in the Jungian tradition",
  positioning:
    "An online analytical psychology (Jung) practice, for Brazil and anywhere in the world.",
  credentials: [
    "PUC-SP",
    "in practice since 2014",
    "online",
    "Portuguese and English",
    "Brazil and abroad",
  ],
};

export async function seedClinica(payload: Payload): Promise<void> {
  const d = CLINICA_DEFAULTS;

  const data = (
    role: string,
    positioning: string,
    credentials: Array<{ id?: string | null; item: string }>,
  ) => ({
    identity: {
      clinicName: d.clinicName,
      fullName: d.fullName,
      shortName: d.shortName,
      credential: d.credential,
      credentials,
      role,
      positioning,
    },
    contact: {
      whatsappE164: d.whatsappE164,
      whatsappDisplay: d.whatsappDisplay,
      email: d.email,
      instagramUrl: d.instagramUrl,
      instagramHandle: d.instagramHandle,
    },
    availability: { state: d.availability.state },
  });

  const written = await payload.updateGlobal({
    slug: "clinica",
    locale: "pt",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: data(
      d.role,
      d.positioning,
      d.credentials.map((item) => ({ item })),
    ),
  });

  // The English pass has to carry each credential row's id. Only the `item`
  // field is localized — the rows themselves are shared — so rows sent without
  // an id read as new ones and would replace the Portuguese pass's, leaving pt
  // (the fallback locale, which has nothing to fall back to) empty.
  const rows = Array.isArray(written.identity?.credentials) ? written.identity.credentials : [];

  await payload.updateGlobal({
    slug: "clinica",
    locale: "en",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: data(
      ENGLISH.role,
      ENGLISH.positioning,
      rows.map((row, index) => ({ id: row.id, item: ENGLISH.credentials[index] })),
    ),
  });

  payload.logger.info("  ✓ clinica global (pt + en)");
}
