import type { Field, GlobalConfig } from "payload";
import { WHEEL_ZODIAC } from "@/domain/wheel/wheelGeometry";
import {
  type Element,
  ZODIAC_CONTENT,
  ZODIAC_SIGN_IDS,
  type ZodiacSignId,
} from "@/domain/zodiac/zodiacContent";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * A Análise (`/analise`) — the approach page. For analysis the approach *is* the
 * product, so this page carries the pillars, her account of the method, and the
 * painted wheel that moved here from the retired `/simbolos` route.
 *
 * The 2026-08 condensation cut the page from eight bands to five, and the tabs
 * follow: the pillars moved up to section 2 (recognition before method), her five
 * verbatim paragraphs became the method section's spine (`oMetodo.body`), A visão
 * dissolved into the method's individuação note, the three titled tools collapsed
 * to one line, the ask folded into the practical band (`pratico.comecar`), and
 * the mandala closes the page after the ask — the same grammar as the Cosmos on
 * the home.
 *
 * The wheel's readings (the twelve signs' prose) are deliberately empty: the
 * wheel ships visual-only and a reading renders only in her words (REQ-007 /
 * CONCEPT §11 authorship policy). The interlocking reference data — element,
 * ruler, the nakshatra table — stays in `src/domain/zodiac/`, because it is
 * scholarly reference, not editorial voice.
 */

const ELEMENT_GROUPS: { element: Element; label: string }[] = [
  { element: "fogo", label: "Fogo" },
  { element: "terra", label: "Terra" },
  { element: "ar", label: "Ar" },
  { element: "água", label: "Água" },
];

/** The painted wheel's own labels, keyed so `ZodiacSignId` can index them. */
const SIGN_LABELS = new Map(WHEEL_ZODIAC.map((sign) => [sign.id, sign]));

const signGroup = (id: ZodiacSignId): Field => {
  const sign = SIGN_LABELS.get(id);
  return {
    name: id,
    type: "group",
    label: sign?.label ?? id,
    admin: { description: `${sign?.dateRange ?? ""} · ${ZODIAC_CONTENT[id].archetype}` },
    fields: [
      localizedTextarea({ name: "reading", label: "Leitura do signo" }),
      localizedTextarea({ name: "vedicReading", label: "Leitura védica — três mansões lunares" }),
    ],
  };
};

const signCollapsibles: Field[] = ELEMENT_GROUPS.map(({ element, label }) => ({
  type: "collapsible",
  label,
  admin: { initCollapsed: true },
  fields: ZODIAC_SIGN_IDS.filter((id) => ZODIAC_CONTENT[id].element === element).map(signGroup),
}));

