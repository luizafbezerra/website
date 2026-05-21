// TODO: review every entry with Luiza before publishing.
// Operational details (session length, frequency, online platform, pricing
// policy) are reasonable defaults for clinical practice in Brazil, but
// require confirmation. Keep this list short and answer real first-call
// questions — do not restate pillar/about copy.

export namespace Faq {
  export type Entry = {
    question: string;
    answer: string;
  };

  export const entries: ReadonlyArray<Entry> = [
    {
      question: "O que acontece em uma primeira conversa?",
      answer:
        "Uma conversa de aproximadamente cinquenta minutos, geralmente por chamada de vídeo. Você me conta — sem precisar de estrutura — o que está acontecendo e o que te trouxe até aqui. Eu escuto, faço algumas perguntas, e ao final decidimos juntos se vale marcar uma próxima sessão.",
    },
    {
      question: "Quanto tempo dura uma análise?",
      answer:
        "Não há prazo fixo. Algumas pessoas procuram a análise para atravessar um momento específico — um luto, uma decisão difícil — e ficam alguns meses. Outras seguem por anos, porque o trabalho de individuação é, por sua natureza, longo. O ritmo é construído juntos.",
    },
    {
      question: "Com que frequência são as sessões?",
      answer:
        "Em geral, uma vez por semana. Em momentos mais intensos, pode haver duas. A frequência é definida conforme o que o trabalho pede e o que cabe na sua semana.",
    },
    {
      question: "Atendimento online ou presencial?",
      answer:
        "Presencial no consultório em Guarulhos e online por chamada de vídeo, para todo o Brasil. As sessões online seguem a mesma estrutura — o trabalho não se faz menos pela tela.",
    },
    {
      question: "Vocês atendem adolescentes ou crianças?",
      answer:
        "Não. O foco do consultório é em adultos. Para crianças e adolescentes, posso indicar colegas de confiança.",
    },
    {
      // TODO: confirm pricing policy with Luiza.
      question: "E em relação a valores?",
      answer:
        "Os valores são combinados antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp — respondo em até um dia útil.",
    },
  ];
}
