import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Orientação profissional e de carreira (`/orientacao-profissional`) — the
 * bounded program, and the site's strongest non-brand search asset. Its buyer is
 * comparing against coaches and loose vocational tests, so the honest comparison
 * section carries the page.
 *
 * No zodiac imagery anywhere on this page (CONCEPT §6 note / CON-006): a wheel
 * beside psychological tests would read as predictive assessment. The art slot
 * below is a painted crossroads, nothing symbolic of fate. It is also the reason
 * this page carries no wow set-piece at all — PAT-002 asks for *at most* one, and
 * the only set-piece the page's own vocabulary suggests is the forbidden one.
 *
 * Section 1 is the page's opening as well as its first CONCEPT §6 section, so
 * unlike `page-primeira-conversa` this global needed no extra `abertura` tab: the
 * `h1` and the front-loaded lead are `abertura.heading` and `abertura.body`.
 *
 * The 2026-08 condensation cut the page from eight bands to five, and the tabs
 * follow: the four situations became one line each, the bridge to análise folded
 * into "nem coaching" as its closing paragraph (`nemCoaching.bridge`), and the
 * ask folded into the practical band (`pratico.comecar`).
 */
export const PageOrientacaoProfissional: GlobalConfig = {
  slug: "page-orientacao-profissional",
  label: "Orientação profissional",
  admin: {
    group: PAGES_GROUP,
    description:
      "A página do percurso de orientação profissional e de carreira — o programa com começo, meio e fim.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("orientacaoProfissional") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "1 · Abertura",
          description:
            "O que é o percurso, a especialização na PUC-SP e a promessa nas suas palavras. É também a abertura da página: o título aqui é o título da página inteira.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({
              name: "body",
              label: "Primeiras linhas",
              description:
                "Duas ou três frases que já respondem tudo: o que é, quem conduz, quantos encontros, em que formato, em que idiomas, de onde a pessoa pode estar e com o que ela sai. Quem lê só isto já foi respondido.",
            }),
          ],
        },
        {
          name: "paraQuem",
          label: "2 · Para quem",
          description:
            "Primeira escolha, transição, trabalho que perdeu sentido, recomeços — uma linha por situação. É por esta porta que entram os mais jovens.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "cases",
              type: "array",
              label: "Situações",
              labels: { singular: "Situação", plural: "Situações" },
              admin: {
                description: "Uma linha por situação, direta — o leitor encontra a sua e segue.",
              },
              fields: [localizedTextarea({ name: "text", label: "Texto", required: true })],
            },
          ],
        },
        {
          name: "oPercurso",
          label: "3 · O percurso",
          description:
            "Até doze encontros semanais on-line: testes, conversas e atividades propostas — e com o que a pessoa sai no fim.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            {
              name: "steps",
              type: "array",
              label: "Etapas",
              labels: { singular: "Etapa", plural: "Etapas" },
              admin: {
                description:
                  "Os movimentos por onde o trabalho passa, em ordem. Não são as doze sessões: são as etapas do percurso.",
              },
              fields: [
                {
                  name: "numeral",
                  type: "text",
                  label: "Numeral",
                  admin: { description: "I, II, III… Em branco, o site numera pela ordem." },
                },
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            localizedTextarea({
              name: "deliverable",
              label: "O que a pessoa leva",
              description:
                "O que a pessoa leva além da resposta: entender como chegou até ela. A clareza sobre a profissão já é prometida na abertura da página, então aqui não se repete. Aparece destacado no fim da seção.",
            }),
          ],
        },
        {
          name: "nemCoaching",
          label: "4 · Nem coaching, nem teste solto",
          description:
            "A comparação honesta: uma psicóloga registrada, testes dentro de um processo psicológico conduzido, vocação lida em profundidade. É aqui que a página se decide.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            {
              name: "distinctions",
              type: "array",
              label: "Distinções",
              labels: { singular: "Distinção", plural: "Distinções" },
              admin: {
                description:
                  "Uma por distinção: o que você faz, afirmado — nada aqui precisa dizer o que os outros deixam de fazer. O título abre o parágrafo, rubricado, então escreva-o já com o ponto final.",
              },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            localizedTextarea({
              name: "anchor",
              label: "A frase sobre vocação",
              description:
                "A única frase de psicologia analítica da página: a vocação como uma das portas da individuação. Uma ou duas linhas. Em branco, não aparece.",
            }),
            {
              name: "bridge",
              type: "group",
              label: "Quando a pergunta é mais funda",
              admin: {
                description:
                  "A ponte para a análise, fechando esta seção — para quem chegou pela porta errada, e está tudo bem.",
              },
              fields: [
                localizedTextarea({ name: "body", label: "Texto" }),
                localizedText({ name: "linkLabel", label: "Rótulo do link para A Análise" }),
              ],
            },
            {
              name: "plate",
              type: "group",
              label: "A pintura desta página",
              admin: {
                description:
                  "Uma encruzilhada ou um labirinto pintado, fechando esta seção — nunca imagem de signos (uma roda ao lado de testes psicológicos leria como previsão). Domínio público, com proveniência verificada.",
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
          name: "pratico",
          label: "5 · Na prática",
          description:
            "Duração, formato on-line, idiomas, de onde — e o convite final, que fecha esta seção. O valor vem de A Clínica; em branco, o site escreve “a combinar”, e aqui aparece só o valor da orientação, nunca o da análise ao lado.",
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
              name: "comecar",
              type: "group",
              label: "Começar",
              admin: {
                description:
                  "O convite que fecha a seção. O bilhete da orientação vem de A Clínica.",
              },
              fields: [
                localizedTextarea({ name: "body", label: "Texto" }),
                localizedText({ name: "linkLabel", label: "Rótulo do link" }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
