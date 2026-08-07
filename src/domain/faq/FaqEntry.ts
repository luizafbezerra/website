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
// *Placeholders.* Ten answers used to be drafts — written here, from facts CONCEPT
// and PRODUCT fix, because CONCEPT §6 asks for four sections and her copy filled
// only two. They read as finished copy, which made the page look answered when
// half of it was not hers. Each section now carries exactly **one** placeholder row
// instead, marked with `FAQ_PLACEHOLDER_MARK` so it is unmistakable on the page,
// in the Markdown twin and in the FAQPage JSON-LD. The point is that it cannot be
// mistaken for her voice or shipped by accident.
//
// The ten removed drafts are not lost — recover any of them with
// `git show HEAD:src/domain/faq/FaqEntry.ts` — and several are worth showing her as
// starting points. What replaces a placeholder is her answer, through the CMS, with
// no deploy. TASK-052 owns that pass.
//
// **A placeholder must never reach production.** It renders visitor-facing on
// `/perguntas`, in `/perguntas.md` and in the page's FAQPage structured data.
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

/**
 * Stamped on both sides of every placeholder row. Grep for it before any deploy:
 * a hit means `/perguntas` is still showing a question nobody wrote.
 */
export const FAQ_PLACEHOLDER_MARK = "[A DEFINIR]";

const placeholder = (category: FaqCategory, subject: string): FaqEntry => ({
  question: `${FAQ_PLACEHOLDER_MARK} pergunta sobre ${subject}`,
  answer: `${FAQ_PLACEHOLDER_MARK} esta resposta ainda não existe. O texto desta seção é da Luiza — enquanto ela não escrever, esta linha fica aqui no lugar dela, e não vai ao ar.`,
  category,
});

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
    // Hers. "O consultório atende adultos" became "A clínica atende adultos" for
    // CON-001 — the clinic is online, and the sentence is about who she sees.
    question: "Você atende adolescentes ou crianças?",
    answer:
      "Não. A clínica atende adultos. Para crianças e adolescentes, posso indicar colegas de confiança.",
    category: "analise",
  },
  // Her copy answered two questions about the analysis; CONCEPT §6 expects more.
  placeholder("analise", "a análise"),

  // ── Sobre a orientação profissional ──────────────────────────────────────
  // Nothing in her supplied copy touched this door at all — the whole section was
  // drafted here, so the whole section waits for her.
  placeholder("orientacao", "a orientação profissional"),

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
  // Her four answers here cover format, frequency and fees. Confidentiality — one
  // of CONCEPT §6's four subjects for this section — is still only a clause inside
  // the on-line answer, and deserves her own words.
  placeholder("pratico", "o lado prático"),

  // ── Internacional ────────────────────────────────────────────────────────
  // Drafted here in full, like `orientacao`: time zones, paying from abroad and
  // sessions in English are all things only she can state.
  placeholder("internacional", "o atendimento no exterior"),
];
