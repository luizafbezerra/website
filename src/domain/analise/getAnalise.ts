import type { Locale } from "@/domain/site/Locale";
import { getPageAnaliseGlobal as infraGetPageAnaliseGlobal } from "@/infrastructure/payload/getPageAnaliseGlobal";
import { ANALISE_DEFAULTS, type Analise } from "./Analise";
import { analiseFromPayload } from "./analiseFromPayload";

/**
 * The analysis page's own copy. This is the single read path for the
 * `page-analise` global; the fee, the availability state, the WhatsApp opener and
 * the credential strip come from `getClinica` instead.
 *
 * Falls back to `ANALISE_DEFAULTS` when Payload is off and when the read fails.
 * For análise the approach *is* the product (CONCEPT §6), so this is the page a
 * comparing reader spends the most time on — a database hiccup must degrade to
 * the written page rather than to an error screen.
 */
export async function getAnalise(locale: Locale): Promise<Analise> {
  try {
    const doc = await infraGetPageAnaliseGlobal(locale);
    if (!doc) return ANALISE_DEFAULTS;

    return analiseFromPayload(doc);
  } catch (error) {
    console.error("[analise] global read failed, falling back to defaults:", error);
    return ANALISE_DEFAULTS;
  }
}
