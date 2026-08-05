import { getPageSobreGlobal as infraGetPageSobreGlobal } from "@/infrastructure/payload/getPageSobreGlobal";
import type { Locale } from "@/domain/site/Locale";
import { SOBRE_DEFAULTS, type Sobre } from "./Sobre";
import { sobreFromPayload } from "./sobreFromPayload";

/**
 * The Sobre page's own copy. This is the single read path for the `page-sobre`
 * global; the credential strip, the CRP, the contact facts and her name come from
 * `getClinica` instead — they appear on every core page and are held once.
 *
 * Falls back to `SOBRE_DEFAULTS` when Payload is off and when the read fails.
 * This is the page a sceptical visitor opens to check that the credentials are
 * real, so a database hiccup must degrade to the written record rather than to an
 * error screen — an unreachable /sobre is worse for trust than a stale one.
 */
export async function getSobre(locale: Locale): Promise<Sobre> {
  try {
    const doc = await infraGetPageSobreGlobal(locale);
    if (!doc) return SOBRE_DEFAULTS;

    return sobreFromPayload(doc);
  } catch (error) {
    console.error("[sobre] global read failed, falling back to defaults:", error);
    return SOBRE_DEFAULTS;
  }
}
