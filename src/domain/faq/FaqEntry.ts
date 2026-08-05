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
// **Two kinds of copy live here, and the difference matters.**
//
// *Hers.* Six answers came from the old single-page site's own FAQ, verbatim from
// `docs/content-export-2026-08.md` — the duration of an analysis, the frequency,
// the online sessions, who she sees, the fees, the first conversation. They are her
// supplied text (CONCEPT §11), so they are organized and trimmed but never
// rewritten. Two were trimmed for CON-001, where her wording described an office
// in Guarulhos and a "presencial ou online" choice that no longer exists.
//
// *Drafts.* Nine answers are drafts, marked `DRAFT` below. They exist because
// CONCEPT §6 asks this page for four sections and her supplied copy filled only
// two: `orientacao` and `internacional` had no answers at all, and `pratico` had
// nothing on confidentiality even though CONCEPT §6 names it. Each draft states
// only facts CONCEPT and PRODUCT already fix — the bounded twelve-meeting
// programme and its instruments (§4, §6), the three real client countries, the
// languages, Brasília as the time anchor and the dólar/euro framing (§8.9), the
// telepsychology regulation as a trust signal (§6) — and none invents a price, a
// platform name or a payment mechanism. TASK-052 owns her review; every row is a
// CMS row, so her wording replaces a draft with no deploy.
//
// **How this page stays apart from /primeira-conversa's mini-FAQ.** Both surfaces
// answer doubts, and they can drift. The rule: *this* page carries the question
// somebody would type into a search box, answered at reference length; the mini-FAQ
// carries the doubt that stops somebody on the threshold, in two sentences, and
// repeats no question from here. Nothing below duplicates one of its four — the
// closest pair is deliberately worded apart ("Você atende quem mora fora do
// Brasil?" there, "Como funcionam as sessões para quem mora fora do Brasil?" here)
// and the two answers agree on every fact.
//
// Portuguese only, like every other page's defaults: English falls back to
// Portuguese through Payload's `fallback: true` until her polish pass (master plan
// RISK-001).
// ---------------------------------------------------------------------------

export type FaqEntry = {
  question: string;
  answer: string;
  category: FaqCategory;
};

