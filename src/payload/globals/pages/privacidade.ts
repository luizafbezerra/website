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
 *
 * A fifth tab beyond CONCEPT §6's four — "Quem responde por isso" — carries the
 * three facts the pre-CONCEPT draft got right and the four tabs have no home for:
 * who is responsible for a message once it arrives and how to reach them, the
 * LGPD rights sentence, and the sigilo profissional that covers the content of
 * sessions regardless of anything this page says. The first four tabs describe
 * the *site*, which keeps almost nothing; this one describes the *conversation*,
 * which is where data actually exists. Leaving it out would have made the page
 * true and incomplete at the same time.
 */
export const PagePrivacidade: GlobalConfig = {
  slug: "page-privacidade",
  label: "Privacidade",
  admin: {
    group: PAGES_GROUP,
    description:
      "Curta e honesta: o que o site guarda e o que ele nunca faz. Fica no rodapé, fora da navegação principal. O texto atual descreve o que o site tecnicamente faz — antes do lançamento, vale uma revisão jurídica.",
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
          description:
            "O começo da página: o título e três frases que já respondem tudo — o que fica no navegador de quem visita, que as estatísticas são anônimas, e por que não existe aviso de cookies.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
          ],
        },
        {
          name: "guarda",
          label: "2 · O que o site guarda",
          description:
            "Uma linha por item, e a lista é curta de propósito: a escolha de idioma, no navegador de quem visita; estatísticas de visita anônimas e agregadas.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Itens",
              labels: { singular: "Item", plural: "Itens" },
              admin: {
                description:
                  "Se o site deixar de guardar alguma destas coisas, apague o item — esta lista só vale se estiver exata.",
              },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto", required: true }),
              ],
            },
          ],
        },
        {
          name: "nuncaFaz",
          label: "3 · O que o site nunca faz",
          description:
            "Identificar, seguir, personalizar. Sem formulários, sem chatbot, sem propaganda. Esta lista é mais longa que a de cima, e é isso que o leitor vem conferir.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Itens",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto", required: true }),
              ],
            },
          ],
        },
        {
          name: "bilheteNota",
          label: "4 · Sobre o bilhete",
          description:
            "O bilhete é montado no navegador de quem escreve e só chega até você quando a pessoa envia — qual bilhete a pessoa tocou não é registrado em lugar nenhum.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "body", label: "Texto" }),
            localizedText({
              name: "linkLabel",
              label: "Rótulo do link para A primeira conversa",
              description: 'Ex.: "conhecer a primeira conversa".',
            }),
          ],
        },
        {
          name: "responsavel",
          label: "5 · Quem responde por isso",
          description:
            "As três coisas que não são sobre o site, e sim sobre a conversa: quem responde por uma mensagem que chega, o que a LGPD garante a quem escreveu, e o sigilo que cobre o conteúdo das sessões. Seu nome e o contato vêm de A Clínica — não os repita aqui.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({
              name: "body",
              label: "Texto",
              description:
                "O que acontece com a mensagem que chega: para que ela serve, o que você não faz com ela, e que a conversa em si acontece no WhatsApp, que é de terceiros.",
            }),
            localizedTextarea({
              name: "rights",
              label: "Direitos (LGPD)",
              description:
                "A frase da lei: confirmação, acesso, correção, portabilidade, exclusão, retirada do consentimento — e que basta escrever para você.",
            }),
            localizedTextarea({
              name: "confidentiality",
              label: "Sigilo profissional",
              description:
                "O conteúdo das sessões é coberto pelo sigilo do Código de Ética Profissional do Psicólogo, independentemente do que esta página diga.",
            }),
          ],
        },
      ],
    },
  ],
};
