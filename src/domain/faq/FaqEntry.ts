import type { FaqCategory } from "./FaqCategory";

// ---------------------------------------------------------------------------
// The shape the /perguntas page + FAQ JSON-LD render. Every entry belongs to one
// of the four sections of CONCEPT §6, because a question with no section would
// silently never appear (`groupFaqByCategory` renders exactly the sections that
// have questions).
//
// The array is written **grouped by category, in CONCEPT §6's order**, and
// `seed/faq.ts` writes the index as each row's `order`. So the file reads the way
// the page reads, and re-seeding never scrambles a section.
//
// **The page is answered, and the placeholders are gone.** She sent sixteen of
// these answers on 2026-08-26, over WhatsApp, already written as question and
// answer. They ship as she wrote them, with the mechanical corrections listed
// below and nothing else — no tightening, no re-voicing, no resequencing inside a
// sentence. A seventeenth row of hers survives from the old single-page site
// ("E em relação a valores?", recovered on 2026-08-10); one draft that was never
// hers, "A primeira conversa é cobrada?", is gone, superseded by her own answer
// to the same question.
//
// The mechanical corrections, all of them:
//
//   · `online` → `on-line`, in three questions. The house spelling, and her own
//     in SRC-A and SRC-B; ledger row 7 corrected SRC-G.1 the same way, and
//     `onlineOnly.test.ts` enforces it.
//   · `Psicologia Analítica` and `Psicologia Profunda` → lower case, in four
//     answers. The site writes the tradition in lower case everywhere; title case
//     reads as a proper noun, which the tradition is not.
//   · straight quotes → `“ ”`, around `individuação`, `certo` and `errado`,
//     matching /analise.
//   · one comma deleted: "A terapia analítica ou profunda, é indicada" separated
//     the subject from its verb.
//   · "Qual é a **minha** abordagem na clínica?" → "a **sua**". She wrote that one
//     question from her side of the desk; every other question in the batch is the
//     visitor's. The answer is untouched.
//   · "(11) 96415-8128" → "+55 11 96415-8128", the form A Clínica publishes,
//     because a reader in Lisbon cannot dial the first one. "(WhatsApp/Telefone)"
//     becomes "(WhatsApp ou telefone)" — her fact kept, her slash spelled out.
//
// **One of her seventeen answers is not here.** "Qual é a duração das sessões e
// com que frequência elas acontecem?" carries two facts and both are already
// answered: the fifty minutes in "Como será feito o encontro on-line?", the weekly
// cadence in "Você realiza atendimentos quinzenais ou mensais?". Worse, its
// "Recomendo que os encontros sejam semanais" softens the other row's
// "exclusivamente com frequência semanal" into a suggestion, and a page cannot
// answer the same question both ways. Recover it from this file's history if she
// settles it the other way round.
//
// **Eight rows are not hers, and none of them says anything new.** Sobre a
// orientação profissional got no answer in her batch, and a section that renders
// `[A DEFINIR]` may not ship, so its four rows restate what
// /orientacao-profissional already publishes: the twelve-meeting ceiling, tests
// that return material rather than a verdict, what you leave with, and how the
// work differs from coaching and from análise. Four more do the same job for
// subjects CONCEPT §6 assigns this page and her batch does not reach — /analise's
// "Quanto tempo dura" row, and /internacional's Fusos, Idiomas and telepsychology
// lines. Every sentence in the eight is lifted from copy already live on those
// pages: this page states no fact the site does not state elsewhere.
//
// **How this page stays apart from /primeira-conversa's mini-FAQ.** Both surfaces
// answer doubts, and they can drift. The rule: *this* page carries the question
// somebody would type into a search box, answered at reference length; the mini-FAQ
// carries the doubt that stops somebody on the threshold, in two sentences, and
// repeats no question from here. Nothing below duplicates either of its two — the
// mini-FAQ asks "Você atende quem mora fora do Brasil?" and enumerates the five
// countries, where this page asks about fusos, payment and language, and the two
// agree on every fact.
//
// **Where the retired copy went.** The ten drafts this file shipped in August are
// at `git show 5060b86:src/domain/faq/FaqEntry.ts` and live on as the suggested
// subjects on the `question` field in `src/payload/collections/Faq.ts`; her six
// answers from the old single-page site are in `docs/content-export-2026-08.md`
// and at `git show 6d508ba:src/domain/faq/FaqEntry.ts`.
//
// Portuguese only, like every other page's defaults. Unlike them, the English is
// written: `FAQ_EN` in `src/payload/seed/faq.ts` translates every row, because a
// twenty-five-row reference page falling back to Portuguese would leave the
// anglophone reader with the page's whole content in the wrong language.
// ---------------------------------------------------------------------------

