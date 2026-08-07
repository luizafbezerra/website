import type { PageImage } from "@/domain/media/PageImage";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// Sobre (`/sobre`) — the four sections of CONCEPT §6 plus the page's own opening,
// as the page and its components consume them. One member per tab in `page-sobre`,
// so a field's admin path and its render path read the same.
//
// SOBRE_DEFAULTS is what renders when Payload is off or a field is blank, and it
// is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** Two kinds sit side by side, and the
// difference matters (CONCEPT §11). After her 2026-08-07 text landed, most of
// this page is hers.
//
//  - **Hers, verbatim** — pinned by `src/domain/sourceCopy.test.ts`:
//    `quemE.heading` and paragraphs 1, 4 and 5 of `quemE.body` (the bio she wrote
//    for the old home's "sobre" section, carried here because this is the page
//    that owns it now); paragraphs 2 and 3 of `quemE.body` (SRC-E.1–E.3, which
//    replaced our drafted account of the same facts); `formacao.intro`
//    (SRC-E.4); and every `formacao.items` title (SRC-E.5).
//  - **Draft** — the abertura, the clínica story and the closing line. Each
//    states only facts CONCEPT and PRODUCT already fix: the Instagram account and
//    the name passing from the page to the clinic (§6, §5), the reach and the
//    languages (§2). Nothing drafted here is her voice until she says it is,
//    every field is editable in the admin, and TASK-052 owns the review.
//
// Nothing in this file invents a fact about her record. `period` is unset on all
// six formação rows because not even her own text states a year, and a guessed
// year on a page whose whole job is verification is the one error this page
// cannot afford.
//
// Every correction to her text is a vetoable row in
// `docs/source-copy-2026-08-07.md`. Nothing here may edit her prose without
// adding a row there first.
// ---------------------------------------------------------------------------

/**
 * One line of the academic record. `institution` and `period` are nullable
 * because the record may be stated at whatever precision she has confirmed —
 * a course with no year prints as a course with no year, never as a guess.
 */
export type FormacaoItem = {
  title: string;
  institution: string | null;
  period: string | null;
};

export type Sobre = {
  abertura: {
    heading: string;
    lead: RichTextContent;
  };
  quemE: {
    heading: string;
    body: RichTextContent;
    /** The page's image moment (CONCEPT §7.1) — `null` until the shoot happens. */
    portrait: PageImage | null;
  };
  formacao: {
    heading: string;
    /**
     * Her one sentence on why the record is long, read before the record itself.
     * Nullable because the list stands on its own — an empty intro renders no
     * paragraph rather than an empty one.
     */
    intro: string | null;
    items: FormacaoItem[];
  };
  aClinica: {
    heading: string;
    body: RichTextContent;
    linkLabel: string;
  };
};

