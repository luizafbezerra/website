import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * A primeira conversa (`/primeira-conversa`) — the threshold page: know exactly
 * what happens when I write, and write.
 *
 * The 2026-08 condensation cut the page from seven bands to four, and the tabs
 * follow: the steps went from five tempos to four (the day-of beat merged into
 * scheduling), the three permissions became the steps band's coda
 * (`passoAPasso.permissoes`), and the mini-FAQ shrank to the doubts the page has
 * not already answered, folded into the combinado band (`logistica.doubts`).
 *
 * The four note openers themselves live in A Clínica (they are quoted on more
 * than one page); this page holds only how they are introduced.
 */
export const PagePrimeiraConversa: GlobalConfig = {
  slug: "page-primeira-conversa",
  label: "A primeira conversa",
  admin: {
    group: PAGES_GROUP,
    description:
      "A página que atravessa a soleira: o que acontece quando a pessoa escreve, passo a passo.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("primeiraConversa") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "Abertura",
          description:
            "O começo da página: o título e as primeiras linhas, que já respondem o que acontece quando alguém escreve — para leitores e para buscadores.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({
              name: "lead",
              label: "Primeiras linhas",
              description:
                "Duas ou três frases: o que acontece quando a pessoa escreve, quanto tempo dura, em que idiomas e de onde ela pode estar.",
            }),
          ],
        },
        {
          name: "passoAPasso",
          label: "1 · Como acontece",
          description:
            "Quatro tempos, I a IV: a mensagem, o agendamento, os cinquenta minutos, o que se decide depois — e as três permissões fechando a seção.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "steps",
              type: "array",
              label: "Passos",
              labels: { singular: "Passo", plural: "Passos" },
              admin: {
                description:
                  "Só a logística de cada tempo: as garantias moram nas permissões abaixo, uma vez só.",
              },
              fields: [
                {
                  name: "numeral",
                  type: "text",
                  label: "Numeral",
                  admin: { description: "I a IV." },
                },
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            {
              name: "permissoes",
              type: "group",
              label: "Permissões",
              admin: {
                description:
                  "Não precisa preparar nada, não precisa saber nomear o que sente, não existe assunto pequeno demais. Uma linha por permissão — elas fecham a seção, com a pintura.",
              },
              fields: [
                {
                  name: "items",
                  type: "array",
                  label: "Permissões",
                  labels: { singular: "Permissão", plural: "Permissões" },
                  fields: [localizedTextarea({ name: "text", label: "Texto", required: true })],
                },
                {
                  name: "plate",
                  type: "group",
                  label: "A pintura desta página",
                  admin: {
                    description:
                      "Uma pintura, depois das permissões — o respiro da página, antes das informações práticas. Domínio público, com proveniência verificada.",
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
          ],
        },
        {
          name: "logistica",
          label: "2 · O combinado",
          description:
            "Duração, plataforma, remarcação, fuso, idiomas — e as dúvidas de soleira que as seções acima não respondem. O valor vem de A Clínica; em branco, o site escreve “a combinar”.",
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
            {
              name: "doubts",
              type: "array",
              label: "Dúvidas de soleira",
              labels: { singular: "Dúvida", plural: "Dúvidas" },
              admin: {
                description:
                  "Só as dúvidas que o resto da página ainda não respondeu; as outras moram em Perguntas, a um link daqui.",
              },
              fields: [
                localizedText({ name: "question", label: "Pergunta", required: true }),
                localizedTextarea({ name: "answer", label: "Resposta" }),
              ],
            },
            localizedText({ name: "linkLabel", label: "Rótulo do link para Perguntas" }),
          ],
        },
        {
          name: "bilhete",
          label: "3 · O bilhete",
          description:
            "A pessoa toca um bilhete já escrito e ele vai para o seu WhatsApp. Os quatro textos estão em A Clínica → Bilhetes; aqui fica só a apresentação.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "intro", label: "Introdução" }),
            localizedText({
              name: "chooseLabel",
              label: "Rótulo da escolha",
              description: 'Ex.: "escolha por onde começar".',
            }),
          ],
        },
      ],
    },
  ],
};