export type FaqEntry = {
  question: string;
  answer: string;
  category: FaqCategory;
};

/**
 * Stamped on both sides of a placeholder row. Grep for it before any deploy: a hit
 * means `/perguntas` is showing a question nobody wrote.
 *
 * There are none left — every row below is hers or restates a published page — so
 * this constant now guards against a *reintroduction* rather than describing the
 * current state. `seed/faq.ts` still asserts on it, which is what makes a
 * half-placeholder row impossible to ship in one locale only.
 */
export const FAQ_PLACEHOLDER_MARK = "[A DEFINIR]";

export const FAQ_DEFAULTS: FaqEntry[] = [
  // -- Sobre a análise -------------------------------------------------------
  {
    question: "Qual é a sua abordagem na clínica?",
    answer:
      "A minha prática clínica é fundamentada na psicologia analítica (também conhecida como psicologia profunda), desenvolvida pelo psiquiatra suíço Carl Gustav Jung. Na prática, isso significa que o nosso trabalho vai além do alívio dos sintomas imediatos. Nós exploramos o inconsciente por meio da análise de sonhos, da imaginação e da compreensão dos símbolos que atravessam a sua história. O foco principal é promover um autoconhecimento profundo e auxiliar no processo de “individuação” — que é a jornada para se tornar a sua versão mais autêntica e inteira.",
    category: "analise",
  },
  {
    question: "Para quem a psicoterapia analítica é indicada?",
    answer:
      "A terapia analítica ou profunda é indicada para adolescentes e adultos que buscam lidar com questões como ansiedade, depressão, transições de vida, crises existenciais ou conflitos nos relacionamentos. Além disso, é um caminho muito rico para quem deseja expandir o autoconhecimento e compreender melhor os seus próprios padrões de comportamento.",
    category: "analise",
  },
  // Not hers: /analise's own "Quanto tempo dura" row, verbatim. It is the question
  // this section is most often asked and the one fact about the arc of the work
  // her batch does not state.
  {
    question: "Quanto tempo dura uma análise?",
    answer:
      "A análise não tem prazo fixo: é um trabalho de médio a longo prazo, e quem decide seguir ou parar é você.",
    category: "analise",
  },
  {
    question: "Quem traz o tema a ser falado na sessão?",
    answer:
      "O tema é sempre trazido por você. A sessão é o seu espaço, e você tem total liberdade para falar sobre o que estiver sentindo, sobre um acontecimento da sua semana, uma angústia antiga ou até mesmo um sonho que teve. Não há assunto “certo” ou “errado”. O meu papel é te escutar de forma ativa e te guiar na compreensão profunda do material que você trouxer.",
    category: "analise",
  },
  {
    question: "É necessário levar os meus sonhos anotados para a sessão?",
    answer:
      "Não é uma obrigação, mas é muito bem-vindo! Como a análise dos sonhos é uma ferramenta valiosa na psicologia analítica para acessar o inconsciente, se você tiver o hábito de sonhar e quiser trazer as suas anotações, elas serão um excelente material para trabalharmos em sessão.",
    category: "analise",
  },

  // -- Sobre a orientação profissional ---------------------------------------
  // None of these four is hers. Each is assembled from sentences already live on
  // /orientacao-profissional — `abertura.body`, `oPercurso`, `nemCoaching` — so the
  // section can render at all without inventing a fact or borrowing her voice.
  {
    question: "Quantos encontros tem a orientação profissional?",
    answer:
      "São feitos até doze encontros semanais, on-line. Doze é o teto, não a meta: quantos encontros o percurso leva depende de você, e ele tem começo, meio e fim.",
    category: "orientacao",
  },
  {
    question: "Que testes são usados, e eles decidem por mim?",
    answer:
      "São testes psicológicos aplicados dentro do processo e lidos com você. Eles não decidem nada no seu lugar: devolvem material que a conversa sozinha não alcança. Testes psicológicos só podem ser aplicados e interpretados por psicólogos, e aqui eles entram como material de trabalho, não como veredito — lidos à luz da sua história.",
    category: "orientacao",
  },
  {
    question: "O que eu levo no final do percurso?",
    answer:
      "No último movimento reunimos o que apareceu e conversamos sobre o que ficou claro. Não é um laudo com uma resposta única: o que você leva não é só a resposta, é entender como chegou até ela. É isso que permite escolher de novo, se daqui a alguns anos a sua vida pedir outra coisa.",
    category: "orientacao",
  },
  {
    question: "Orientação profissional é o mesmo que terapia ou que coaching?",
    answer:
      "Não. Quem procura ajuda para decidir a carreira encontra três coisas com nomes parecidos: um teste que devolve uma lista de profissões, um acompanhamento voltado a metas e a orientação profissional feita dentro da psicologia. Esta é a terceira: acontece dentro da psicologia clínica, com registro profissional, código de ética e sigilo sobre tudo o que você trouxer. E se, no percurso, a pergunta se revelar outra — não qual profissão, mas por que nada parece suficiente —, eu digo, e a análise é o caminho mais indicado.",
    category: "orientacao",
  },

  // -- Prático ---------------------------------------------------------------
  // All twelve are hers. The order is an argument: what the format is, where you
  // sit, who may hear, how often we meet, then money, then the policy that follows
  // from money.
  // The one row that names the thing CON-001 forbids, in order to deny it. It
  // survives `onlineOnly.test.ts` because that guard's `presencial` does not match
  // the plural `presenciais` — so if the guard is ever tightened, tighten it around
  // this question rather than rewriting it: the question is hers, and a searcher
  // typing "psicóloga online ou presencial" is exactly who this page is for.
  {
    question: "Os atendimentos são on-line ou presenciais?",
    answer: "Atualmente, realizo atendimentos na modalidade on-line apenas.",
    category: "pratico",
  },
  {
    question: "Como será feito o encontro on-line?",
    answer:
      "No horário exato do nosso agendamento, eu farei uma chamada de vídeo diretamente para o seu WhatsApp. A sessão terá a duração padrão de 50 minutos, tempo reservado exclusivamente para o nosso trabalho terapêutico.",
    category: "pratico",
  },
  {
    question: "Onde devo realizar a sessão on-line?",
    answer:
      "Para garantir o sigilo e o aproveitamento da terapia, é essencial que você esteja em um ambiente privativo e silencioso, sem a presença ou interrupção de outras pessoas. Recomendo também o uso de fones de ouvido e que você garanta estar em um local com boa conexão de internet para evitarmos quedas de sinal durante o atendimento.",
    category: "pratico",
  },
  {
    question: "O conteúdo compartilhado na sessão é sigiloso?",
    answer:
      "Sim, o sigilo é 100% garantido. Todo o conteúdo abordado nas sessões é estritamente confidencial, seguindo rigorosamente o Código de Ética Profissional do Psicólogo. A terapia é um espaço seguro, ético e livre de julgamentos, criado para que você possa se expressar com total tranquilidade.",
    category: "pratico",
  },
  {
    question: "Você realiza atendimentos quinzenais ou mensais?",
    answer:
      "Não, os meus atendimentos são realizados exclusivamente com frequência semanal. Esse ritmo é fundamental para estabelecermos um vínculo terapêutico sólido e de confiança. Além disso, a metodologia da psicologia analítica exige essa constância para que o trabalho seja verdadeiramente eficiente, permitindo um aprofundamento contínuo e seguro nas suas questões.",
    category: "pratico",
  },
  {
    question: "Posso solicitar sessões extras caso sinta necessidade?",
    answer:
      "Com certeza. Se você estiver atravessando um momento mais delicado, uma crise, ou simplesmente sentir necessidade de um suporte mais intensivo, podemos agendar sessões adicionais. O agendamento é feito de acordo com a disponibilidade da minha agenda, e cada sessão extra terá um valor adicional cobrado à parte da sua mensalidade.",
    category: "pratico",
  },
  // Hers, recovered from the old single-page site on 2026-08-10 (see
  // `docs/content-export-2026-08.md`). It opens the money block because it is the
  // only row that says how a value is arrived at rather than how it is paid.
  {
    question: "E em relação a valores?",
    answer:
      "Combinamos os valores antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.",
    category: "pratico",
  },
  {
    question: "A primeira sessão é cobrada?",
    answer:
      "Sim, a primeira sessão é cobrada. O valor, bem como a disponibilidade de horários, devem ser alinhados previamente. Para agendar e consultar os valores, entre em contato diretamente pelo número +55 11 96415-8128 (WhatsApp ou telefone).",
    category: "pratico",
  },
  {
    question: "Posso pagar pelas sessões após a realização delas ou no final do mês?",
    answer:
      "Não. O pagamento da mensalidade deve ser realizado previamente e não trabalho com pagamentos posteriores à realização das sessões. O acerto é feito de forma mensal, exclusivamente via PIX para a minha conta corrente. A chave PIX e os dados bancários serão repassados a você durante o nosso contato pelo WhatsApp.",
    category: "pratico",
  },
  {
    question: "O valor mensal muda caso eu falte a alguma sessão ou o mês tenha menos semanas?",
    answer:
      "Não, o pagamento funciona no formato de mensalidade fixa. Esse valor garante a reserva exclusiva do seu horário na minha agenda toda semana e o meu acompanhamento contínuo do seu caso. Portanto, o valor não sofre alterações em decorrência de faltas do paciente, feriados ou meses que tenham cinco semanas.",
    category: "pratico",
  },
  {
    question: "Como funciona a política de cancelamento ou reagendamento?",
    answer:
      "O reagendamento é perfeitamente possível, desde que seja solicitado com pelo menos 24 horas de antecedência. Como o horário é reservado com exclusividade para você, faltas ou cancelamentos sem esse aviso prévio impossibilitam que eu utilize o horário para outro paciente. Nesses casos de aviso em cima da hora, a sessão não poderá ser reagendada e será cobrada normalmente.",
    category: "pratico",
  },
  {
    question: "Você atende por planos de saúde?",
    answer: "Os meus atendimentos são 100% particulares.",
    category: "pratico",
  },

  // -- Internacional ---------------------------------------------------------
  // CONCEPT §6 assigns this section three subjects — fusos, paying from abroad,
  // sessions in English — and her batch answers the middle one. The other three
  // rows are /internacional's own Fusos, Idiomas and telepsychology lines.
  {
    question: "Como funcionam os horários para quem mora em outro fuso?",
    answer:
      "A referência é sempre o horário de Brasília. Eu faço a conta com você e ofereço horários que já cabem no seu dia.",
    category: "internacional",
  },
  {
    question: "Moro fora do Brasil. Como funciona o pagamento das sessões?",
    answer:
      "Os pagamentos de sessões internacionais são recebidos pela plataforma Wise, que é uma opção rápida e muito segura. Você só precisa baixar o aplicativo no seu celular ou acessar o site pelo computador. Durante o nosso contato inicial, eu te passarei todas as orientações e os dados certinhos para você conseguir fazer a transferência sem complicações.",
    category: "internacional",
  },
  {
    question: "As sessões podem ser em inglês?",
    answer:
      "Sim. A análise e a orientação profissional e de carreira acontecem em português ou em inglês, como você preferir, por chamada de vídeo, de qualquer lugar do mundo.",
    category: "internacional",
  },
  {
    question: "O atendimento segue alguma regulamentação?",
    answer:
      "O atendimento segue a regulamentação brasileira de telepsicologia: é assim que uma psicóloga brasileira atende quem vive em outro país.",
    category: "internacional",
  },
];
