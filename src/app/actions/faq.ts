import { FAQ_DEFAULTS, type FaqEntry, faqFromPayload, type PayloadFaq } from "@/core/faq";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * FAQ entries from the Payload `faq` collection, ordered by `order`. Falls back
 * to FAQ_DEFAULTS when Payload is off OR when the collection is empty, so
 * /perguntas (and the FAQ JSON-LD) are never blank. The collection has no
 * drafts, so every row is public.
 */
export const getFaq = cache(async function getFaq(): Promise<FaqEntry[]> {
  const payload = await getPayloadSafe();
  if (!payload) return FAQ_DEFAULTS;

  try {
    const { docs } = await payload.find({
      collection: "faq",
      sort: "order",
      depth: 0,
      limit: 100,
      overrideAccess: true,
    });
    const entries = faqFromPayload(docs as PayloadFaq[]);
    return entries.length > 0 ? entries : FAQ_DEFAULTS;
  } catch (error) {
    // Pre-migration the `faq` table doesn't exist; degrade to code defaults
    // rather than break the page (same model as getMandala).
    console.error("[faq] collection read failed, falling back to defaults:", error);
    return FAQ_DEFAULTS;
  }
});
