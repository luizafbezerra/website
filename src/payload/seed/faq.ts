import type { Payload } from "payload";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";

/**
 * Seed the `faq` collection from FAQ_DEFAULTS. Find-or-create by `question` so
 * re-running doesn't duplicate rows; `order` follows the array index. Skips
 * revalidation so it can run outside a Next request, like the other seeders.
 */
export async function seedFaq(payload: Payload): Promise<void> {
  for (let i = 0; i < FAQ_DEFAULTS.length; i++) {
    const entry = FAQ_DEFAULTS[i];
    const existing = await payload.find({
      collection: "faq",
      where: { question: { equals: entry.question } },
      limit: 1,
      overrideAccess: true,
    });

    const data = { question: entry.question, answer: entry.answer, order: i };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "faq",
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
        context: { skipRevalidate: true },
      });
    } else {
      await payload.create({
        collection: "faq",
        data,
        overrideAccess: true,
        context: { skipRevalidate: true },
      });
    }
  }

  payload.logger.info(`  ✓ faq (${FAQ_DEFAULTS.length} entries)`);
}
