import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText, localizedTextarea } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Início (`/`) — the eleven sections of CONCEPT §6, in scroll order. The page's
 * job: decide in one scroll that she is my person, and which of the two doors is
 * mine.
 *
 * The lockup, the credential facts, the WhatsApp number and the Jung passage
 * pool are not here — they are cross-page facts and live in "A Clínica".
 */
export const PageInicio: GlobalConfig = {
  slug: "page-inicio",
  label: "Início",
  admin: {
    group: PAGES_GROUP,
    description: "A página inicial, seção por seção, na ordem em que a pessoa desce a tela.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("inicio") },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── 1 Hero ───────────────────────────────────────────────────────────
        {
          name: "hero",
          label: "1 · Hero",
          description:
            "A primeira tela. O nome da clínica, a sua frase de posicionamento e o seu retrato vêm de A Clínica e do retrato abaixo; aqui você escreve a abertura.",
          fields: [
            localizedRichText({
              name: "lead",
              label: "Parágrafo de abertura",
              description: "Duas ou três frases suas, no tom de quem recebe.",
            }),
            localizedText({
              name: "ctaPrimaryLabel",
              label: "Botão principal",
              description: 'Ex.: "conversar pelo WhatsApp".',
            }),
            localizedText({
              name: "ctaSecondaryLabel",
              label: "Link secundário",
              description: "Leva à página da primeira conversa.",
            }),
            mediaSlot({
              name: "portrait",
              label: "Retrato",
              description: "O seu retrato — luz natural, fundo calmo, enquadramento editorial.",
            }),
          ],
        },
        // ── 2 Credencial ─────────────────────────────────────────────────────
        // No tab: the credential strip appears on every core page (CONCEPT §8.8),
        // so it is stored once in A Clínica → Identidade → Credenciais. A copy
        // here would drift the moment she edited one of the two.
        //
        // ── 3 Instagram ──────────────────────────────────────────────────────
        {
          name: "instagram",
          label: "3 · Instagram",
          description:
            "A ponte com o seu mundo. Cada peça mostra o quadrado que os seguidores conhecem e abre para a pintura inteira. Enquanto as imagens não existirem, o site mostra quadros reservados com legenda.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedTextarea({ name: "intro", label: "Introdução" }),
            {
              name: "tiles",
              type: "array",
              label: "Peças",
              labels: { singular: "Peça", plural: "Peças" },
              admin: {
                description:
                  "De quatro a seis das suas publicações favoritas. O recorte é o que a pessoa já viu no feed; a pintura inteira é a revelação.",
              },
              fields: [
                mediaSlot({
                  name: "crop",
                  label: "Recorte (quadrado)",
                  description: "O quadrado como ele aparece no Instagram.",
                }),
                mediaSlot({
                  name: "full",
                  label: "Pintura inteira",
                  description: "A tela completa, de onde o recorte saiu.",
                }),
                { name: "painter", type: "text", label: "Pintor" },
                localizedText({ name: "workTitle", label: "Título da obra" }),
                { name: "year", type: "text", label: "Ano" },
                localizedTextarea({
                  name: "passage",
                  label: "Passagem que você pareou",
                  description: "A citação de Jung que acompanhou a publicação.",
                }),
                { name: "postUrl", type: "text", label: "Link da publicação" },
              ],
            },
          ],
        },
        // ── 4 Dois caminhos ──────────────────────────────────────────────────
        {
          name: "doisCaminhos",
          label: "4 · Dois caminhos",
          description:
            "As duas portas, lado a lado, e a frase que diz qual é de quem: sentido do trabalho → análise; qual profissão → orientação.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedTextarea({ name: "intro", label: "Introdução" }),
            {
              name: "analysis",
              type: "group",
              label: "Porta — Análise",
              fields: [
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "body", label: "Texto" }),
                localizedText({ name: "linkLabel", label: "Rótulo do link" }),
              ],
            },
            {
              name: "careerGuidance",
              type: "group",
              label: "Porta — Orientação profissional",
              fields: [
                localizedText({ name: "title", label: "Título" }),
                localizedTextarea({ name: "body", label: "Texto" }),
                localizedText({ name: "linkLabel", label: "Rótulo do link" }),
              ],
            },
            localizedTextarea({
              name: "boundary",
              label: "Frase de fronteira",
              description: "A frase que encaminha a pessoa para uma porta ou para a outra.",
            }),
          ],
        },
        // ── 5 O sintoma como chamado ─────────────────────────────────────────
        {
          name: "oSintoma",
          label: "5 · O sintoma como chamado",
          description:
            "O resumo da abordagem: o sintoma tem um propósito. A passagem de Jung que aparece aqui vem do conjunto em A Clínica.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedRichText({ name: "body", label: "Texto" }),
            localizedText({ name: "linkLabel", label: "Rótulo do link para A Análise" }),
          ],
        },
        // ── 6 Cosmos / A Lâmina ──────────────────────────────────────────────
        {
          name: "cosmos",
          label: "6 · Cosmos",
          description:
            "O momento de encantamento da página. No computador, o céu; no telefone, uma pintura sua percorrida de perto (A Lâmina) — nunca um espaço vazio.",
          fields: [
            localizedTextarea({
              name: "caption",
              label: "Legenda do Cosmos",
              description: "A nota à margem que acompanha o céu.",
            }),
            {
              name: "lamina",
              type: "group",
              label: "A Lâmina (telefone)",
              admin: {
                description:
                  "Uma pintura só sua, percorrida de cima a baixo quase em tamanho real, terminando na tela inteira.",
              },
              fields: [
                mediaSlot({
                  name: "plate",
                  label: "Pintura",
                  description: "Uma tela em alta resolução, domínio público verificado.",
                }),
                { name: "painter", type: "text", label: "Pintor" },
                localizedText({ name: "workTitle", label: "Título da obra" }),
                { name: "year", type: "text", label: "Ano" },
                {
                  name: "captions",
                  type: "array",
                  label: "Legendas do percurso",
                  labels: { singular: "Legenda", plural: "Legendas" },
                  admin: { description: "Duas ou três, cada uma para um detalhe da pintura." },
                  fields: [localizedText({ name: "text", label: "Legenda", required: true })],
                },
                localizedTextarea({
                  name: "closingLine",
                  label: "Sua linha final",
                  description: "Uma frase sua, quando a pintura aparece inteira.",
                }),
              ],
            },
          ],
        },
        // ── 7 Sobre (resumo) ─────────────────────────────────────────────────
        {
          name: "sobreDigest",
          label: "7 · Sobre (resumo)",
          description:
            "Quatro linhas e o gancho da história de origem — o suficiente para querer clicar em Sobre.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedRichText({ name: "body", label: "Texto" }),
            localizedText({ name: "linkLabel", label: "Rótulo do link para Sobre" }),
          ],
        },
        // ── 8 Brasil e exterior ──────────────────────────────────────────────
        {
          name: "brasilExterior",
          label: "8 · Brasil e exterior",
          description:
            "Uma faixa curta: Portugal, Inglaterra, Estados Unidos, português e inglês. Quem mora fora precisa se reconhecer aqui.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedTextarea({ name: "body", label: "Texto" }),
            localizedText({ name: "linkLabel", label: "Rótulo do link" }),
          ],
        },
        // ── 9 Como é começar ─────────────────────────────────────────────────
        {
          name: "comoComecar",
          label: "9 · Como é começar",
          description: "Três tempos, cerca de oitenta palavras no total.",
          fields: [
            localizedText({ name: "heading", label: "Título da seção" }),
            {
              name: "beats",
              type: "array",
              label: "Tempos",
              labels: { singular: "Tempo", plural: "Tempos" },
              fields: [
                {
                  name: "numeral",
                  type: "text",
                  label: "Numeral",
                  admin: { description: "I, II, III." },
                },
                localizedTextarea({ name: "text", label: "Texto", required: true }),
              ],
            },
            localizedText({ name: "linkLabel", label: "Rótulo do link" }),
          ],
        },
        // ── 10 Vozes ─────────────────────────────────────────────────────────
        {
          name: "vozes",
          label: "10 · Vozes",
          description:
            "Só o título. Os depoimentos ficam em Conteúdo → Depoimentos, e aparecem apenas com consentimento registrado; sem nenhum, a seção não existe.",
          fields: [localizedText({ name: "heading", label: "Título da seção" })],
        },
        // ── 11 Contato ───────────────────────────────────────────────────────
        {
          name: "contato",
          label: "11 · Contato",
          description:
            "O fecho da página. WhatsApp, e-mail, estado de disponibilidade e tempo de resposta vêm de A Clínica.",
          fields: [
            localizedText({ name: "eyebrow", label: "Sobrescrito" }),
            localizedText({ name: "heading", label: "Título da seção" }),
            localizedRichText({ name: "body", label: "Texto" }),
            localizedText({ name: "whatsappLabel", label: "Rótulo do botão WhatsApp" }),
          ],
        },
      ],
    },
  ],
};
