import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// A primeira conversa (`/primeira-conversa`) — the five sections of CONCEPT §6
// plus the page's own opening, as the page and its components consume them. One
// member per tab in `page-primeira-conversa`, so a field's admin path and its
// render path read the same.
//
// PRIMEIRA_CONVERSA_DEFAULTS is what renders when Payload is off or a field is
// blank, and it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** All of it is a *draft* — this page did not
// exist before CONCEPT v3, so there is no supplied text to carry across the way
// Início's hero lead and contato block were carried. Each draft states only facts
// CONCEPT already fixes: the shape of a first conversation (§6), the three
// permissions (§6, quoted almost verbatim), the response window and horário de
// Brasília anchoring (§8.3, §8.9), and the reach and languages (§2). Nothing here
// is her voice until she says it is, every field is editable in the admin, and
// TASK-052 of the master plan owns the review.
//
// The four bilhete openers are NOT here: they are cross-page facts and live in
// A Clínica (`clinica.notes`), because /analise, /orientacao-profissional and
// /internacional each offer one too.
// ---------------------------------------------------------------------------

/** One of the five tempos, I–V. */
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
  };
  permissoes: {
    heading: string;
    /** One line per permission — no numerals: this is not a sequence. */
    items: string[];
    plate: PagePlate;
  };
  logistica: {
    heading: string;
    items: FactRow[];
  };
  miniFaq: {
    heading: string;
    items: MiniFaqEntry[];
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
      "Uma conversa de cerca de cinquenta minutos, por chamada de vídeo, em português ou em inglês, de onde você estiver — em qualquer lugar do Brasil ou do exterior.",
      "Ela serve para nos conhecermos: você conta o que está acontecendo, eu escuto e, no fim, você decide se quer seguir. Marcar a primeira conversa não compromete você com nada além dela.",
    ]),
  },
  passoAPasso: {
    heading: "Passo a passo",
    steps: [
      {
        numeral: "I",
        title: "Você me escreve",
        text: "Uma mensagem no WhatsApp, curta. Não precisa contar tudo, nem organizar antes o que está acontecendo. Respondo em até um dia útil, no horário de Brasília.",
      },
      {
        numeral: "II",
        title: "Combinamos o horário",
        text: "Eu ofereço os horários que tenho e você escolhe o que cabe na sua semana. Se você mora fora do Brasil, acertamos o fuso — a referência é sempre o horário de Brasília.",
      },
      {
        numeral: "III",
        title: "O dia chega",
        text: "Eu envio o link da chamada antes. Você não precisa preparar nada: só um lugar onde possa falar sem ser interrompido.",
      },
      {
        numeral: "IV",
        title: "Os cinquenta minutos",
        text: "Você conta o que está acontecendo, no ritmo que der. Eu escuto, faço algumas perguntas e digo como eu trabalharia com o que você trouxe.",
      },
      {
        numeral: "V",
        title: "Você decide depois",
        text: "Não há nada a assinar. Se fizer sentido para nós dois, marcamos o encontro semanal; se você quiser pensar, pode me responder outro dia.",
      },
    ],
  },
  permissoes: {
    heading: "Três permissões",
    // CONCEPT §6's three lines, almost verbatim.
    items: [
      "Você não precisa preparar nada.",
      "Você não precisa saber nomear o que sente.",
      "Não existe assunto pequeno demais.",
    ],
    plate: EMPTY_PAGE_PLATE,
  },
  logistica: {
    heading: "O combinado",
    // The fee row is NOT here — it is composed from A Clínica (REQ-005), so that
    // one edit changes the price on every page that quotes it.
    items: [
      { label: "Duração", value: "Cerca de cinquenta minutos." },
      {
        label: "Como acontece",
        value: "Por chamada de vídeo. Eu envio o link antes de cada encontro.",
      },
      {
        label: "Remarcação",
        value: "Imprevistos acontecem. Avise com antecedência e a gente remarca.",
      },
      {
        label: "Horários",
        value: "Sempre no horário de Brasília. Se você mora fora, eu faço a conta com você.",
      },
      { label: "Idiomas", value: "Português ou inglês." },
    ],
  },
  miniFaq: {
    heading: "Antes de escrever",
    items: [
      {
        question: "Preciso saber o que quero tratar?",
        answer:
          "Não. Muita gente chega dizendo apenas que algo não vai bem. Encontrar as palavras é parte do trabalho, não um requisito para começá-lo.",
      },
      {
        question: "E se eu não gostar da conversa?",
        answer:
          "Então ela termina ali, e está tudo bem. A primeira conversa existe justamente para isso: nenhum dos dois se compromete antes de saber.",
      },
      {
        question: "Você atende quem mora fora do Brasil?",
        answer:
          "Sim. Já acompanhei pessoas em Portugal, na Inglaterra e nos Estados Unidos. Acertamos o fuso e seguimos em português — ou em inglês, se você preferir.",
      },
      {
        question: "Em quanto tempo você responde?",
        answer:
          "Em até um dia útil, no horário de Brasília. Se eu estiver sem horários no momento, digo isso na resposta em vez de deixar você esperando.",
      },
    ],
    linkLabel: "todas as perguntas frequentes",
  },
  bilhete: {
    heading: "O bilhete",
    intro: richText([
      "Escrever a primeira mensagem costuma ser a parte mais difícil. Então ela já está escrita: escolha a que mais se parece com o seu caso e ela abre no meu WhatsApp — você ainda pode mudar o texto antes de enviar.",
    ]),
    chooseLabel: "escolha por onde começar",
  },
};
