import type { GlobalConfig } from "payload";
import { FAQ_CATEGORIES } from "@/domain/faq/FaqCategory";
import { faqCategoryLabel } from "../../faqCategories";
import { localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Perguntas (`/perguntas`) — resolve the one specific doubt stopping me from
 * writing. The questions themselves are rows in Conteúdo → Perguntas frequentes,
 * one per doubt; this global holds only the page's opening, the four category
 * headings — generated from the same category list the collection validates
 * against, so a section and its questions can never disagree — the page's
 * painting, and the closing hand-off.
 *
 * **The two FAQ surfaces, and how they stay apart.** A primeira conversa carries
 * its own mini-FAQ of four short doubts, and the two can drift into answering the
 * same question differently. The rule, written here because this is the surface
 * that owns the subject: *this* page answers the question somebody would type
 * into a search box, at reference length; the mini-FAQ answers the doubt that
 * stops somebody on the threshold, in two sentences, and never repeats a question
 * from this page. Same facts, two registers.
 *
 * There is no `eyebrow` above the opening. DESIGN §6 names a tracked-caps kicker
 * over a heading as scaffolding rather than voice, and this page already stacks
 * one `h1` over four `h2`s: a fifth orienting line before the first would say
 * nothing the title does not.
 */
export const PagePerguntas: GlobalConfig = {
  slug: "page-perguntas",
  label: "Perguntas",
  admin: {
    group: PAGES_GROUP,
    description:
      "A abertura da página, os títulos das quatro seções, a pintura e o fecho. As perguntas ficam em Conteúdo → Perguntas frequentes.",
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
          description:
            "O começo da página: o título e as primeiras linhas, que já dizem de que se trata — quais serviços, em que formato, em que idiomas e de onde a pessoa pode estar.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({
              name: "intro",
              label: "Primeiras linhas",
              description:
                "Duas ou três frases. Um parágrafo só: as respostas são o conteúdo da página, e a abertura só precisa situar quem chegou.",
            }),
          ],
        },
        {
          name: "sections",
          label: "Seções",
          description:
            "Um título e, se quiser, uma linha de introdução para cada uma das quatro seções. Uma seção sem nenhuma pergunta não aparece na página.",
          fields: FAQ_CATEGORIES.map((category) => ({
            name: category,
            type: "group" as const,
            label: faqCategoryLabel(category),
            fields: [
              localizedText({ name: "heading", label: "Título" }),
              localizedTextarea({
                name: "intro",
                label: "Introdução",
                description: "Opcional. Em branco, a seção começa direto nas perguntas.",
              }),
            ],
          })),
        },
        {
          name: "plate",
          label: "A pintura",
          description:
            "Uma pintura ao fim das perguntas — o respiro depois da última resposta, antes do convite para escrever. Domínio público, com proveniência verificada.",
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
        {
          name: "fecho",
          label: "Fecho",
          description:
            "O fim da página, para quem não encontrou a sua pergunta: uma linha sua e os dois caminhos — o WhatsApp e a página da primeira conversa. Aqui não entra botão: esta é uma página de consulta, e o convite fica no tom da margem.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "body", label: "Texto" }),
            localizedText({
              name: "whatsappLabel",
              label: "Rótulo do link do WhatsApp",
              description: 'Ex.: "escrever no WhatsApp".',
            }),
            localizedText({
              name: "linkLabel",
              label: "Rótulo do link para A primeira conversa",
            }),
          ],
        },
      ],
    },
  ],
};
