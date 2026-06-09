import {
  MANDALA_DEFAULTS,
  type MandalaContent,
  mandalaFromPayload,
  type PayloadMandala,
} from "@/core/zodiacContent";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * The zodiac wheel's editable prose from the Payload `mandala` global, merged
 * over the code reference (element/regente/nakshatra data stays in code), with
 * a graceful fall back to `MANDALA_DEFAULTS` — same degradation model as
 * `getHome` / `getIdentity`.
 */
export const getMandala = cache(async function getMandala(): Promise<MandalaContent> {
  const payload = await getPayloadSafe();
  if (!payload) return MANDALA_DEFAULTS;

  // `mandalaFromPayload` guards every field defensively, so we read the doc
  // through the loose `PayloadMandala` shape (the generated type's `id`/index
  // signature don't overlap, hence the `unknown` bridge).
  //
  // Fall back to defaults if the read fails: this global's table is created by a
  // migration that only lands on deploy, so a pre-migration read (or any global
  // outage) should degrade to the code prose rather than break the wheel pages.
  try {
    const doc = await payload.findGlobal({ slug: "mandala", depth: 0, overrideAccess: true });
    return mandalaFromPayload(doc as unknown as PayloadMandala);
  } catch (error) {
    // Degrade to code prose, but log: pre-migration this is the expected
    // missing-table read; post-migration it would signal a real global outage.
    console.error("[mandala] global read failed, falling back to defaults:", error);
    return MANDALA_DEFAULTS;
  }
});