export const SOBRE_DEFAULTS: Sobre = {
  abertura: {
    // Her name is the page's `h1`: /sobre is the address the entity graph gives
    // the `Person` node, so the strongest possible heading here is the name a
    // reader (or an assistant) searched for.
    heading: "Luiza Fernandes Bezerra",
    // The AEO front-load (REQ-012), in her first person: who, what, for whom,
    // in which languages, from where — before any section begins.
    lead: richText([
      "Sou psicóloga clínica e trabalho na tradição da psicologia analítica de Jung. Atendo adultos em análise e em orientação profissional e de carreira, sempre on-line, em português ou em inglês, em qualquer lugar do Brasil ou do exterior.",
      "Esta página é para você me conhecer antes de escrever: quem eu sou, onde me formei e como esta clínica nasceu.",
    ]),
  },
  quemE: {
    // Hers, verbatim — the heading and bio of the old home's "sobre" section.
    heading: "Uma escuta cuidadosa, na tradição junguiana.",
    body: richText([
      "Sou psicóloga clínica. Atendo adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
      // Hers, verbatim (SRC-E.1 + SRC-E.2), replacing the draft that stated the
      // same two facts in our words. `22` is spelled out under GUD-002, ledger
      // row 8 — which is also what the draft it replaced already said. The year
      // stays in digits: it is a date, not a count.
      "A minha jornada na psicologia já soma vinte e dois anos, com atuação direta na clínica desde 2014. Meu objetivo é oferecer um espaço seguro de escuta, reflexão e transformação para quem busca se conhecer de forma autêntica e profunda.",
      // Hers, verbatim (SRC-E.3) — the Jung origin story in full, which the draft
      // had compressed to one clause. Two corrections, ledger rows 4 and 5:
      // `pós graduações` → `pós-graduações`, and `À primeira vez que entrei` →
      // `Na primeira vez em que entrei`. Her exclamation mark stays, and so does
      // "do Carl Gustav Jung" — the article before the name is São Paulo speech,
      // not an error, and CON-003 does not license changing register (OPEN-E).
      //
      // The italic run is inherited from the draft: `um caminho sem volta` is the
      // phrase PRODUCT quotes as hers, and it is the sentence's turn.
      [
        {
          text: "A minha abordagem teórica e acadêmica é a Psicologia Analítica do Carl Gustav Jung. Na primeira vez em que entrei em contato com a sua teoria, estava no segundo ano de faculdade, foi ",
        },
        { text: "um caminho sem volta", italic: true },
        {
          text: " para mim! Desde então fiz matérias focadas nessa linha, assim como o TCC e posteriormente as pós-graduações.",
        },
      ],
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.",
      "As primeiras sessões servem para vermos juntos se podemos seguir.",
    ]),
    portrait: null,
  },
  formacao: {
    // The heading is the section's whole editorial gesture: one word, no promise.
    heading: "Formação",
    // Hers, verbatim (SRC-E.4). It is why the list below is long, said once,
    // before the list — the only editorial line this section gets.
    intro: "Acredito que o cuidado com o outro exige estudo constante e aprofundamento rigoroso.",
    // **Her own course names**, from her 2026-08-07 text (SRC-E.5), in the order
    // she gave them. This file used to say that no source document named two of
    // these courses and that inferring them would be inventing a line of her CV.
    // Her text names all six, so the two truncated rows are now complete:
    // "Pós-graduação" → "Pós-graduação em Psicologia Clínica", and "Extensão em
    // Fenômenos Anômalos" → "Extensão em Psicologia, Religião e Fenômenos
    // Anômalos". The two aprimoramentos also take her full titles, capitalised as
    // she capitalises them.
    //
    // She wrote the third and fourth as one line ("Aprimoramento em Psicologia
    // Clínica Junguiana e em Orientação Profissional e de Carreira, ambos pela
    // PUC-SP") and the fifth and sixth as one ("Cursos de Extensão: … e …").
    // Splitting each into its two courses is what the `FormacaoItem` shape is
    // for; it changes no word of hers.
    //
    // `period` is still null on all six: her text supplies no years, and a
    // guessed year on the page whose whole job is verification is the one error
    // this page cannot afford (CON-007).
    items: [
      { title: "Graduação em Psicologia", institution: "PUC-SP", period: null },
      {
        title: "Pós-graduação em Psicologia Clínica",
        institution: "Instituto Numen",
        period: null,
      },
      {
        title: "Aprimoramento em Psicologia Clínica Junguiana",
        institution: "PUC-SP",
        period: null,
      },
      {
        title: "Aprimoramento em Orientação Profissional e de Carreira",
        institution: "PUC-SP",
        period: null,
      },
      { title: "Extensão em Psicologia e Religião", institution: "PUC-SP", period: null },
      {
        title: "Extensão em Psicologia, Religião e Fenômenos Anômalos",
        institution: "USP",
        period: null,
      },
    ],
  },
  aClinica: {
    heading: "De uma página a uma clínica",
    body: richText([
      "Símbolos do Self nasceu como uma página: pinturas clássicas e frases de Jung, uma a uma, para mais de quarenta e cinco mil pessoas. O nome passou da página para a clínica.",
      "Símbolos do Self é o lugar; eu sou quem recebe você nele. Na página, as imagens ficam por si; na clínica, elas viram trabalho — entre duas pessoas, no tempo de quem chega.",
      // "on-line" is in the page's lead and in the credential strip above; a third
      // and fourth occurrence on one page is a defect (GUD-001).
      "O atendimento é em português ou em inglês, para todo o Brasil e para quem mora fora.",
    ]),
    linkLabel: "como é a primeira conversa",
  },
};
