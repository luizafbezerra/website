import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// Orientação profissional e de carreira (`/orientacao-profissional`) — the seven
// sections of CONCEPT §6, as the page and its components consume them. One member
// per tab in `page-orientacao-profissional`, so a field's admin path and its
// render path read the same. Section 1 is both the page's opening and its first
// CONCEPT section, which is why this page needed no extra `abertura` tab.
//
// ORIENTACAO_PROFISSIONAL_DEFAULTS is what renders when Payload is off or a field
// is blank, and it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** All of it is a *draft*. This page has never
// existed — not on the old Google Sites page, not in the pre-CONCEPT site — so
// unlike Início there is no supplied text to carry across and nothing of hers
// survives for it. Every draft states only facts CONCEPT §4/§6 and PRODUCT already
// fix: the bounded programme (up to twelve weekly online meetings), her PUC-SP
// training in orientação profissional, psychological tests + conversations +
// proposed activities, the deliverable ("a profissão que faz mais sentido no
// momento atual da sua vida"), the four situations that bring someone here, the
// boundary with análise (§4: sentido do trabalho → análise · qual profissão →
// orientação), and the reach and languages (§2, §8.9).
//
// Two things are deliberately *not* drafted anywhere here, because inventing them
// would be inventing product: **a price** (it lives in A Clínica and prints "a
// combinar" until she sets it) and **any test instrument named**. The drafts say
// "testes psicológicos" and nothing more specific.
//
// Two drafts are claims rather than descriptions and need her confirmation
// specifically (both flagged for TASK-052 alongside the rest):
//   1. that psychological tests may only be administered and interpreted by a
//      psychologist — true of Brazilian practice, but a claim in her name about her
//      profession's rules;
//   2. the word for her PUC-SP training. CONCEPT §4 calls it a "specialization";
//      PRODUCT's evidence list records it as an *aprimoramento*, which is the
//      narrower and better-documented term, so that is the word the draft uses. She
//      upgrades it if the diploma says otherwise.
//
// The orientação opener the "começar" section sends is NOT here: the openers are
// cross-page facts and live in A Clínica (`clinica.notes.careerGuidance`).
// ---------------------------------------------------------------------------

/** One situation that brings somebody to this door — recognition, not a feature. */
export type CareerCase = { title: string; text: string };

/** One movement of the percurso. Ordered: the programme has a beginning and an end. */
export type PercursoStep = { numeral: string; title: string; text: string };

/** One thing she does, affirmed. Never a claim about what somebody else omits. */
export type Distinction = { title: string; text: string };

export type OrientacaoProfissional = {
  abertura: {
    heading: string;
    body: RichTextContent;
  };
  paraQuem: {
    heading: string;
    /** Unordered on purpose: these are alternatives, only one of which is yours. */
    cases: CareerCase[];
  };
  oPercurso: {
    heading: string;
    body: RichTextContent;
    steps: PercursoStep[];
    /** The thing the buyer is buying. Rendered apart from the steps. */
    deliverable: string | null;
  };
  nemCoaching: {
    heading: string;
    body: RichTextContent;
    distinctions: Distinction[];
    /** The page's one Jungian sentence. Absent rather than invented. */
    anchor: string | null;
    plate: PagePlate;
  };
  perguntaMaisFunda: {
    heading: string;
    body: string;
    linkLabel: string;
  };
  pratico: {
    heading: string;
    items: FactRow[];
  };
  comecar: {
    heading: string;
    body: string;
    linkLabel: string;
  };
};

