import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { twinPath } from "@/domain/markdown/twinPath";
import { SITE_LOCALES } from "@/domain/site/Locale";
import { localizedText, localizedTextarea } from "../fields/copyFields";

/**
 * Depoimentos — the Vozes section's quotes, mixed across both services with at
 * least one voice from abroad (CONCEPT §6).
 *
 * Consent is structural, not a policy note (SEC-002): `consentGiven` is part of
 * the public read filter here, of the `where` clause the accessor sends, and of
 * the domain mapper's filter. A quote without recorded consent is unreachable
 * through every path, and the section hides itself at zero.
 *
 * Presentation is fixed by CONCEPT §11: first name or initial plus context
 * ("M., orientação de carreira"), the client's verbatim words, no star ratings.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Depoimento", plural: "Depoimentos" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "attribution",
    defaultColumns: ["attribution", "service", "consentGiven", "_status"],
    description:
      "As palavras de quem já foi atendido. Sem consentimento registrado, o depoimento não aparece no site — nem por engano.",
  },
  versions: { drafts: true },
  access: {
    // Logged-in admins see everything, including drafts. Everyone else — the
    // public REST/GraphQL API included — sees only published *and* consented rows.
    read: ({ req }) => {
      if (req.user) return true;
      // Sibling keys are ANDed by Payload — both conditions must hold.
      return { _status: { equals: "published" }, consentGiven: { equals: true } };
    },
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidateVozes();
      },
    ],
    afterDelete: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidateVozes();
      },
    ],
  },
  fields: [
    localizedTextarea({
      name: "body",
      label: "Depoimento",
      description: "As palavras dela ou dele, sem edição.",
      required: true,
    }),
    {
      name: "attribution",
      type: "text",
      label: "Atribuição",
      required: true,
      admin: {
        description: 'Primeiro nome ou inicial — nunca o nome completo. Ex.: "M." ou "Marina".',
      },
    },
    localizedText({
      name: "context",
      label: "Contexto",
      description: 'O que situa a pessoa, ex.: "orientação de carreira" ou "análise, Lisboa".',
    }),
    {
      name: "service",
      type: "select",
      label: "Serviço",
      options: [
        { label: "Análise", value: "analise" },
        { label: "Orientação profissional", value: "orientacao" },
      ],
      admin: {
        position: "sidebar",
        description: "Serve para equilibrar as vozes entre as duas portas.",
      },
    },
    {
      name: "abroad",
      type: "checkbox",
      label: "Atendimento no exterior",
      defaultValue: false,
      admin: { position: "sidebar", description: "Marque quando a pessoa mora fora do Brasil." },
    },
    {
      name: "consentGiven",
      type: "checkbox",
      label: "Consentimento registrado",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Só marque com autorização explícita da pessoa. Sem esta marca, o depoimento nunca chega ao site.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Ordem de exibição (menor primeiro)." },
    },
  ],
};

/**
 * The quotes render in Início's Vozes section and in that page's Markdown twin.
 * `("/", "layout")` covers the page but not the route handler, so the twin is
 * named explicitly (TASK-043) — and it matters most on **delete**, where a
 * withdrawn consent has to disappear from the machine copy too (SEC-002).
 */
function revalidateVozes(): void {
  revalidatePath("/", "layout");
  for (const locale of SITE_LOCALES) revalidatePath(twinPath("inicio", locale));
}
