import { FAQ_CATEGORIES, type FaqCategory } from "@/domain/faq/FaqCategory";

/**
 * How the four FAQ sections are named in the admin panel — the labels she picks
 * from when filing a question, and the same order the page renders them in.
 *
 * Admin-facing only: what a visitor reads as a section heading comes from the
 * `page-perguntas` global, which is localized.
 */
const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  analise: "Sobre a análise",
  orientacao: "Sobre a orientação profissional",
  pratico: "Prático",
  internacional: "Internacional",
};

export function faqCategoryLabel(category: FaqCategory): string {
  return FAQ_CATEGORY_LABELS[category];
}

export const FAQ_CATEGORY_OPTIONS = FAQ_CATEGORIES.map((value) => ({
  value,
  label: FAQ_CATEGORY_LABELS[value],
}));