export const PageAnalise: GlobalConfig = {
  slug: "page-analise",
  label: "A Análise",
  admin: {
    group: PAGES_GROUP,
    description:
      "A página da análise junguiana: o que é, como funciona, e o que as pessoas trazem.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("analise") },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── 1 Abertura ───────────────────────────────────────────────────────
        {
          name: "abertura",
          label: "1 · Abertura",
          description:
            "Espaço seguro de escuta, reflexão e transformação — e a ideia de que o sintoma tem um propósito, um chamado do inconsciente.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
          ],
        },
        // ── 2 O que as pessoas trazem ────────────────────────────────────────
        {
          name: "oQueTrazem",
          label: "2 · O que as pessoas trazem",
          description:
            "Os três pilares por inteiro, e a linha que encaminha quem pergunta “qual profissão” para a orientação profissional.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "note", label: "Nota das frentes" }),
            {
              name: "pillars",
              type: "array",
              label: "Pilares",
              labels: { singular: "Pilar", plural: "Pilares" },
              fields: [
                {
                  name: "numeral",
                  type: "text",
                  label: "Numeral",
                  admin: { description: "I, II, III." },
                },
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "text", label: "Texto" }),
              ],
            },
            localizedTextarea({
              name: "boundary",
              label: "Linha de fronteira",
              description: "A ponte para a orientação profissional.",
            }),
            localizedText({
              name: "linkLabel",
              label: "Rótulo do link para a orientação",
              description: 'Ex.: "conhecer a orientação profissional e de carreira".',
            }),
          ],
        },
        // ── 3 Como o trabalho acontece ───────────────────────────────────────
        {
          name: "oMetodo",
          label: "3 · Como o trabalho acontece",
          description:
            "As suas cinco parágrafos sobre como o trabalho acontece, a linha das ferramentas simbólicas e a nota sobre individuação — descrita, nunca prometida.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({
              name: "body",
              label: "Texto",
              description: "O seu texto sobre como o trabalho acontece — a espinha da seção.",
            }),
            localizedTextarea({
              name: "toolsLine",
              label: "Linha das ferramentas",
              description:
                "Uma frase nomeando o material simbólico: os sonhos, as imagens do dia a dia, os padrões que se repetem.",
            }),
            localizedRichText({
              name: "individuacao",
              label: "Nota sobre individuação",
              description:
                "A pessoa inteira e a individuação. Descreva o conceito — nunca como resultado prometido a quem lê.",
            }),
            localizedTextarea({
              name: "closingLine",
              label: "Linha de fechamento",
              description: 'A frase que encerra a seção. Ex.: "É um trabalho de colaboração."',
            }),
            {
              name: "plate",
              type: "group",
              label: "A pintura desta página",
              admin: {
                description:
                  "Uma pintura ao lado da ideia de individuação — a imagem que amplia o texto, não que o decora. Domínio público, com proveniência verificada.",
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
        // ── 4 Sonho ampliado ─────────────────────────────────────────────────
        {
          name: "sonhoAmpliado",
          label: "4 · Sonho ampliado",
          description:
            "A amplificação demonstrada: um motivo de sonho e três paralelos ao lado dele — um detalhe de pintura, um mito em uma linha, uma passagem de Jung. Só entra no ar com as suas palavras.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({
              name: "intro",
              label: "O que é amplificação",
              description:
                "Uma ou duas frases sobre o gesto de pôr uma imagem ao lado das suas parentes. É o que a seção diz enquanto os paralelos ainda estão sendo escolhidos.",
            }),
            localizedTextarea({
              name: "motif",
              label: "O motivo do sonho",
              description:
                'O sonho entre aspas, como alguém o contaria. Ex.: "sonhei que encontrava um cômodo desconhecido na minha casa". Apagar este campo esconde a seção inteira do site.',
            }),
            {
              name: "parallels",
              type: "array",
              label: "Paralelos",
              labels: { singular: "Paralelo", plural: "Paralelos" },
              admin: {
                description:
                  "Três: uma pintura, um mito, uma passagem. Cada paralelo só aparece no site quando tiver texto ou imagem — um rótulo sozinho fica invisível.",
              },
              fields: [
                localizedText({ name: "label", label: "Rótulo" }),
                localizedTextarea({ name: "text", label: "Texto" }),
                mediaSlot({
                  name: "image",
                  label: "Imagem",
                  description: "Um detalhe de pintura, quando o paralelo for visual.",
                }),
                { name: "painter", type: "text", label: "Pintor(a)" },
                localizedText({ name: "workTitle", label: "Título da obra" }),
                { name: "year", type: "text", label: "Ano" },
              ],
            },
            localizedTextarea({ name: "closingLine", label: "Sua linha final" }),
          ],
        },
        // ── 5 Na prática ─────────────────────────────────────────────────────
        {
          name: "pratico",
          label: "5 · Na prática",
          description:
            "Semanal, on-line, português e inglês, Brasil e exterior — e o convite final, que fecha esta seção. O valor vem de A Clínica; em branco, o site escreve “a combinar”.",
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
              label: "Para começar",
              admin: {
                description: "O convite que fecha a seção. O bilhete da análise vem de A Clínica.",
              },
              fields: [
                localizedTextarea({ name: "body", label: "Texto" }),
                localizedText({ name: "linkLabel", label: "Rótulo do link" }),
              ],
            },
          ],
        },
        // ── 6 A mandala ──────────────────────────────────────────────────────
        {
          name: "mandala",
          label: "6 · A mandala",
          description:
            "A roda pintada fecha a página, depois do convite — o momento de encantamento. Ela é visual: cada leitura abaixo só aparece no site depois que você a escrever. Enquanto estiverem em branco, a roda fala apenas pela imagem.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedTextarea({ name: "intro", label: "Introdução" }),
            ...signCollapsibles,
          ],
        },
      ],
    },
  ],
};
