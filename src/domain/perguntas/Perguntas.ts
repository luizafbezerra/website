import type { FaqCategory } from "@/domain/faq/FaqCategory";
import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";

// ---------------------------------------------------------------------------
// Perguntas (`/perguntas`) — the frame around the questions, as the page and its
// components consume it. One member per tab in `page-perguntas`, so a field's
// admin path and its render path read the same.
//
// The questions themselves are not here. They are rows of the `faq` collection
// (`FaqEntry`), grouped by `groupFaqByCategory`; this type holds the four section
// *headings* the page prints above them, keyed by the same category. Keeping the
// two apart is what lets her add a question without touching the page, and
// rename a section without touching the questions.
//
// PERGUNTAS_DEFAULTS is what renders when Payload is off or a field is blank, and
// it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** The four section headings are CONCEPT §6's
// own section names, verbatim. The rest — the opening and the closing hand-off —
// is a *draft* stating only facts CONCEPT already fixes: the two services (§4),
// the format and reach (§2, §6), and that the WhatsApp conversation is where
// anything this page does not answer gets answered (§8.1). Nothing here is her
// voice until she says it is, every field is editable in the admin, and TASK-052
// of the master plan owns the review.
// ---------------------------------------------------------------------------

/** One of the four sections of CONCEPT §6 — its heading, and an optional framing line. */
export type PerguntasSection = {
  heading: string;
  /** Null by design: most sections should start straight on the questions. */
  intro: string | null;
};

export type Perguntas = {
  abertura: {
    heading: string;
    intro: string;
  };
  sections: Record<FaqCategory, PerguntasSection>;
  /** The page's one plate, after the last answer — the painting closes the page. */
  plate: PagePlate;
  fecho: {
    heading: string;
    body: string;
    whatsappLabel: string;
    linkLabel: string;
  };
};

export const PERGUNTAS_DEFAULTS: Perguntas = {
  abertura: {
    heading: "Perguntas frequentes",
    // The page's complete answer, in the first screen (REQ-006): which two works
    // the questions are about, in what format, in which languages, and from where
    // somebody may be reading. It carries this alone — the page prints no
    // credential strip, and the questions under it are closed until asked.
    intro:
      "As dúvidas que mais chegam antes de uma primeira conversa: sobre a análise junguiana, sobre a orientação profissional e de carreira, e sobre como o atendimento funciona. Ele é on-line, uma vez por semana, em português ou em inglês, para todo o Brasil e para quem mora no exterior.",
  },
  // CONCEPT §6's four section names, verbatim. No intros: four framing lines
  // before the first answer would delay exactly what the visitor came for, so the
  // field exists for the section that one day needs one and is empty until then.
  sections: {
    analise: { heading: "Sobre a análise", intro: null },
    orientacao: { heading: "Sobre a orientação profissional", intro: null },
    pratico: { heading: "Prático", intro: null },
    internacional: { heading: "Internacional", intro: null },
  },
  plate: EMPTY_PAGE_PLATE,
  fecho: {
    heading: "Ficou uma pergunta de fora?",
    body: "Escreva mesmo assim. O que esta página não responde, eu respondo por mensagem.",
    whatsappLabel: "escrever no WhatsApp",
    linkLabel: "o que acontece na primeira conversa",
  },
};
