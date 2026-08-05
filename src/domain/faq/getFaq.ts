import { findFaqEntries as infraFindFaqEntries } from "@/infrastructure/payload/findFaqEntries";
import type { Locale } from "@/domain/site/Locale";
import { FAQ_DEFAULTS, type FaqEntry } from "./FaqEntry";
import { faqFromPayload } from "./faqFromPayload";

/**
 * FAQ entries ordered by `order`. Falls back to FAQ_DEFAULTS when Payload is off
 * OR when the collection is empty, so /perguntas (and the FAQ JSON-LD) are never
 * blank. Pre-migration the `faq` table does not exist, so a failed read degrades
 * to the code defaults rather than breaking the page.
 */
export async function getFaq(locale: Locale): Promise<FaqEntry[]> {
  try {
    const docs = await infraFindFaqEntries(locale);
    if (!docs) return FAQ_DEFAULTS;

    const entries = faqFromPayload(docs);
    return entries.length > 0 ? entries : FAQ_DEFAULTS;
  } catch (error) {
    console.error("[faq] collection read failed, falling back to defaults:", error);
    return FAQ_DEFAULTS;
  }
}
