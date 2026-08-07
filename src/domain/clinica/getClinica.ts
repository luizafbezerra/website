import { getClinicaGlobal as infraGetClinicaGlobal } from "@/infrastructure/payload/getClinicaGlobal";
import type { Locale } from "@/domain/site/Locale";
import { type Clinica, CLINICA_DEFAULTS } from "./Clinica";
import { clinicaFromPayload } from "./clinicaFromPayload";

/**
 * The practice's cross-page facts. This is the single read path for the
 * `clinica` global: the chrome, every page, the metadata and the JSON-LD all
 * consume it.
 *
 * Falls back to `CLINICA_DEFAULTS` when Payload is off and when the read fails —
 * pre-deploy the table does not exist yet, and a missing WhatsApp number must
 * never be what takes the site down.
 */
export async function getClinica(locale: Locale): Promise<Clinica> {
  try {
    const doc = await infraGetClinicaGlobal(locale);
    if (!doc) return CLINICA_DEFAULTS;

    return clinicaFromPayload(doc);
  } catch (error) {
    console.error("[clinica] global read failed, falling back to defaults:", error);
    return CLINICA_DEFAULTS;
  }
}
