import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// Brasil e exterior (`/internacional`) — the five sections of CONCEPT §6, as the
// page and its components consume them. One member per tab in
// `page-internacional`, so a field's admin path and its render path read the same.
//
// INTERNACIONAL_DEFAULTS is what renders when Payload is off or a field is blank,
// and it is also what the seed writes on a fresh database.
//
// **On the copy in these defaults.** One sentence is *hers, verbatim* — the first
// paragraph of `abertura.body` (SRC-G.1 of her 2026-08-07 text, pinned by
// `src/domain/sourceCopy.test.ts`). It is the only thing she has written for this
// page, and it is the one thing the page most needed: the reason the format is
// online at all.
//
// Everything else is a *draft*. This page did not exist before CONCEPT v3, so
// every other string here states only facts CONCEPT and PRODUCT already fix: the
// five real client countries (§3, §6), Brazilian telepsychology regulation as a
// trust signal (§6), sessions in pt/en (§2), the horário de Brasília anchor and
// the USD/EUR framing with no automatic conversion (§8.9), and WhatsApp before
// the first session as the mechanism for anything undecided (§14.1, corrected on
// 2026-08-10: it used to read "combinamos na primeira conversa", which put the
// price inside the session it was pricing). Nothing drafted here is her voice
// until she says it is, every field is editable in the admin, and TASK-052 of the
// master plan owns the review.
//
// Two things are deliberately *not* claimed anywhere in this file: any licence,
// registration or right to practise in another country (she is a Brazilian
// psychologist working online under Brazilian regulation — that is exactly what
// the trust line says), and any named payment provider or banking mechanism (no
// source document states one, so the page says the arrangement is made on
// WhatsApp before the first session and stops there).
//
// The international bilhete opener is NOT here: it is a cross-page fact and lives
// in A Clínica (`clinica.notes.international`), which is what `Comecar` reads.
// ---------------------------------------------------------------------------

/**
 * CONCEPT §6's third section: English prose *inside* the Portuguese page, with a
 * link to the English site. Its fields are not localized — the section is written
 * in English once — and `inEnglishSectionFor` decides where it renders.
 */
export type InEnglishSection = { heading: string; body: string; linkLabel: string };

export type Internacional = {
  abertura: {
    heading: string;
    body: RichTextContent;
    /** The telepsychology signal (CONCEPT §6). Body type, never a footnote. */
    trustLine: string;
  };
  brasileirosFora: {
    heading: string;
    body: RichTextContent;
    plate: PagePlate;
  };
  inEnglish: InEnglishSection;
  pratico: {
    heading: string;
    items: FactRow[];
  };
  comecar: {
    heading: string;
    body: string;
    linkLabel: string;
  };
};

export const INTERNACIONAL_DEFAULTS: Internacional = {
  abertura: {
    // The expat query words, in the words expats actually type (CONCEPT §10):
    // "psicóloga brasileira online exterior". The nav and the page title keep
    // CONCEPT's own name for the page; the h1 answers the visitor's question.
    heading: "Psicóloga brasileira on-line, para quem mora fora",
    // The page's whole answer in the first screen (REQ-012): why the format is
    // what it is, who she attends, in which languages, how, and the real client
    // history that makes it credible rather than a market claim.
    //
    // Paragraph 1 is **hers, verbatim** (SRC-G.1), corrected to the house spelling
    // `on-line` — the form she herself uses in SRC-A and SRC-B (ledger row 7).
    // It earns the opening because it gives the reason before the fact: the page
    // is about distance not being an obstacle, and she says so first.
    body: richText([
      "Para garantir que a distância não seja um obstáculo para o seu processo de autoconhecimento, os meus atendimentos acontecem no formato on-line.",
      "Atendo pessoas que moram fora do Brasil e pessoas de outros países, em português ou em inglês, por chamada de vídeo.",
      "Análise e orientação profissional e de carreira, em encontros semanais. O fuso, o idioma e o pagamento a gente acerta antes, pelo WhatsApp.",
    ]),
    // The appositive ", on-line," is gone: the h1, her opening sentence and the
    // credential strip all say it above this line (GUD-001).
    trustLine:
      "O atendimento segue a regulamentação brasileira de telepsicologia: é assim que uma psicóloga brasileira atende quem vive em outro país.",
  },
  brasileirosFora: {
    heading: "Para brasileiros fora do Brasil",
    // The measure of the difference is no longer written here: `HorasDaClinica`
    // computes it live, one row per country, so the section says what the work is
    // and the list says how far away it is. The three hand-written notes it
    // replaced had to hedge into ranges ("três ou quatro horas à frente, conforme
    // o horário de verão europeu"), because Brazil stopped observing daylight
    // saving time in 2019 and Europe and North America did not.
    body: richText([
      "Você não precisa estar no Brasil para começar, nem interromper o que já começou porque se mudou. O trabalho acontece em português, por chamada de vídeo, de onde você mora.",
    ]),
    plate: EMPTY_PAGE_PLATE,
  },
  // Written in English, not translated: this is the section an anglophone reads
  // on the Portuguese page. CON-002 — "clinical psychologist working in the
  // analytical-psychology tradition", never "Jungian analyst", which is a
  // protected title.
  inEnglish: {
    heading: "In English",
    body: "I am a Brazilian clinical psychologist working in the analytical-psychology tradition, entirely online. Analytically-oriented psychotherapy and career guidance are available in English, by video call, wherever you live. We settle the time zone, the language and payment beforehand, over WhatsApp. Sessions follow Brazilian telepsychology regulation.",
    linkLabel: "the whole site in English",
  },
  pratico: {
    // CONCEPT §6 names the section "Prático"; the heading a visitor reads is a
    // sentence opener rather than a label.
    heading: "Na prática",
    // No BRL row is composed on this page (`fees="none"`): quoting reais to a
    // reader who pays in euros is the automatic conversion CONCEPT §8.9 forbids,
    // one step removed. The currency framing is the "Valores" row below, in body
    // type inside the fact list, because on this page it *is* the price
    // statement and DESIGN keeps operational facts out of decorative small type.
    items: [
      {
        label: "Fusos",
        value:
          "A referência é o horário de Brasília. Eu faço a conta com você e ofereço horários que já cabem no seu dia.",
      },
      {
        label: "Valores",
        value:
          "Para quem mora fora do Brasil, os valores são em dólar ou em euro. Combinamos o valor e a forma de pagamento antes da primeira sessão, pelo WhatsApp.",
      },
      {
        label: "Como acontece",
        value: "Por chamada de vídeo. Eu envio o link antes de cada encontro.",
      },
      { label: "Idiomas", value: "Português ou inglês, como você preferir." },
      {
        label: "De onde",
        value:
          "De qualquer lugar do mundo. Você precisa de uma conexão estável e de um lugar onde possa falar sem ser interrompido.",
      },
    ],
  },
  comecar: {
    heading: "Começar de onde você está",
    body: "Me escreva contando de onde você fala. Isso já resolve metade do que a gente precisa combinar; o resto — valor, horário, idioma — acertamos por lá, antes da primeira conversa. Ela é uma sessão cobrada, sem compromisso de continuar.",
    linkLabel: "conhecer a primeira conversa",
  },
};
