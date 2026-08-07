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
 * Helper text under the Pergunta field: the subjects worth covering, by section.
 *
 * These are the ten drafted answers this repo shipped in August, demoted from copy
 * to prompt — the ground was right, the voice was ours. The section names match
 * `FAQ_CATEGORY_LABELS` in `../faqCategories` and must stay in step with them.
 * Admin-facing, so pt-BR only and never localized (the panel is hers).
 */
const FAQ_QUESTION_SUGGESTIONS = [
  "Sugestões por seção — a página precisa de pelo menos uma resposta sua em cada uma.",
  "Sobre a análise: quanto tempo dura uma análise · que público você atende · se é preciso lembrar dos sonhos.",
  "Sobre a orientação profissional: quantos encontros são · que testes são usados e se eles decidem por você · o que a pessoa leva no final · em que difere de terapia.",
  "Prático: com que frequência são as sessões · valores · como funciona a sessão on-line · sigilo · remarcação.",
  "Internacional: diferença de fuso · como pagar de fora do Brasil · sessões em inglês.",
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
      "Cada uma das quatro seções precisa de pelo menos uma resposta escrita por você antes de o site poder ser indexado — " +
      "as linhas marcadas [A DEFINIR] estão no lugar das suas e não vão ao ar.",
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
