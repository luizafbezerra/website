// ---------------------------------------------------------------------------
// The shape the /perguntas page + FAQ JSON-LD render.
//
// TODO: review every entry with her before publishing. Operational details
// (session length, frequency, online platform, pricing policy) are reasonable
// defaults for clinical practice in Brazil, but require confirmation. Keep the
// list short and answer real first-call questions — do not restate pillar/about
// copy.
// ---------------------------------------------------------------------------

export type FaqEntry = {
  question: string;
  answer: string;
};

export const FAQ_DEFAULTS: FaqEntry[] = [
  {
    question: "O que acontece em uma primeira conversa?",
    answer:
      "Uma conversa de cerca de cinquenta minutos, em geral por chamada de vídeo. Você me conta, sem precisar organizar nada antes, o que está acontecendo e o que te trouxe até aqui. Eu escuto, faço algumas perguntas e, ao final, decidimos juntos se vale marcar uma próxima sessão.",
  },
  {
    question: "Quanto tempo dura uma análise?",
    answer:
      "Não há prazo fixo. Algumas pessoas procuram a análise para atravessar um momento específico, como um luto ou uma decisão difícil, e ficam alguns meses. Outras seguem por anos, porque o trabalho de individuação é longo por natureza. O ritmo é construído junto.",
  },
  {
    question: "Com que frequência são as sessões?",
    answer:
      "Em geral, uma vez por semana. Em momentos mais intensos, pode haver duas. Definimos a frequência conforme o que o trabalho pede e o que cabe na sua semana.",
  },
  {
    question: "Atendimento online ou presencial?",
    answer:
      "Presencial no consultório em Guarulhos e online por chamada de vídeo, para todo o Brasil. As sessões online seguem a mesma estrutura; pela tela, o trabalho não se faz menos.",
  },
  {
    question: "Vocês atendem adolescentes ou crianças?",
    answer:
      "Não. O consultório atende adultos. Para crianças e adolescentes, posso indicar colegas de confiança.",
  },
  {
    // TODO: confirm pricing policy with her.
    question: "E em relação a valores?",
    answer:
      "Combinamos os valores antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.",
  },
];
