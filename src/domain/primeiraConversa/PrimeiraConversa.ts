import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// A primeira conversa (`/primeira-conversa`) — four bands (the 2026-08
// condensation of CONCEPT §6's five sections): abertura · como acontece (the
// steps, with the three permissions as the band's coda) · o combinado (the
// facts, with the surviving threshold doubts folded in) · o bilhete. One member
// per tab in `page-primeira-conversa`, so a field's admin path and its render
// path read the same.
//
// PRIMEIRA_CONVERSA_DEFAULTS is what renders when Payload is off or a field is
// blank, and it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** All of it is a *draft* except the three
// permissions, which CONCEPT §6 quotes almost verbatim. Each draft states only
// facts CONCEPT already fixes: the shape of a first conversation (§6), the
// response window and horário de Brasília anchoring (§8.3, §8.9), and the reach
// and languages (§2). Steps carry logistics only — every reassurance lives
// exactly once, in the permissions or the doubts, so the page stops repeating
// itself. Nothing here is her voice until she says it is; TASK-052 owns the
// review.
//
// The four bilhete openers are NOT here: they are cross-page facts and live in
// A Clínica (`clinica.notes`), because /analise, /orientacao-profissional and
// /internacional each offer one too.
// ---------------------------------------------------------------------------

/** One of the four tempos, I–IV. */
export type Step = { numeral: string; title: string; text: string };

/** One threshold doubt, answered short. */
export type MiniFaqEntry = { question: string; answer: string };

export type PrimeiraConversa = {
  abertura: {
    heading: string;
    lead: RichTextContent;
  };
  passoAPasso: {
    heading: string;
    steps: Step[];
    /** The three permissions close the band — CONCEPT §6's lines, not steps. */
    permissoes: { items: string[]; plate: PagePlate };
  };
  logistica: {
    heading: string;
    items: FactRow[];
    /** The threshold doubts the sections above have not answered, folded in. */
    doubts: MiniFaqEntry[];
    linkLabel: string;
  };
  bilhete: {
    heading: string;
    intro: RichTextContent;
    chooseLabel: string;
  };
};

export const PRIMEIRA_CONVERSA_DEFAULTS: PrimeiraConversa = {
  abertura: {
    heading: "A primeira conversa",
    // The page's complete answer, in the first screen (REQ-006): what happens,
    // how long, in which languages, from where, and at what commitment.
    lead: richText([
      "Uma conversa de cerca de cinquenta minutos, por chamada de vídeo, em português ou em inglês, de onde você estiver, no Brasil ou no exterior.",
      "Ela serve para nos conhecermos: você conta o que está acontecendo, eu escuto e, no fim, a decisão de seguir é sua.",
    ]),
  },
  passoAPasso: {
    heading: "Como acontece",
    // Four beats, logistics only. "O dia chega" merged into the scheduling step;
    // the reassurances the steps used to repeat live once, below.
    steps: [
      {
        numeral: "I",
        title: "Você me escreve",
        text: "Uma mensagem no WhatsApp, do tamanho que sair.",
      },
      {
        numeral: "II",
        title: "Combinamos o horário",
        text: "Você escolhe entre os horários que eu tiver, e eu envio o link da chamada antes do dia.",
      },
      {
        numeral: "III",
        title: "Os cinquenta minutos",
        text: "Você conta o que está acontecendo, no ritmo que der. Eu escuto, faço algumas perguntas e digo como trabalharia com o que você trouxe.",
      },
      {
        numeral: "IV",
        title: "Você decide depois",
        text: "Se fizer sentido para nós dois, marcamos o encontro semanal. Se quiser pensar, me responda outro dia. Não há nada a assinar.",
      },
    ],
    // CONCEPT §6's three lines, almost verbatim. They close the band: the steps
    // say what happens, the permissions say what nobody has to bring.
    permissoes: {
      items: [
        "Você não precisa preparar nada.",
        "Você não precisa saber nomear o que sente.",
        "Não existe assunto pequeno demais.",
      ],
      plate: EMPTY_PAGE_PLATE,
    },
  },
  logistica: {
    heading: "O combinado",
    // The fee row is NOT here — it is composed from A Clínica (REQ-005), so that
    // one edit changes the price on every page that quotes it.
    items: [
      { label: "Duração", value: "Cerca de cinquenta minutos." },
      { label: "Como acontece", value: "Por chamada de vídeo. Eu envio o link antes." },
      {
        label: "Remarcação",
        value: "Imprevistos acontecem: avise com antecedência e a gente remarca.",
      },
      {
        label: "Horários",
        value: "Sempre no horário de Brasília. Se você mora fora, eu faço a conta com você.",
      },
      { label: "Idiomas", value: "Português ou inglês." },
    ],
    // Only the doubts the page has not already answered above (the rest live on
    // /perguntas, one link away).
    doubts: [
      {
        question: "Você atende quem mora fora do Brasil?",
        answer:
          "Sim. Já acompanhei pessoas em Portugal, na Inglaterra e nos Estados Unidos. Acertamos o fuso e seguimos em português ou em inglês.",
      },
      {
        question: "Em quanto tempo você responde?",
        answer:
          "Em até um dia útil. Se eu estiver sem horários no momento, digo isso na resposta em vez de deixar você esperando.",
      },
    ],
    linkLabel: "todas as perguntas frequentes",
  },
  bilhete: {
    heading: "O bilhete",
    intro: richText([
      "Escrever a primeira mensagem costuma ser a parte mais difícil. Então ela já está escrita: escolha a que mais se parece com o seu caso e ela abre no meu WhatsApp. Você ainda pode mudar o texto antes de enviar.",
    ]),
    chooseLabel: "escolha por onde começar",
  },
};
