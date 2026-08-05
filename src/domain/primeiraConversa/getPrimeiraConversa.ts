import { getPagePrimeiraConversaGlobal as infraGetPagePrimeiraConversaGlobal } from "@/infrastructure/payload/getPagePrimeiraConversaGlobal";
import type { Locale } from "@/domain/site/Locale";
import { PRIMEIRA_CONVERSA_DEFAULTS, type PrimeiraConversa } from "./PrimeiraConversa";
import { primeiraConversaFromPayload } from "./primeiraConversaFromPayload";

/**
 * The threshold page's own copy. This is the single read path for the
 * `page-primeira-conversa` global; the openers, the fees, the availability state
 * and the credential strip come from `getClinica` instead.
 *
 * Falls back to `PRIMEIRA_CONVERSA_DEFAULTS` when Payload is off and when the read
 * fails: this is the page where the site's north star is collected, so a database
 * hiccup must degrade to the written page rather than to an error screen.
 */
export async function getPrimeiraConversa(locale: Locale): Promise<PrimeiraConversa> {
  try {
    const doc = await infraGetPagePrimeiraConversaGlobal(locale);
    if (!doc) return PRIMEIRA_CONVERSA_DEFAULTS;

    return primeiraConversaFromPayload(doc);
  } catch (error) {
    console.error("[primeiraConversa] global read failed, falling back to defaults:", error);
    return PRIMEIRA_CONVERSA_DEFAULTS;
  }
}
