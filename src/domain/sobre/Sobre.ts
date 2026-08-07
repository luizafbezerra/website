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
// difference matters (CONCEPT §11):
//
//  - `quemE.heading` and the first, third and fourth paragraphs of `quemE.body`
//    are **hers, verbatim** — the bio she wrote for the old home's "sobre"
//    section, carried here because this is the page that owns it now. They were
//    literals in `seed/pages.ts` until this page existed; the defaults are their
//    only home in code.
//  - everything else is a **draft**: the abertura, the second paragraph of her
//    bio, the formação record, the clínica story and the closing line. Each
//    states only facts CONCEPT and PRODUCT already fix — her academic record
//    (§6/PRODUCT "Evidence on hand"), the twenty-two years and the 2014 date
//    (§6), the Instagram account and the name passing from the page to the clinic
//    (§6, §5), the reach and the languages (§2). Nothing here is her voice until
//    she says it is, every field is editable in the admin, and TASK-052 owns the
//    review.
//
// Nothing in this file invents a fact about her record. `period` is unset on all
// six formação rows because no source document states a year, and a guessed year
// on a page whose whole job is verification is the one error this page cannot
// afford.
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
      // Drafted from CONCEPT §6's three facts about her history. Her own bio does
      // not carry them, and this is the section the map says they belong to.
      [
        {
          text: "Estou na psicologia há vinte e dois anos e atendo em clínica desde 2014. Encontrei Jung no segundo ano da faculdade e, de lá para cá, foi ",
        },
        { text: "um caminho sem volta", italic: true },
        { text: "." },
      ],
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.",
      "As primeiras sessões servem para vermos juntos se podemos seguir.",
    ]),
    portrait: null,
  },
  formacao: {
    // The heading is the section's whole editorial gesture: one word, no promise.
    heading: "Formação",
    // CONCEPT §6's record, in the order it states it. Two rows say only
    // "Pós-graduação" and nothing more precise because no source document names
    // the course; inferring one from the institution's specialism would be
    // inventing a line of her CV.
    items: [
      { title: "Graduação em Psicologia", institution: "PUC-SP", period: null },
      { title: "Pós-graduação", institution: "Instituto Numen", period: null },
      { title: "Aprimoramento em clínica junguiana", institution: "PUC-SP", period: null },
      { title: "Aprimoramento em orientação profissional", institution: "PUC-SP", period: null },
      { title: "Extensão em Psicologia e Religião", institution: "PUC-SP", period: null },
      { title: "Extensão em Fenômenos Anômalos", institution: "USP", period: null },
    ],
  },
  aClinica: {
    heading: "De uma página a uma clínica",
    body: richText([
      "Símbolos do Self nasceu como uma página: pinturas clássicas e frases de Jung, uma a uma, para mais de quarenta e cinco mil pessoas. O nome passou da página para a clínica.",
      "Símbolos do Self é o lugar; eu sou quem recebe você nele. Na página, as imagens ficam por si; na clínica, elas viram trabalho — entre duas pessoas, no tempo de quem chega.",
      "O atendimento é on-line, em português ou em inglês, para todo o Brasil e para quem mora fora.",
    ]),
    linkLabel: "como é a primeira conversa",
  },
};
