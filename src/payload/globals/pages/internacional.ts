import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Brasil e exterior (`/internacional`) — confirm she attends from where I live:
 * time zone, payment, language, and how. Written for the words expats actually
 * type, and for the permission they are really looking for ("sim, atendo quem
 * mora fora").
 *
 * The trust line about Brazilian telepsychology regulation belongs here, phrased
 * as a signal rather than a disclaimer.
 */
export const PageInternacional: GlobalConfig = {
  slug: "page-internacional",
  label: "Brasil e exterior",
  admin: {
    group: PAGES_GROUP,
    description:
      "A página de quem mora fora do Brasil e de quem fala inglês: fuso, pagamento, idioma.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("internacional") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "1 · Abertura",
          description:
            "Brasileiros no exterior e estrangeiros ao redor do mundo, com a história real: Portugal, Inglaterra, Estados Unidos.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            localizedTextarea({
              name: "trustLine",
              label: "Linha de confiança",
              description:
                "Ex.: o atendimento segue a regulamentação brasileira de telepsicologia. É um sinal de seriedade, não um aviso legal.",
            }),
          ],
        },
        {
          name: "brasileirosFora",
          label: "2 · Para brasileiros fora do Brasil",
          description:
            "Terapia em português, no fuso de quem lê. Cite cidades reais — Lisboa, Londres, Nova York.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            {
              name: "cities",
              type: "array",
              label: "Exemplos de cidade",
              labels: { singular: "Cidade", plural: "Cidades" },
              fields: [
                { name: "city", type: "text", label: "Cidade", required: true },
                localizedText({
                  name: "note",
                  label: "Nota de horário",
                  description: "Ex.: o fim da tarde em Lisboa é o meio da tarde em Brasília.",
                }),
              ],
            },
          ],
        },
        {
          name: "inEnglish",
          label: "3 · In English",
          description:
            "Uma seção curta em inglês, dentro da página em português, com o link para o site em inglês. Escreva em inglês — este campo não é traduzido.",
          fields: [
            { name: "heading", type: "text", label: "Título (em inglês)" },
            { name: "body", type: "textarea", label: "Texto (em inglês)" },
            { name: "linkLabel", type: "text", label: "Rótulo do link (em inglês)" },
          ],
        },
        {
          name: "pratico",
          label: "4 · Prático",
          description:
            "Fusos, pagamento internacional, plataforma de vídeo. A nota de valores em dólar ou euro vem de A Clínica.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Itens",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "label", label: "Rótulo", required: true }),
                localizedText({ name: "value", label: "Valor" }),
              ],
            },
          ],
        },
        {
          name: "comecar",
          label: "5 · Começar",
          description: "O convite final. O bilhete em inglês vem de A Clínica.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "body", label: "Texto" }),
            localizedText({ name: "linkLabel", label: "Rótulo do link" }),
          ],
        },
      ],
    },
  ],
};