export const ORIENTACAO_PROFISSIONAL_DEFAULTS: OrientacaoProfissional = {
  abertura: {
    heading: "Orientação profissional e de carreira",
    // The page's complete answer, in the first screen (REQ-012): what it is, who
    // conducts it, how many meetings, in what format, in which languages, from
    // where, and what you leave with. The comparing reader gets "what do I get and
    // how long does it take" before the page says anything symbolic.
    body: richText([
      "A orientação profissional e de carreira é um percurso com começo, meio e fim, conduzido por uma psicóloga com aprimoramento em orientação profissional pela PUC-SP. São até doze encontros semanais, on-line, que reúnem testes psicológicos, conversas e atividades propostas entre um encontro e outro.",
      "No fim, você sai sabendo qual caminho profissional faz mais sentido para você agora — e essa não é uma resposta que chega pronta por e-mail: é uma leitura construída com você, encontro a encontro. Por chamada de vídeo, em português ou em inglês, de qualquer lugar do Brasil ou do exterior.",
    ]),
  },
  paraQuem: {
    heading: "Para quem é",
    // CONCEPT §6's four situations. Written so that a 24-year-old and a
    // 45-year-old each find themselves in one of them: the first is the
    // course-or-profession decision, the middle two are mid-career, and the last
    // names both ages out loud so neither reader has to wonder if it is for them.
    // The canonical deliverable sentence deliberately does not appear in this
    // section — it belongs to the percurso's band, once.
    cases: [
      {
        title: "A primeira escolha",
        text: "Você está diante da decisão de qual curso ou qual profissão seguir e não quer decidir por eliminação. O percurso serve para escolher a partir de quem você é, e não do que parece mais seguro.",
      },
      {
        title: "Uma transição",
        text: "Você já tem uma carreira e pensa em mudar de área. A pergunta raramente é se dá para mudar — é para onde, e essa não se responde só olhando o mercado.",
      },
      {
        title: "O trabalho que perdeu o sentido",
        text: "Você continua fazendo o que sempre fez e não reconhece mais por quê. Nem sempre isso significa trocar de profissão; às vezes significa entender o que mudou em você.",
      },
      {
        title: "Um recomeço",
        text: "Depois de uma demissão, de uma pausa, de anos dedicados a outra coisa. Recomeçar aos quarenta é diferente de escolher aos dezoito, e o percurso trabalha com essa diferença.",
      },
    ],
  },
  oPercurso: {
    heading: "O percurso",
    body: richText([
      "Até doze encontros semanais, por chamada de vídeo. O caminho passa por quatro movimentos, e quantos encontros cada um leva depende de você — doze é o teto, não a meta.",
    ]),
    // Ordered, and therefore numbered (DESIGN reserves `.roman-numeral` for
    // sequences that genuinely are ordered). These are the movements of a bounded
    // programme, not the twelve sessions.
    steps: [
      {
        numeral: "I",
        title: "O que te trouxe até aqui",
        text: "Começamos pela sua história: a escolha que você já fez ou não conseguiu fazer, o que te atrai e o que você evita, o que a sua família esperava e o que você espera de si. É aqui que a pergunta ganha contorno.",
      },
      {
        numeral: "II",
        title: "Os testes",
        text: "Aplico testes psicológicos dentro do processo e leio os resultados com você. Eles não decidem nada no seu lugar: devolvem material — interesses, aptidões, jeitos de funcionar — que a conversa sozinha não alcança.",
      },
      {
        numeral: "III",
        title: "O mundo do trabalho",
        text: "Entre um encontro e outro eu proponho atividades: pesquisar carreiras, conversar com quem já trabalha nelas, experimentar. A realidade das profissões entra no processo em vez de ficar na imaginação.",
      },
      {
        numeral: "IV",
        title: "A devolutiva",
        text: "No fim, reunimos o que apareceu ao longo do percurso e conversamos sobre o que ficou claro. Não é um laudo com uma resposta única: é uma leitura que você entende porque construiu comigo.",
      },
    ],
    // CONCEPT §4's own words for what the programme delivers, kept verbatim and
    // used exactly once on the page: this band is where the buyer reads them.
    deliverable:
      "Você sai com clareza sobre a profissão que faz mais sentido no momento atual da sua vida — e entendendo como chegou até ela, o que permite escolher de novo se a sua vida mudar.",
  },
  nemCoaching: {
    // CONCEPT §6's own name for the section, kept because it is also the question
    // the comparing reader is holding. It distinguishes; it does not disparage.
    heading: "Nem coaching, nem teste solto",
    body: richText([
      "Quem procura ajuda para decidir a carreira encontra três coisas com nomes parecidos: um teste que devolve uma lista de profissões, um acompanhamento voltado a metas e desempenho, e a orientação profissional feita dentro da psicologia. As três podem servir em momentos diferentes. Esta é a terceira.",
    ]),
    distinctions: [
      {
        title: "Uma psicóloga, com registro.",
        text: "A orientação acontece dentro da psicologia clínica: há um registro profissional atrás dela, um código de ética que me obriga e sigilo sobre tudo o que você trouxer. Se no meio do caminho aparecer algo que pede outro tipo de cuidado, eu reconheço e digo isso a você.",
      },
      {
        title: "Os testes ficam dentro do processo.",
        text: "Testes psicológicos só podem ser aplicados e interpretados por psicólogos, e aqui eles entram como material de trabalho, não como veredito: aplicados por mim, lidos com você e discutidos à luz da sua história.",
      },
      {
        title: "A vocação lida em profundidade.",
        text: "Interesse e aptidão explicam parte de uma escolha. A outra parte está no que se repete sem que você perceba, no que te atrai e te assusta ao mesmo tempo, no que a sua família projetou em você. É esse material que a psicologia analítica sabe escutar.",
      },
    ],
    anchor:
      "Na tradição junguiana, a vocação não é uma etiqueta que se descobre: é uma das portas por onde passa a individuação — o trabalho de tornar-se quem você já é.",
    plate: EMPTY_PAGE_PLATE,
  },
  perguntaMaisFunda: {
    heading: "Quando a pergunta é mais funda",
    // The bridge for somebody who came through the wrong door. It has to read as
    // "that's fine", never as an upsell — which is why it is three sentences and
    // ends by handing over rather than by asking for anything.
    body: "Às vezes o percurso começa e fica claro que a pergunta não é qual profissão — é por que nada parece suficiente, ou o que faz você desistir do que escolheu, ou um cansaço que já estava aí antes deste trabalho. Quando é isso, eu digo. Você pode ter entrado pela porta da carreira e descobrir que a sua pergunta era outra; está tudo bem, as duas portas dão na mesma casa.",
    linkLabel: "conhecer a análise",
  },
  pratico: {
    heading: "Prático",
    // The fee row is NOT here — it is composed from A Clínica (REQ-005), scoped to
    // `careerGuidance` so this page quotes its own service alone.
    items: [
      {
        label: "Duração",
        value: "Até doze encontros semanais. É um percurso com começo, meio e fim.",
      },
      { label: "Como acontece", value: "Por chamada de vídeo, em horário combinado com você." },
      { label: "Idiomas", value: "Português ou inglês." },
      { label: "De onde", value: "De qualquer lugar do Brasil ou do exterior." },
      {
        label: "Horários",
        value: "Sempre no horário de Brasília. Se você mora fora, eu faço a conta com você.",
      },
    ],
  },
  comecar: {
    heading: "Começar",
    body: "Se a pergunta da carreira é a sua, me escreva. Marcamos uma primeira conversa, eu explico o percurso com calma e você decide depois — não há nada a assinar antes disso.",
    linkLabel: "o que acontece na primeira conversa",
  },
};
