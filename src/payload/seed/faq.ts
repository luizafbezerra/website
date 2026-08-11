import type { Payload } from "payload";
import { FAQ_PLACEHOLDER_MARK, FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";

/**
 * Seed the `faq` collection from FAQ_DEFAULTS, in both locales.
 *
 * Find-or-create by the Portuguese `question` so re-running doesn't duplicate
 * rows; `order` follows the array index within the whole list, which is also the
 * order inside each section. Skips revalidation so it can run outside a Next
 * request, like the other seeders.
 *
 * `FAQ_DEFAULTS` is a flat Portuguese array with no locale dimension — the domain
 * holds one shape per concept, not one per locale — so the English answers live
 * here in `FAQ_EN`, matched to the Portuguese rows **by index**. Two things follow
 * from that and both matter:
 *
 *   · the two arrays must stay the same length and the same order, which
 *     `assertFaqEnMatchesDefaults` checks at seed time rather than letting a
 *     mismatch quietly shift every answer by one;
 *   · the Portuguese pass has to run first on each row, because a row is created
 *     with its Portuguese question and the English pass only updates it.
 */
export async function seedFaq(payload: Payload): Promise<void> {
  assertFaqEnMatchesDefaults();

  for (let i = 0; i < FAQ_DEFAULTS.length; i++) {
    const entry = FAQ_DEFAULTS[i];
    const englishEntry = FAQ_EN[i];
    const existing = await payload.find({
      collection: "faq",
      where: { question: { equals: entry.question } },
      limit: 1,
      overrideAccess: true,
      locale: "pt",
    });

    const shared = { overrideAccess: true, context: { skipRevalidate: true } } as const;
    // `category` and `order` are not localized, so the English pass repeats them
    // harmlessly; only `question` and `answer` differ between the two passes.
    const portuguese = {
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      order: i,
    };
    const english = {
      question: englishEntry.question,
      answer: englishEntry.answer,
      category: entry.category,
      order: i,
    };

    const id =
      existing.docs.length > 0
        ? existing.docs[0].id
        : (
            await payload.create({
              collection: "faq",
              data: portuguese,
              locale: "pt",
              ...shared,
            })
          ).id;

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "faq",
        id,
        data: portuguese,
        locale: "pt",
        ...shared,
      });
    }

    await payload.update({
      collection: "faq",
      id,
      data: english,
      locale: "en",
      ...shared,
    });
  }

  payload.logger.info(`  ✓ faq (${FAQ_DEFAULTS.length} entries, pt + en)`);
}

/**
 * The English FAQ, matched to `FAQ_DEFAULTS` by index — three placeholders and the
 * two money answers, because that is the shape of the Portuguese array too. Her
 * other translated answers went with the Portuguese originals; recover them from
 * `git show 6d508ba:src/payload/seed/faq.ts` if she signs one off unchanged.
 *
 * `FAQ_PLACEHOLDER_MARK` is deliberately **not** translated: the mark exists so the
 * row is unmistakable on the page, in the Markdown twin and in the FAQPage
 * structured data, and a translated mark would be one more string to grep for
 * before a deploy. Only her answers retire these rows, and none may reach
 * production.
 */
const FAQ_EN: Array<{ question: string; answer: string }> = [
  placeholderEn("analysis"),
  placeholderEn("career guidance"),
  {
    question: "What about fees?",
    answer:
      "We agree on fees before the first session, according to the format and how often we meet. To know the current fee, just write to me on WhatsApp; I reply within one working day.",
  },
  {
    question: "Is the first conversation charged?",
    answer:
      "Yes. It is a working session like any other, and it is charged. What does not exist is a commitment to continue after it: you decide, in your own time, whether to go on.",
  },
  placeholderEn("the practical side"),
  placeholderEn("sessions from abroad"),
];

/** The mark is kept verbatim; only the sentence around it is in English. */
function placeholderEn(subject: string): { question: string; answer: string } {
  return {
    question: `${FAQ_PLACEHOLDER_MARK} question about ${subject}`,
    answer: `${FAQ_PLACEHOLDER_MARK} this answer does not exist yet. The text of this section is Luiza's. Until she writes it, this line stands in for it, and it does not go live.`,
  };
}

/**
 * The two arrays are joined by index and nothing else, so a length mismatch would
 * silently attach every English answer to the wrong Portuguese question. Fail at
 * seed time instead.
 */
function assertFaqEnMatchesDefaults(): void {
  if (FAQ_EN.length !== FAQ_DEFAULTS.length) {
    throw new Error(
      `FAQ_EN has ${FAQ_EN.length} entries and FAQ_DEFAULTS has ${FAQ_DEFAULTS.length}. ` +
        "They are matched by index, so they must stay the same length and the same order.",
    );
  }

  const misplaced = FAQ_DEFAULTS.findIndex(
    (entry, index) =>
      entry.answer.includes(FAQ_PLACEHOLDER_MARK) !==
      FAQ_EN[index].answer.includes(FAQ_PLACEHOLDER_MARK),
  );
  if (misplaced !== -1) {
    throw new Error(
      `FAQ row ${misplaced} is a placeholder in one locale and a real answer in the other. ` +
        "A placeholder must be unmistakable in both.",
    );
  }
}
