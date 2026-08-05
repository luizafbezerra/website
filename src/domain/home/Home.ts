import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import { type SectionConfig, SECTIONS_DEFAULT } from "@/domain/sections/sectionRegistry";
import { type NavLink, NAV_EXTRA_LINKS_DEFAULT } from "@/domain/site/NavLink";

// ---------------------------------------------------------------------------
// The homepage's structure (section order + toggles), navigation links, and
// editable section copy. The copy lives across one small Payload global per
// section (all grouped under "Página inicial") instead of one monolithic
// document; this is the single `Home` shape the page + components consume.
//
// Each accent heading is a single constrained rich-text field (the editor marks
// the accent word in bold); the locked colour/italic per section lives in
// `view/styling/accentHeading.ts`. The painted-asset captions (Quaternidade,
// squared-mandala marginalia) and the Cosmos section's copy stay in code.
// ---------------------------------------------------------------------------

export type PillarItem = { numeral: string; title: string; paragraph: string };

export type Home = {
  sections: SectionConfig[];
  navExtraLinks: NavLink[];
  hero: {
    subtitle: string;
    lead: RichTextContent;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    portraitUrl: string | null;
  };
  pillars: {
    eyebrow: string;
    heading: RichTextContent;
    intro: RichTextContent;
    note: string;
    items: PillarItem[];
  };
  about: {
    heading: RichTextContent;
    bio: RichTextContent;
    formacao: string;
    idiomas: string;
  };
  voices: { heading: string };
  contact: {
    eyebrow: string;
    heading: RichTextContent;
    body: RichTextContent;
    whatsappLabel: string;
    faqLinkLabel: string;
  };
};

export const HOME_DEFAULTS: Home = {
  sections: SECTIONS_DEFAULT,
  navExtraLinks: NAV_EXTRA_LINKS_DEFAULT,
  hero: {
    subtitle: "Para a vida adulta",
    lead: richText([
      [
        {
          text: "Atendo adultos em momentos em que a vida cotidiana já não dá conta do que está acontecendo: uma ",
        },
        { text: "ansiedade", italic: true },
        { text: " que não passa, um " },
        { text: "luto", italic: true },
        {
          text: " recente, um trabalho que perdeu o sentido. Escuto o que insiste e o que ainda não encontrou palavras.",
        },
      ],
    ]),
    ctaPrimaryLabel: "marcar uma conversa",
    ctaSecondaryLabel: "conhecer a abordagem antes",
    portraitUrl: null,
  },
  pillars: {
    eyebrow: "Como trabalho",
    heading: richText([
      [
        { text: "O que se repete costuma ter algo " },
        { text: "a dizer", bold: true },
        { text: "." },
      ],
    ]),
    // Her own rewrite, restored verbatim from `docs/content-export-2026-08.md`:
    // it lived only in the database, and the destructive migration of TASK-026
    // would otherwise have dropped it. It seeds the `page-analise` global too.
    intro: richText([
      "Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
      "Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.",
      "Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.",
      "Gosto de dizer que a psicologia clínica é o trabalho mais “anti capitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros são ditados pelo paciente, de acordo com aquilo que ele está preparado para trazer.",
      "Eu só farei pontuações daquilo que acredito que você esteja preparado para receber, respeitando o tempo do seu processo e a sua subjetividade. Não existe pressa no processo de individuação.",
    ]),
    note: "Três frentes que costumam trazer alguém para a análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
    items: [
      {
        numeral: "I",
        title: "Ansiedade & humor",
        paragraph:
          "Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados querem dizer.",
      },
      {
        numeral: "II",
        title: "Relações & vida",
        paragraph:
          "Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar para dentro e distinguir o que é nosso do que é do outro.",
      },
      {
        numeral: "III",
        title: "Carreira & propósito",
        paragraph:
          "Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.",
      },
    ],
  },
  about: {
    heading: richText([
      [
        { text: "Uma escuta cuidadosa, na tradição " },
        { text: "junguiana", bold: true },
        { text: "." },
      ],
    ]),
    bio: richText([
      "Sou psicóloga clínica. Atendo adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.",
      "As primeiras sessões servem para vermos juntos se podemos seguir.",
    ]),
    formacao: "Psicologia clínica",
    idiomas: "Português",
  },
  voices: { heading: "Pacientes contam" },
  contact: {
    eyebrow: "Para começar",
    heading: richText([
      [
        { text: "Uma conversa breve costuma ser " },
        { text: "o suficiente", bold: true },
        { text: " para vermos se faz sentido." },
      ],
    ]),
    body: richText([
      "O caminho mais simples é o WhatsApp. Você me escreve uma mensagem curta (não precisa contar tudo de uma vez) e combinamos um horário para uma primeira conversa, sem compromisso. A partir dela decidimos juntos como seguir.",
    ]),
    whatsappLabel: "Conversar pelo WhatsApp",
    faqLinkLabel: "Perguntas frequentes antes da primeira conversa",
  },
};
