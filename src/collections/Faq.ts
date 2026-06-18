import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

/**
 * Frequently-asked questions for the /perguntas page (and the FAQPage JSON-LD).
 * Mirrors Testimonials, but with NO draft workflow: a non-technical editor's
 * save goes live immediately, which is the simpler mental model for short Q&A.
 * Because there are no drafts there is no `_status` — every row is public.
 */
export const Faq: CollectionConfig = {
  slug: "faq",
  labels: { singular: "Pergunta frequente", plural: "Perguntas frequentes" },
  admin: {
    group: "Páginas",
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    description: "Perguntas e respostas exibidas em /perguntas. A ordem segue o campo Ordem.",
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
        revalidatePath("/perguntas");
        revalidatePath("/llms.txt");
      },
    ],
    afterDelete: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidatePath("/perguntas");
        revalidatePath("/llms.txt");
      },
    ],
  },
  fields: [
    {
      name: "question",
      type: "text",
      label: "Pergunta",
      required: true,
    },
    {
      name: "answer",
      type: "textarea",
      label: "Resposta",
      required: true,
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Ordem de exibição (menor primeiro).",
      },
    },
  ],
};
