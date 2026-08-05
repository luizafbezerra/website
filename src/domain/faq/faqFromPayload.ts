import type { PayloadFaq } from "@/infrastructure/payload/findFaqEntries";
import { isFaqCategory } from "./FaqCategory";
import type { FaqEntry } from "./FaqEntry";

/**
 * Keep only rows that carry both halves of a question-and-answer *and* a section
 * they belong to. The category is required in the admin, so a row failing this
 * predates the field — dropping it is better than rendering it under a heading
 * that does not exist.
 */
export function faqFromPayload(docs: PayloadFaq[]): FaqEntry[] {
  return docs
    .filter((doc) => Boolean(doc?.question?.trim() && doc.answer?.trim()))
    .filter((doc) => isFaqCategory(doc.category))
    .map((doc) => ({
      question: (doc.question as string).trim(),
      answer: (doc.answer as string).trim(),
      category: doc.category as FaqEntry["category"],
    }));
}
