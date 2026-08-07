import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// Orientação profissional e de carreira (`/orientacao-profissional`) — five
// bands (the 2026-08 condensation of CONCEPT §6's seven sections): abertura ·
// para quem · o percurso · nem coaching (with the bridge to análise folded in as
// its closing paragraph) · na prática (with the ask folded in). One member per
// tab in `page-orientacao-profissional`, so a field's admin path and its render
// path read the same.
//
// ORIENTACAO_PROFISSIONAL_DEFAULTS is what renders when Payload is off or a field
// is blank, and it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** One block is *hers, verbatim* —
// `abertura.body`, from her 2026-08-07 text (SRC-B), pinned by
// `src/domain/sourceCopy.test.ts`. Until it arrived, nothing on this page was
// hers: the page had never existed, not on the old Google Sites page and not in
// the pre-CONCEPT site.
//
// Everything else is a *draft* stating only facts CONCEPT §4/§6 and PRODUCT
// already fix: the bounded programme (up to twelve weekly online meetings), her
// PUC-SP training in orientação profissional, psychological tests +
// conversations + proposed activities, the deliverable, the four situations that
// bring someone here, the boundary with análise, and the reach and languages.
// Drafts state facts plainly; TASK-052 owns the review.
//
// Two things are deliberately *not* drafted anywhere here, because inventing them
// would be inventing product: **a price** (it lives in A Clínica and prints "a
// combinar" until she sets it) and **any test instrument named**. Her own
// sentence says "testes psicológicos" and nothing more specific, and neither
// does anything drafted around it.
//
// **The two questions this file used to hold open are answered, both by her own
// words** (plan REQ-003; ledger OPEN-A and OPEN-H):
//
//   1. *The word for her PUC-SP training.* Her prose says she is
//      **especializada**; her academic record says **Aprimoramento em Psicologia
//      Clínica Junguiana / em Orientação Profissional e de Carreira**. Both are
//      hers, and both ship: the prose describes what she does, the record names
//      the certificate. `abertura.body` and `SOBRE_DEFAULTS.formacao.items`
//      therefore differ on purpose, and making them agree would be overruling
//      one of her two sentences with the other.
//   2. *Whether she administers psychological tests.* She says she does —
//      "Através de testes psicológicos, conversas e atividades propostas". The
//      claim is hers now, not a draft inference.
//
// Still **unconfirmed**, and still ours: the stronger sentence in
// `nemCoaching.distinctions[1]` that psychological tests may only be
// administered and interpreted by a psychologist. True of Brazilian practice,
// but a regulatory claim made in her name, and her text does not make it.
//
// The orientação opener the folded ask sends is NOT here: the openers are
// cross-page facts and live in A Clínica (`clinica.notes.careerGuidance`).
// ---------------------------------------------------------------------------

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
    /** Compact lines, unordered on purpose: alternatives, only one of which is yours. */
    cases: string[];
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
    /** The bridge to análise, folded in as the section's closing paragraph. */
    bridge: { body: string; linkLabel: string };
    plate: PagePlate;
  };
  pratico: {
    heading: string;
    items: FactRow[];
    /** The ask, folded into the practical band rather than a section of its own. */
    comecar: { body: string; linkLabel: string };
  };
};

