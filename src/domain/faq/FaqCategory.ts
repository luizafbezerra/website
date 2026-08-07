/**
 * The four sections of `/perguntas` (CONCEPT §6), and therefore the only
 * categories a question may carry. Exactly these four, in render order: they are
 * the questions assistants actually get asked, grouped the way a visitor's doubt
 * arrives.
 *
 * Values only — the pt-BR admin labels live in `src/payload/faqCategories.ts`
 * and the visitor-facing section headings come from the `page-perguntas` global,
 * because the domain layer holds no human-facing text.
 */
export const FAQ_CATEGORIES = ["analise", "orientacao", "pratico", "internacional"] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export function isFaqCategory(value: unknown): value is FaqCategory {
  return typeof value === "string" && (FAQ_CATEGORIES as readonly string[]).includes(value);
}
