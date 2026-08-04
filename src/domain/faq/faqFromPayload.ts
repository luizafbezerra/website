import type { PayloadFaq } from "@/infrastructure/payload/findFaqEntries";
import type { FaqEntry } from "./FaqEntry";

/** Keep only rows that carry both halves of a question-and-answer. */
export function faqFromPayload(docs: PayloadFaq[]): FaqEntry[] {
  return docs
    .filter((doc): doc is FaqEntry => Boolean(doc?.question && doc?.answer))
    .map((doc) => ({ question: doc.question, answer: doc.answer }));
}
