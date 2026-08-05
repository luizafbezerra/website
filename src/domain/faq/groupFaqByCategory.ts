import { FAQ_CATEGORIES, type FaqCategory } from "./FaqCategory";
import type { FaqEntry } from "./FaqEntry";

/** One rendered section of `/perguntas`: a category and the questions filed under it. */
export type FaqSection = {
  category: FaqCategory;
  /** Never empty — a category with no questions produces no section at all. */
  entries: FaqEntry[];
};

/**
 * Split a flat FAQ list into the four sections of CONCEPT §6, in the map's order.
 *
 * Two rules, and they are the whole function:
 *
 * 1. **The order is `FAQ_CATEGORIES`, not the order questions happen to arrive
 *    in.** CONCEPT §6 fixes the sequence — análise · orientação · prático ·
 *    internacional — and it is an argument, not an accident: what the two works
 *    are, then how they run, then how they run from abroad. Grouping in
 *    first-appearance order would let one re-ordered row in the admin rewrite the
 *    page's structure.
 * 2. **A category with no questions produces no section.** An `h2` over nothing is
 *    worse than a missing section: it reads as a page that broke rather than as a
 *    page that has nothing to say there yet. Two of the four sections legitimately
 *    ship empty until she has answered them.
 *
 * Within a section the input order survives untouched. `FaqEntry` deliberately
 * carries no `order` field — sorting is the accessor's job (`findFaqEntries` sorts
 * by `order` in the database, where the index is), so this rule must be *stable*
 * rather than re-sort. It never drops or duplicates an entry either: every entry
 * in, exactly one entry out, which is what lets the page's `FAQPage` JSON-LD be
 * derived from the same structure it renders.
 */
export function groupFaqByCategory(entries: readonly FaqEntry[]): FaqSection[] {
  const sections: FaqSection[] = [];

  for (const category of FAQ_CATEGORIES) {
    const filed = entries.filter((entry) => entry.category === category);
    if (filed.length > 0) sections.push({ category, entries: filed });
  }

  return sections;
}
