import type { GlobalConfig } from "payload";
import { FAQ_CATEGORIES } from "@/domain/faq/FaqCategory";
import { faqCategoryLabel } from "../../faqCategories";
import { localizedText, localizedTextarea } from "../../fields/copyFields";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Perguntas (`/perguntas`) — resolve the one specific doubt stopping me from
 * writing. The questions themselves are rows in Conteúdo → Perguntas frequentes,
 * one per doubt; this global holds only the page's opening and the four category
 * headings, generated from the same category list the collection validates
 * against so a section and its questions can never disagree.
 */
export const PagePerguntas: GlobalConfig = {
  slug: "page-perguntas",
  label: "Perguntas",
  admin: {
    group: PAGES_GROUP,
    description:
      "A abertura da página e os títulos das quatro seções. As perguntas ficam em Conteúdo → Perguntas frequentes.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("perguntas") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "Abertura",
          fields: [
            localizedText({ name: "eyebrow", label: "Sobrescrito" }),
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "intro", label: "Introdução" }),
          ],
        },
        {
          name: "sections",
          label: "Seções",
          description:
            "Um título e, se quiser, uma linha de introdução para cada uma das quatro seções.",
          fields: FAQ_CATEGORIES.map((category) => ({
            name: category,
            type: "group" as const,
            label: faqCategoryLabel(category),
            fields: [
              localizedText({ name: "heading", label: "Título" }),
              localizedTextarea({ name: "intro", label: "Introdução" }),
            ],
          })),
        },
      ],
    },
  ],
};