export const ORIENTACAO_PROFISSIONAL_DEFAULTS: OrientacaoProfissional = {
  abertura: {
    heading: "Orientação profissional e de carreira",
    // **Hers, verbatim** (SRC-B), split at her own sentence boundaries into the
    // two paragraphs this field already rendered. It replaced a draft that said
    // the same things in the third person, and it says them better: her first
    // person is what a comparing reader is looking for on this page.
    //
    // It also happens to be a complete AEO front-load (REQ-012) on its own —
    // what it is, who conducts it, what it uses, what you leave with, how many
    // meetings, in what format. The one fact her sentences do not carry is the
    // languages, so the drafted clause that did survives at the end of paragraph
    // two.
    //
    // Two corrected spellings, rows 3 and 6 of the ledger: `PUC - SP` → `PUC-SP`
    // and `12` → `doze` (GUD-002). Her doubled "orientação profissional e
    // orientação de carreira" stays doubled.
    body: richText([
      "Sou especializada em orientação profissional e orientação de carreira pela PUC-SP. Através de testes psicológicos, conversas e atividades propostas, posso te ajudar a descobrir a profissão que faz mais sentido no momento atual da sua vida.",
      "São feitos até doze encontros semanais, on-line. Em português ou em inglês, de qualquer lugar do Brasil ou do exterior.",
    ]),
  },
  paraQuem: {
    heading: "Para quem é",
    // CONCEPT §6's four situations, one line each — recognition, not features.
    // Written so a 24-year-old and a 45-year-old each find themselves in one.
    cases: [
      "Escolher o primeiro curso ou a primeira profissão — sem decidir por eliminação.",
      "Mudar de área, quando a pergunta não é se dá para mudar, e sim para onde.",
      "Entender o que houve quando o trabalho de sempre perdeu o sentido.",
      "Recomeçar depois de uma demissão, de uma pausa, de anos dedicados a outra coisa.",
    ],
  },
  oPercurso: {
    heading: "O percurso",
    body: richText([
      "O caminho passa por quatro movimentos. Quantos encontros cada um leva depende de você — doze é o teto, não a meta.",
    ]),
    // Ordered, and therefore numbered (DESIGN reserves `.roman-numeral` for
    // sequences that genuinely are ordered). These are the movements of a bounded
    // programme, not the twelve sessions.
    steps: [
      {
        numeral: "I",
        title: "O que te trouxe até aqui",
        text: "A sua história: a escolha que você fez ou não conseguiu fazer, o que te atrai e o que você evita, o que a sua família esperava. É aqui que a pergunta ganha contorno.",
      },
      {
        numeral: "II",
        title: "Os testes",
        text: "Testes psicológicos aplicados dentro do processo e lidos com você. Eles não decidem nada no seu lugar: devolvem material que a conversa sozinha não alcança.",
      },
      {
        numeral: "III",
        title: "O mundo do trabalho",
        text: "Entre um encontro e outro, atividades propostas: pesquisar carreiras, conversar com quem já trabalha nelas, experimentar. A realidade das profissões entra no processo.",
      },
      {
        numeral: "IV",
        title: "A devolutiva",
        text: "Reunimos o que apareceu e conversamos sobre o que ficou claro. Não é um laudo com uma resposta única: é uma leitura que você entende porque construiu comigo.",
      },
    ],
    // CONCEPT §4's promise — clarity about "a profissão que faz mais sentido no
    // momento atual da sua vida" — is now made in `abertura.body`, in her own
    // words, on the first screen. Repeating it here would say the same sentence
    // twice on one page (GUD-001), so this band keeps only what it alone adds:
    // that she leaves understanding *how* she got there, which is what makes the
    // choice repeatable later.
    deliverable:
      "O que você leva não é só a resposta: é entender como chegou até ela. É isso que permite escolher de novo, se daqui a alguns anos a sua vida pedir outra coisa.",
  },
  nemCoaching: {
    // CONCEPT §6's own name for the section, kept because it is also the question
    // the comparing reader is holding. It distinguishes; it does not disparage.
    heading: "Nem coaching, nem teste solto",
    body: richText([
      "Quem procura ajuda para decidir a carreira encontra três coisas com nomes parecidos: um teste que devolve uma lista de profissões, um acompanhamento voltado a metas e a orientação profissional feita dentro da psicologia. Esta é a terceira.",
    ]),
    distinctions: [
      {
        title: "Uma psicóloga, com registro.",
        text: "A orientação acontece dentro da psicologia clínica: registro profissional, código de ética e sigilo sobre tudo o que você trouxer. Se aparecer algo que pede outro tipo de cuidado, eu reconheço e digo.",
      },
      {
        title: "Os testes ficam dentro do processo.",
        text: "Testes psicológicos só podem ser aplicados e interpretados por psicólogos. Aqui eles entram como material de trabalho, não como veredito: lidos com você, à luz da sua história.",
      },
      {
        title: "A vocação lida em profundidade.",
        text: "Interesse e aptidão explicam parte de uma escolha. A outra parte está no que se repete sem você perceber, no que atrai e assusta ao mesmo tempo. É esse material que a psicologia analítica escuta.",
      },
    ],
    anchor:
      "Na tradição junguiana, a vocação não é uma etiqueta que se descobre: é uma das portas por onde passa a individuação — o trabalho de tornar-se quem você já é.",
    // The bridge for somebody who came through the wrong door, folded in as this
    // section's close. It has to read as "that's fine", never as an upsell.
    bridge: {
      body: "Às vezes o percurso começa e a pergunta se revela outra — não qual profissão, mas por que nada parece suficiente, ou um cansaço que já estava aí antes. Quando é isso, eu digo, e a análise é o caminho mais indicado.",
      linkLabel: "conhecer a análise",
    },
    plate: EMPTY_PAGE_PLATE,
  },
  pratico: {
    heading: "Na prática",
    // The fee row is NOT here — it is composed from A Clínica (REQ-005), scoped to
    // `careerGuidance` so this page quotes its own service alone.
    items: [
      {
        label: "Duração",
        value: "Até doze encontros semanais, com começo, meio e fim.",
      },
      { label: "Como acontece", value: "Por chamada de vídeo, em horário combinado." },
      { label: "Idiomas", value: "Português ou inglês." },
      { label: "De onde", value: "De qualquer lugar do Brasil ou do exterior." },
      { label: "Horários", value: "Sempre no horário de Brasília." },
    ],
    // The ask closes the practical band instead of holding a band of its own.
    comecar: {
      body: "Se a pergunta da carreira é a sua, me escreva. Na primeira conversa eu explico o percurso com calma, e você decide depois.",
      linkLabel: "o que acontece na primeira conversa",
    },
  },
};
