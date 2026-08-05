import type { FaqCategory } from "./FaqCategory";

// ---------------------------------------------------------------------------
// The shape the /perguntas page + FAQ JSON-LD render. Every entry belongs to one
// of the four sections of CONCEPT §6, because a question with no section would
// silently never appear.
//
// TODO: review every entry with her before publishing. Operational details
// (session length, frequency, online platform, pricing policy) are reasonable
// defaults for clinical practice in Brazil, but require confirmation. Keep the
// list short and answer real first-call questions — do not restate the service
// pages' copy. The `orientacao` and `internacional` sections have no defaults on
// purpose: inventing her answers there would break the authorship policy
// (CONCEPT §11), and an empty section simply does not render.
// ---------------------------------------------------------------------------

export type FaqEntry = {
  question: string;
  answer: string;
  category: FaqCategory;
};

export const FAQ_DEFAULTS: FaqEntry[] = [
  {
    question: "O que acontece em uma primeira conversa?",
    answer:
      "Uma conversa de cerca de cinquenta minutos, por chamada de vídeo. Você me conta, sem precisar organizar nada antes, o que está acontecendo e o que te trouxe até aqui. Eu escuto, faço algumas perguntas e, ao final, decidimos juntos se vale marcar uma próxima sessão.",
    category: "pratico",
  },
  {
    question: "Quanto tempo dura uma análise?",
    answer:
      "Não há prazo fixo. Algumas pessoas procuram a análise para atravessar um momento específico, como um luto ou uma decisão difícil, e ficam alguns meses. Outras seguem por anos, porque o trabalho de individuação é longo por natureza. O ritmo é construído junto.",
    category: "analise",
  },
  {
    question: "Com que frequência são as sessões?",
    answer:
      "Em geral, uma vez por semana. Em momentos mais intensos, pode haver duas. Definimos a frequência conforme o que o trabalho pede e o que cabe na sua semana.",
    category: "pratico",
  },
  {
    // Rewritten for CON-001: the practice is online only, and the old answer
    // claimed an in-person office in Guarulhos.
    question: "Como funcionam as sessões on-line?",
    answer:
      "Por chamada de vídeo, no horário combinado, de onde você estiver — em qualquer lugar do Brasil ou do exterior. A estrutura é sempre a mesma: cerca de cinquenta minutos, uma vez por semana, com o mesmo sigilo. Pela tela, o trabalho não se faz menos.",
    category: "pratico",
  },
  {
    question: "Você atende adolescentes ou crianças?",
    answer:
      "Não. A clínica atende adultos. Para crianças e adolescentes, posso indicar colegas de confiança.",
    category: "analise",
  },
  {
    // TODO: confirm pricing policy with her.
    question: "E em relação a valores?",
    answer:
      "Combinamos os valores antes da primeira sessão, conforme a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.",
    category: "pratico",
  },
];
