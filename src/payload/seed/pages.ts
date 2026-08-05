import type { Payload } from "payload";
import { INICIO_DEFAULTS } from "@/domain/inicio/Inicio";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import type { PageInicio } from "@/payload-types";

/**
 * Seed the page globals with the copy that already exists (TASK-026).
 *
 * Only three pages get anything: her words are carried from where they lived on
 * the old single-page site to the section that owns them in the eight-page map.
 * The other five globals stay empty on purpose — inventing prose in her name
 * would break the authorship policy (CONCEPT §11), and each field's admin
 * description already says what belongs there. The wheel's twelve readings stay
 * empty for the same reason (REQ-007): the wheel ships visual-only.
 *
 * Início seeds from `INICIO_DEFAULTS`, the same values the page falls back to,
 * so a seeded row and the code fallback start from one source of truth. Análise
 * and Sobre carry their copy as literals here, because this file is the source
 * of their pt defaults and nothing else holds them any more: their own page
 * defaults land with their pages in TASK-037 and TASK-039.
 *
 * Portuguese only. English falls back to Portuguese through Payload's
 * `fallback: true` until her polish pass (RISK-001).
 */

// Every richText field across the page globals shares the same Lexical editor
// shape; one cast bridges our structural RichTextContent to it.
type Lexical = NonNullable<NonNullable<PageInicio["hero"]>["lead"]>;
const rt = (content: RichTextContent): Lexical => content as unknown as Lexical;

/**
 * Her own rewrite of the pillars intro, restored verbatim from
 * `docs/content-export-2026-08.md`. It existed only in the database, and the
 * destructive migration of TASK-026 would have dropped it — this is now the only
 * copy in the repository, so treat it as content, not as code.
 */
const PILLARS_INTRO = richText([
  "Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
  "Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.",
  "Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.",
  "Gosto de dizer que a psicologia clínica é o trabalho mais “anti capitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros são ditados pelo paciente, de acordo com aquilo que ele está preparado para trazer.",
  "Eu só farei pontuações daquilo que acredito que você esteja preparado para receber, respeitando o tempo do seu processo e a sua subjetividade. Não existe pressa no processo de individuação.",
]);

/** The three themes of CONCEPT §4's first door, as she wrote them. */
const PILLARS = [
  {
    numeral: "I",
    title: "Ansiedade & humor",
    text: "Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados querem dizer.",
  },
  {
    numeral: "II",
    title: "Relações & vida",
    text: "Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar para dentro e distinguir o que é nosso do que é do outro.",
  },
  {
    numeral: "III",
    title: "Carreira & propósito",
    text: "Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.",
  },
];

/** Her bio, from the old home's "sobre" digest. */
const BIO = richText([
  "Sou psicóloga clínica. Atendo adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
  "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.",
  "As primeiras sessões servem para vermos juntos se podemos seguir.",
]);

export async function seedPages(payload: Payload): Promise<void> {
  const shared = { locale: "pt", overrideAccess: true, context: { skipRevalidate: true } } as const;
  const inicio = INICIO_DEFAULTS;

  // Início — every section that carries copy, from the page's own defaults.
  await payload.updateGlobal({
    ...shared,
    slug: "page-inicio",
    data: {
      hero: {
        lead: rt(inicio.hero.lead),
        ctaPrimaryLabel: inicio.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: inicio.hero.ctaSecondaryLabel,
      },
      instagram: { heading: inicio.instagram.heading, intro: inicio.instagram.intro },
      doisCaminhos: {
        heading: inicio.doisCaminhos.heading,
        analysis: inicio.doisCaminhos.analysis,
        careerGuidance: inicio.doisCaminhos.careerGuidance,
        boundary: inicio.doisCaminhos.boundary,
      },
      oSintoma: {
        heading: inicio.oSintoma.heading,
        body: rt(inicio.oSintoma.body),
        linkLabel: inicio.oSintoma.linkLabel,
      },
      sobreDigest: {
        heading: inicio.sobreDigest.heading,
        body: rt(inicio.sobreDigest.body),
        linkLabel: inicio.sobreDigest.linkLabel,
      },
      brasilExterior: {
        heading: inicio.brasilExterior.heading,
        body: inicio.brasilExterior.body,
        linkLabel: inicio.brasilExterior.linkLabel,
      },
      comoComecar: {
        heading: inicio.comoComecar.heading,
        beats: inicio.comoComecar.beats,
        linkLabel: inicio.comoComecar.linkLabel,
      },
      vozes: { heading: inicio.vozes.heading },
      contato: {
        eyebrow: inicio.contato.eyebrow,
        heading: inicio.contato.heading,
        body: rt(inicio.contato.body),
        whatsappLabel: inicio.contato.whatsappLabel,
      },
    },
  });

  // A Análise — the three pillars and the intro she rewrote herself.
  await payload.updateGlobal({
    ...shared,
    slug: "page-analise",
    data: {
      oQueTrazem: {
        heading: "O que se repete costuma ter algo a dizer.",
        intro: rt(PILLARS_INTRO),
        note: "Três frentes que costumam trazer alguém para a análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
        pillars: PILLARS,
      },
    },
  });

  // Sobre — her bio moves from the home digest to the page that owns it.
  await payload.updateGlobal({
    ...shared,
    slug: "page-sobre",
    data: {
      quemE: { heading: "Uma escuta cuidadosa, na tradição junguiana.", body: rt(BIO) },
    },
  });

  payload.logger.info("  ✓ page globals (início, análise, sobre)");
}
