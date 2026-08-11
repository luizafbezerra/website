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
// **Almost every row here is a placeholder, and that is deliberate.** The page is
// hers to write, through the CMS, with no deploy. Each placeholder is marked with
// `FAQ_PLACEHOLDER_MARK` so it is unmistakable on the page, in the Markdown twin
// and in the FAQPage JSON-LD. The two exceptions are the money answers below,
// which she asked for by name.
//
// This file used to ship sixteen rows: ten drafted here from facts CONCEPT and
// PRODUCT fix, plus six of her own answers carried from the old single-page site.
// The ten went first — they read as finished copy and made the page look answered
// when most of it was not hers. Her six went next: they only covered two of the
// four sections, so the page still shipped half-answered, and a page half in her
// voice and half marked `[A DEFINIR]` reads as an oversight rather than as the
// honest state. Four placeholders said the true thing plainly.
//
// One of her six came back on 2026-08-10, at her own request: the answer about
// valores. It is the only statement on the site of how a value is arrived at, and
// removing it is what left the fee row circular ("a combinar na primeira
// conversa", settled inside the conversation the reader was reading about).
//
// Nothing is lost. Her six answers are in `docs/content-export-2026-08.md` and at
// `git show 6d508ba:src/domain/faq/FaqEntry.ts`; the ten drafts at
// `git show 5060b86:src/domain/faq/FaqEntry.ts`. The drafts also live on as the
// suggested subjects on the `question` field in `src/payload/collections/Faq.ts` —
// the same ground, in the register of a prompt rather than of shipped copy.
//
// **A placeholder must never reach production.** It renders visitor-facing on
// `/perguntas`, in `/perguntas.md` and in the page's FAQPage structured data. While
// any remain, they gate `NEXT_PUBLIC_SITE_INDEXABLE`: the site cannot be indexed
// until each section has at least one real answer.
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

/**
 * One placeholder row for a section. `subject` is the pt-BR noun phrase completing
 * "pergunta sobre …", written at each call site rather than derived from the
 * category: the admin labels live in `src/payload/faqCategories.ts`, and the domain
 * layer does not import from `src/payload/`.
 */
const placeholder = (category: FaqCategory, subject: string): FaqEntry => ({
  question: `${FAQ_PLACEHOLDER_MARK} pergunta sobre ${subject}`,
  answer: `${FAQ_PLACEHOLDER_MARK} esta resposta ainda não existe. O texto desta seção é da Luiza. Enquanto ela não escrever, esta linha fica aqui no lugar dela, e não vai ao ar.`,
  category,
});

// One row per `FAQ_CATEGORY`, in CONCEPT §6's order, plus the two money answers
// she asked for on 2026-08-10. `groupFaqByCategory` renders exactly the sections
// that have questions, so four placeholders is still the minimum that makes all
// four sections appear at all.
//
// **The two `pratico` rows are real.** The first is hers, recovered verbatim from
// `docs/content-export-2026-08.md` — it is the answer the site had and lost, and
// it is the only place on the site that says how a value is arrived at at
// reference length. The second is a draft, and it exists because "sem compromisso"
// beside no mention of money reads as free: a reader who came here to check
// deserves the plain answer rather than an inference. It awaits her sign-off like
// every other draft.
//
// Three placeholders remain, so `NEXT_PUBLIC_SITE_INDEXABLE` stays shut.
export const FAQ_DEFAULTS: FaqEntry[] = [
  placeholder("analise", "a análise"),
  placeholder("orientacao", "a orientação profissional"),
  {
    question: "E em relação a valores?",
    answer:
      "Combinamos os valores antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.",
    category: "pratico",
  },
  {
    question: "A primeira conversa é cobrada?",
    answer:
      "Sim. Ela é uma sessão de trabalho como as outras e é cobrada. O que não existe é compromisso de continuar depois dela: você decide, sem pressa, se quer seguir.",
    category: "pratico",
  },
  placeholder("pratico", "o lado prático"),
  placeholder("internacional", "o atendimento no exterior"),
];
