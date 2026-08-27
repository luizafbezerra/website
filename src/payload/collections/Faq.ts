import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { MACHINE_INDEX_PATH, twinPath } from "@/domain/markdown/twinPath";
import { SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { FAQ_CATEGORY_OPTIONS } from "../faqCategories";
import { localizedText, localizedTextarea } from "../fields/copyFields";

/**
 * Perguntas frequentes — one row per doubt, filed under one of the four sections
 * of `/perguntas` (CONCEPT §6). The category is required: a question with no
 * section would silently never render.
 *
 * No draft workflow, unlike Depoimentos: a save goes live immediately, which is
 * the simpler mental model for short Q&A. Because there are no drafts there is no
 * `_status` — every row is public.
 */
/**
 * Helper text under the Pergunta field.
 *
 * It used to list the subjects each section still needed, because most of the page
 * was a placeholder. Her batch of 2026-08-26 answered it, so the field's job is now
 * the opposite: tell her which answers are still ours rather than hers, so she can
 * take them over whenever she wants to.
 *
 * Admin-facing, so pt-BR only and never localized (the panel is hers).
 */
const FAQ_QUESTION_SUGGESTIONS = [
  "As quatro seções já estão respondidas. Este campo é para quando chegar uma pergunta nova — escreva-a como a pessoa perguntaria, não como um título.",
  "Oito das respostas não são suas: são as suas próprias páginas resumidas, para que nenhuma seção ficasse vazia. Pode trocar todas por palavras suas a qualquer momento — são as quatro de Sobre a orientação profissional, a de “Quanto tempo dura uma análise?” e três das quatro de Internacional (horários, idiomas e regulamentação).",
].join("\n\n");

export const Faq: CollectionConfig = {
  slug: "faq",
  labels: { singular: "Pergunta frequente", plural: "Perguntas frequentes" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order"],
    description:
      "As perguntas de /perguntas. Cada uma pertence a uma seção; dentro da seção, a ordem segue o campo Ordem. " +
      "As quatro seções já estão respondidas — o que você editar ou acrescentar aqui entra no ar sozinho, " +
      "sem depender de uma nova publicação do site.",
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidateFaqPaths();
      },
    ],
    afterDelete: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidateFaqPaths();
      },
    ],
  },
  fields: [
    localizedText({
      name: "question",
      label: "Pergunta",
      required: true,
      description: FAQ_QUESTION_SUGGESTIONS,
    }),
    localizedTextarea({ name: "answer", label: "Resposta", required: true }),
    {
      name: "category",
      type: "select",
      label: "Seção",
      required: true,
      options: FAQ_CATEGORY_OPTIONS,
      admin: {
        position: "sidebar",
        description: "Em qual das quatro seções da página esta pergunta aparece.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Ordem dentro da seção (menor primeiro)." },
    },
  ],
};

/**
 * The FAQ renders on `/perguntas` in both locales, in that page's Markdown twin
 * (where the questions are the bulk of the file), and is indexed by llms.txt.
 */
function revalidateFaqPaths(): void {
  for (const locale of SITE_LOCALES) {
    revalidatePath(pagePath("perguntas", locale));
    revalidatePath(twinPath("perguntas", locale));
  }
  revalidatePath(MACHINE_INDEX_PATH);
}
