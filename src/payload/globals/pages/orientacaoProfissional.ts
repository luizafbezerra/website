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
 * below is a painted crossroads, nothing symbolic of fate.
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
            "O que é o percurso, a especialização na PUC-SP e a promessa nas suas palavras.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
          ],
        },
        {
          name: "paraQuem",
          label: "2 · Para quem",
          description:
            "Primeira escolha, transição, trabalho que perdeu sentido, recomeços. É por esta porta que entram os mais jovens.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "cases",
              type: "array",
              label: "Situações",
              labels: { singular: "Situação", plural: "Situações" },
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
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
              fields: [
                { name: "numeral", type: "text", label: "Numeral" },
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            localizedTextarea({
              name: "deliverable",
              label: "O que a pessoa leva",
              description:
                "A clareza sobre a profissão que faz mais sentido no momento de vida dela.",
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
              fields: [
                localizedText({ name: "title", label: "Título", required: true }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            mediaSlot({
              name: "plate",
              label: "Prancha (encruzilhada)",
              description:
                "Se quiser um momento de arte aqui, uma encruzilhada ou labirinto pintado — nunca imagem de signos.",
            }),
          ],
        },
        {
          name: "perguntaMaisFunda",
          label: "5 · Quando a pergunta é mais funda",
          description:
            "A ponte para a análise, para quem chegou pela porta errada — e está tudo bem.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "body", label: "Texto" }),
            localizedText({ name: "linkLabel", label: "Rótulo do link para A Análise" }),
          ],
        },
        {
          name: "pratico",
          label: "6 · Prático",
          description:
            "Duração, formato on-line, idiomas. O valor vem de A Clínica — em branco, o site escreve “a combinar”.",
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
          label: "7 · Começar",
          description: "O convite final. O bilhete da orientação vem de A Clínica.",
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
