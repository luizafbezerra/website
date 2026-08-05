import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Privacidade (`/privacidade`) — linked from the footer only, and short on
 * purpose. Two honest lists: what the site keeps (the language choice, in the
 * visitor's own browser; anonymous aggregate visit statistics) and what it never
 * does (identify you, read you, personalise for you).
 *
 * There is no consent banner because there is nothing to consent to (SEC-001):
 * no analytics cookie, no form, no visitor identification. The page says so
 * plainly instead of hiding it in legal prose.
 */
export const PagePrivacidade: GlobalConfig = {
  slug: "page-privacidade",
  label: "Privacidade",
  admin: {
    group: PAGES_GROUP,
    description:
      "Curta e honesta: o que o site guarda e o que ele nunca faz. Fica no rodapé, fora da navegação principal.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("privacidade") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "1 · Abertura",
          fields: [
            localizedText({ name: "eyebrow", label: "Sobrescrito" }),
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
          ],
        },
        {
          name: "guarda",
          label: "2 · O que o site guarda",
          description:
            "Uma linha por item: a escolha de idioma, no navegador de quem visita; estatísticas de visita anônimas e agregadas.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Itens",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
          ],
        },
        {
          name: "nuncaFaz",
          label: "3 · O que o site nunca faz",
          description:
            "Identificar, ler ou personalizar para quem visita. Sem formulários, sem chatbot, sem propaganda.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Itens",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
          ],
        },
        {
          name: "bilheteNota",
          label: "4 · Sobre o bilhete",
          description:
            "Explique que o bilhete é montado no navegador de quem escreve e só chega até você quando a pessoa envia — o site não guarda nada disso.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "body", label: "Texto" }),
          ],
        },
      ],
    },
  ],
};
