import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Brasil e exterior (`/internacional`) — confirm she attends from where I live:
 * time zone, payment, language, and how. Written for the words expats actually
 * type, and for the permission they are really looking for ("sim, atendo quem
 * mora fora").
 *
 * The trust line about Brazilian telepsychology regulation belongs here, phrased
 * as a signal rather than a disclaimer.
 *
 * Unlike the other Phase 6 globals this one's first tab is already the page's
 * opening *and* CONCEPT §6's section 1, so no separate `abertura` tab was needed.
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
            localizedRichText({
              name: "body",
              label: "Texto",
              description:
                "Duas ou três frases que já respondem tudo: quem você atende, em que idiomas, por onde, e de onde as pessoas escrevem.",
            }),
            localizedTextarea({
              name: "trustLine",
              label: "Linha de confiança",
              description:
                "Ex.: o atendimento segue a regulamentação brasileira de telepsicologia. É um sinal de seriedade, não um aviso legal — o site imprime esta linha em corpo de texto, junto da abertura.",
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
              admin: {
                description:
                  "Cuidado com precisão falsa: o Brasil não tem mais horário de verão, mas a Europa e os Estados Unidos têm, então a diferença muda algumas vezes por ano. Escreva notas que continuem verdadeiras nos dois casos.",
              },
              fields: [
                // Localized because the name of a city is different in each
                // language ("Nova York" / "New York"), and the English mirror
                // must not print the Portuguese one inside an English sentence.
                localizedText({ name: "city", label: "Cidade", required: true }),
                localizedTextarea({
                  name: "note",
                  label: "Nota de horário",
                  description:
                    "Ex.: três ou quatro horas à frente de Brasília, conforme o horário de verão europeu — o fim da tarde aí é o meio da tarde aqui.",
                }),
              ],
            },
            {
              name: "plate",
              type: "group",
              label: "A pintura desta página",
              admin: {
                description:
                  "Uma pintura depois dos exemplos de cidade — mar, viagem, porto: a distância como paisagem. Domínio público, com proveniência verificada.",
              },
              fields: [
                mediaSlot({
                  name: "image",
                  label: "Imagem",
                  description: "A tela inteira, em boa resolução.",
                }),
                { name: "painter", type: "text", label: "Pintor(a)" },
                localizedText({ name: "workTitle", label: "Título da obra" }),
                { name: "year", type: "text", label: "Ano" },
              ],
            },
          ],
        },
        {
          name: "inEnglish",
          label: "3 · In English",
          description:
            "Uma seção curta em inglês, dentro da página em português, com o link para o site em inglês. Escreva em inglês — este campo não é traduzido, e a seção não aparece no site em inglês, onde ela seria redundante.",
          fields: [
            { name: "heading", type: "text", label: "Título (em inglês)" },
            {
              name: "body",
              type: "textarea",
              label: "Texto (em inglês)",
              admin: {
                description:
                  'Em inglês ela é "a clinical psychologist working in the analytical-psychology tradition" — nunca "Jungian analyst", que é título protegido.',
              },
            },
            { name: "linkLabel", type: "text", label: "Rótulo do link (em inglês)" },
          ],
        },
        {
          name: "pratico",
          label: "4 · Prático",
          description:
            "Fusos, pagamento internacional, plataforma de vídeo, idiomas. Esta é a única página que fala de valores em dólar ou euro; o site nunca converte moeda.",
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
          description: "O convite final. O bilhete de quem mora fora vem de A Clínica.",
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
