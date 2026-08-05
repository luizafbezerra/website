import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Sobre (`/sobre`) — meet the person behind the name and verify the credentials
 * are real. The formação section is the record, plainly: no editorializing, the
 * list speaks for itself.
 */
export const PageSobre: GlobalConfig = {
  slug: "page-sobre",
  label: "Sobre",
  admin: {
    group: PAGES_GROUP,
    description: "A sua página: quem recebe, a formação por inteiro e a história da clínica.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("sobre") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "credencial",
          label: "1 · Credencial",
          description:
            "A tira de fatos confirmados, acima da primeira dobra. CRP e contato vêm de A Clínica.",
          fields: [
            {
              name: "items",
              type: "array",
              label: "Fatos",
              labels: { singular: "Fato", plural: "Fatos" },
              fields: [localizedText({ name: "text", label: "Fato", required: true })],
            },
          ],
        },
        {
          name: "quemE",
          label: "2 · Quem é a Luiza",
          description:
            "Vinte e dois anos na psicologia, clínica desde 2014, Jung no segundo ano — um caminho sem volta. Escreva em primeira pessoa.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            mediaSlot({
              name: "portrait",
              label: "Retrato",
              description: "O mesmo retrato do início, ou um segundo quadro da mesma sessão.",
            }),
          ],
        },
        {
          name: "formacao",
          label: "3 · Formação",
          description:
            "O registro acadêmico por inteiro, sem adjetivos: graduação, pós, aprimoramentos, extensões. Uma linha por item.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Formação",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "title", label: "Curso ou título", required: true }),
                { name: "institution", type: "text", label: "Instituição" },
                { name: "period", type: "text", label: "Período" },
              ],
            },
          ],
        },
        {
          name: "aClinica",
          label: "4 · A clínica",
          description:
            "A história de Símbolos do Self: da página com 45 mil pessoas à clínica com o mesmo nome. O lugar e a pessoa.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
          ],
        },
        {
          name: "assinatura",
          label: "5 · Assinatura",
          description: "A sua assinatura fecha a página.",
          fields: [
            mediaSlot({
              name: "image",
              label: "Assinatura",
              description: "Sua assinatura digitalizada, fundo transparente se possível.",
            }),
            localizedTextarea({ name: "closingLine", label: "Linha final" }),
          ],
        },
      ],
    },
  ],
};
