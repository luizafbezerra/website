import { getMandalaGlobal as infraGetMandalaGlobal } from "@/infrastructure/payload/getMandalaGlobal";
import type { Locale } from "@/domain/site/Locale";
import { type MandalaContent, MANDALA_DEFAULTS } from "./MandalaContent";
import { mandalaFromPayload } from "./mandalaFromPayload";

/**
 * The zodiac wheel's editable prose merged over the code reference
 * (element/regente/nakshatra data stays in code).
 *
 * Falls back to defaults if the read fails: this global's table is created by a
 * migration that only lands on deploy, so a pre-migration read (or any global
 * outage) degrades to the code prose rather than breaking the wheel.
 */
export async function getMandala(locale: Locale): Promise<MandalaContent> {
  try {
    const doc = await infraGetMandalaGlobal(locale);
    if (!doc) return MANDALA_DEFAULTS;

    return mandalaFromPayload(doc);
  } catch (error) {
    console.error("[mandala] global read failed, falling back to defaults:", error);
    return MANDALA_DEFAULTS;
  }
}