export const FAQ_DEFAULTS: FaqEntry[] = [
  // ── Sobre a análise ──────────────────────────────────────────────────────
  {
    // Hers, verbatim.
    question: "Quanto tempo dura uma análise?",
    answer:
      "Não há prazo fixo. Algumas pessoas procuram a análise para atravessar um momento específico, como um luto ou uma decisão difícil, e ficam alguns meses. Outras seguem por anos, porque o trabalho de individuação é longo por natureza. O ritmo é construído junto.",
    category: "analise",
  },
  {
    // DRAFT. The three symbolic tools of CONCEPT §6 (/analise, "O método"),
    // answering the fear that dream recall is an entry requirement.
    question: "Preciso lembrar dos meus sonhos para fazer análise junguiana?",
    answer:
      "Não. Os sonhos são um dos caminhos, não uma exigência: também trabalhamos com imagens e fantasias do dia a dia e com o que se repete na sua vida. Muita gente passa a lembrar depois de algum tempo prestando atenção, e quem nunca lembra faz análise do mesmo jeito.",
    category: "analise",
  },
  {
    // Hers. "O consultório atende adultos" became "A clínica atende adultos" for
    // CON-001 — the clinic is online, and the sentence is about who she sees.
    question: "Você atende adolescentes ou crianças?",
    answer:
      "Não. A clínica atende adultos. Para crianças e adolescentes, posso indicar colegas de confiança.",
    category: "analise",
  },

  // ── Sobre a orientação profissional ──────────────────────────────────────
  {
    // DRAFT. The bounded scope of CONCEPT §4/§6: up to twelve weekly online
    // meetings. No fixed count is promised, because the programme's own page says
    // "up to".
    question: "Quanto tempo dura a orientação profissional?",
    answer:
      "É um percurso com começo e fim: até doze encontros semanais, on-line. Alguns processos se fecham antes disso — quantos encontros serão fica claro no caminho, conversando.",
    category: "orientacao",
  },
  {
    // DRAFT. The three instruments CONCEPT §6 fixes (tests + conversations +
    // proposed activities), and the refusal of prediction that CONCEPT §11
    // requires: a test never says which profession to choose.
    question: "Que testes são usados, e eles decidem por mim?",
    answer:
      "Quem conduz é uma psicóloga, e os testes são um dos instrumentos, ao lado das nossas conversas e de atividades que eu proponho entre os encontros. Eles ajudam a organizar o que você já sabe sobre si e a ver o que ainda não tinha nome. Nenhum deles diz qual profissão você deve seguir — essa parte é sua, e é o trabalho.",
    category: "orientacao",
  },
  {
    // DRAFT. The deliverable, in CONCEPT §4's own words.
    question: "O que eu levo no final?",
    answer:
      "Clareza sobre a profissão que faz mais sentido no momento atual da sua vida, e sobre o porquê. Não é um laudo nem um ranking de carreiras: é o resultado de um processo que você atravessou de dentro.",
    category: "orientacao",
  },
  {
    // DRAFT. CONCEPT §4's boundary sentence — sentido do trabalho → análise ·
    // qual profissão → orientação — and §6's bridge between the two doors.
    question: "Orientação profissional é o mesmo que fazer terapia?",
    answer:
      "Não. A orientação tem escopo definido e uma pergunta só: qual profissão faz mais sentido para você agora. Quando a pergunta é outra — que sentido o trabalho tem na minha vida, por que eu me repito nas escolhas —, o lugar disso é a análise. Às vezes se começa por aqui e se segue por lá, e isso é normal.",
    category: "orientacao",
  },

  // ── Prático ──────────────────────────────────────────────────────────────
  {
    // Hers. "em geral por chamada de vídeo" lost its hedge for CON-001: there is
    // no other way a session happens now.
    question: "O que acontece em uma primeira conversa?",
    answer:
      "Uma conversa de cerca de cinquenta minutos, por chamada de vídeo. Você me conta, sem precisar organizar nada antes, o que está acontecendo e o que te trouxe até aqui. Eu escuto, faço algumas perguntas e, ao final, decidimos juntos se vale marcar uma próxima sessão.",
    category: "pratico",
  },
  {
    // Hers, verbatim.
    question: "Com que frequência são as sessões?",
    answer:
      "Em geral, uma vez por semana. Em momentos mais intensos, pode haver duas. Definimos a frequência conforme o que o trabalho pede e o que cabe na sua semana.",
    category: "pratico",
  },
  {
    // Hers, restructured for CON-001: her question was "Atendimento online ou
    // presencial?" and her answer named an office in Guarulhos. The choice is
    // gone, so the question became how the online session works — and her own
    // closing sentence ("pela tela, o trabalho não se faz menos") is kept, since
    // it is the part that answers the doubt underneath the question.
    question: "Como funcionam as sessões on-line?",
    answer:
      "Por chamada de vídeo, no horário combinado, de onde você estiver — em qualquer lugar do Brasil ou do exterior. A estrutura é sempre a mesma: cerca de cinquenta minutos, uma vez por semana, com o mesmo sigilo. Pela tela, o trabalho não se faz menos.",
    category: "pratico",
  },
  {
    // DRAFT. CONCEPT §6 names "confidentiality online" as one of this section's
    // four subjects and nothing in her supplied copy answered it — it was a clause
    // inside the answer above. It is also the first fear about online therapy, and
    // the page's own metadata already promises the answer.
    question: "As sessões on-line são sigilosas?",
    answer:
      "Sim, e o sigilo não muda por ser on-line: nada do que você diz sai da sessão. Não gravo os encontros. O que vale cuidar é do seu lado da tela — um lugar onde você possa falar sem ser ouvido, e fones de ouvido se a casa for cheia.",
    category: "pratico",
  },
  {
    // Hers. "conforme a modalidade e a frequência" lost "modalidade" for CON-001;
    // the frequency-based model and the response window are her own words, not a
    // policy drafted for her. It quotes no number on purpose, so it cannot go
    // stale against A Clínica's fee fields — and it predates the two-door model,
    // which is why TASK-052 asks her whether orientação is priced apart.
    question: "E em relação a valores?",
    answer:
      "Combinamos os valores antes da primeira sessão, conforme a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.",
    category: "pratico",
  },

  // ── Internacional ────────────────────────────────────────────────────────
  {
    // DRAFT. The three real client countries (CONCEPT §3, §6) and the
    // telepsychology line CONCEPT §6 asks to be read as a trust signal rather
    // than as a disclaimer. Worded apart from the mini-FAQ's "Você atende quem
    // mora fora do Brasil?", and agreeing with it on every fact.
    question: "Como funcionam as sessões para quem mora fora do Brasil?",
    answer:
      "Do mesmo modo que para quem mora aqui: por chamada de vídeo, uma vez por semana, em português ou em inglês. Já acompanhei pessoas em Portugal, na Inglaterra e nos Estados Unidos. O atendimento segue a regulamentação brasileira de telepsicologia.",
    category: "internacional",
  },
  {
    // DRAFT. CONCEPT §8.9: every time anchored to horário de Brasília, with the
    // three city examples of §6.
    question: "Como fica a diferença de fuso horário?",
    answer:
      "Os meus horários são sempre no horário de Brasília — é a referência para tudo. Se você mora em Lisboa, em Londres ou em Nova York, eu faço a conta com você e combinamos um horário que funcione dos dois lados.",
    category: "internacional",
  },
  {
    // DRAFT. CONCEPT §8.9's framing, close to verbatim: dólar or euro, agreed in
    // the first conversation, never an automatic conversion. No payment mechanism
    // is named — that is hers to decide and to say.
    question: "Como faço para pagar de fora do Brasil?",
    answer:
      "Valores em dólar ou em euro — combinamos na primeira conversa, junto com a forma de pagamento. Não faço conversão automática do valor em reais: o atendimento a partir de fora tem os seus próprios termos, e prefiro acertá-los conversando.",
    category: "internacional",
  },
  {
    // DRAFT. The languages of CONCEPT §2 — and the reason an anglophone reading
    // the Portuguese page needs to see them stated here.
    question: "As sessões podem ser em inglês?",
    answer:
      "Sim. Atendo em português e em inglês. Se o inglês é a língua em que você vive hoje, ou a língua em que fica mais fácil falar do que sente, é só me dizer na primeira mensagem.",
    category: "internacional",
  },
];
