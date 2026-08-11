import type { PageImage } from "@/domain/media/PageImage";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";

// ---------------------------------------------------------------------------
// Início (`/`) — the eleven sections of CONCEPT §6 in scroll order, as the page
// and its components consume them. One member per section, named after the tab
// that owns it in `page-inicio`, so a field's admin path and its render path
// read the same.
//
// Section 2 (Credencial) has no member: the strip appears on every core page,
// so it is A Clínica's `credentials`, read straight off `Clinica`.
//
// INICIO_DEFAULTS is what renders when Payload is off or a field is blank, and
// it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** Two kinds live here, and the difference
// matters (CONCEPT §11: nothing ships in her name that she did not write).
//   · Hers, verbatim — the hero lead, the Vozes title, the contato eyebrow and
//     heading. Carried across from the pre-CONCEPT home, which is where she wrote
//     them. `contato.body` was hers too until she asked for the paid-session fact
//     to be stated (2026-08-10); the insertion is ledger row 11.
//   · Structural drafts — the section headings and the short connective copy for
//     the four sections that never existed before (dois caminhos, o sintoma,
//     Brasil e exterior, como é começar). These state facts CONCEPT and PRODUCT
//     already fix — the two doors and the boundary sentence (§4), the reach and
//     the languages, the three beats of starting — in the plainest wording that
//     carries them. They are drafts awaiting her sign-off, not her voice, and
//     every one is editable in the admin.
// ---------------------------------------------------------------------------

/** One door of CONCEPT §4, as the home introduces it. */
export type Door = {
  title: string;
  body: string;
  linkLabel: string;
};

/** One beat of "como é começar". */
export type Beat = { numeral: string; text: string };

export type Inicio = {
  hero: {
    lead: RichTextContent;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    portrait: PageImage | null;
  };
  /**
   * Only her words about the section. The posts themselves are her live feed
   * (`src/domain/instagram/`), fetched hourly and never stored, so there is
   * nothing here for her to curate.
   */
  instagram: {
    heading: string;
    intro: string | null;
  };
  doisCaminhos: {
    heading: string;
    intro: string | null;
    analysis: Door;
    careerGuidance: Door;
    boundary: string | null;
  };
  oSintoma: {
    heading: string;
    body: RichTextContent;
    linkLabel: string;
  };
  cosmos: {
    /**
     * The marginalia beside the wow slot. The slot's substitute — O céu desta
     * noite (CONCEPT §9.5) — carries no other authored content: the chart is
     * computed, not curated.
     */
    caption: string | null;
  };
  sobreDigest: {
    heading: string;
    body: RichTextContent;
    linkLabel: string;
  };
  brasilExterior: {
    heading: string;
    body: string;
    linkLabel: string;
  };
  comoComecar: {
    heading: string;
    beats: Beat[];
    linkLabel: string;
  };
  vozes: { heading: string };
  contato: {
    eyebrow: string;
    heading: string;
    body: RichTextContent;
    whatsappLabel: string;
  };
};

export const INICIO_DEFAULTS: Inicio = {
  hero: {
    // Hers, verbatim.
    lead: richText([
      [
        {
          text: "Atendo pessoas em momentos em que a vida cotidiana já não dá conta do que está acontecendo: uma ",
        },
        { text: "ansiedade", italic: true },
        { text: " que não passa, um " },
        { text: "luto", italic: true },
        {
          text: " recente, um trabalho que perdeu o sentido. Escuto o que insiste e o que ainda não encontrou palavras.",
        },
      ],
    ]),
    ctaPrimaryLabel: "conversar pelo WhatsApp",
    ctaSecondaryLabel: "como é a primeira conversa",
    portrait: null,
  },
  instagram: {
    // The section is titled as the world's own name for it (CONCEPT §6.3): the
    // feed is where a follower already knows her, so the heading names the feed,
    // not the website's idea of it.
    heading: "O que eu publico",
    intro:
      "No Instagram, tudo passa depressa. Aqui cada publicação fica no centro, uma por vez, com o texto que a acompanha.",
  },
  doisCaminhos: {
    heading: "Dois caminhos",
    intro: null,
    analysis: {
      title: "Análise",
      body: "Psicoterapia de orientação analítica, semanal e sem prazo marcado. Para quem chega com ansiedade, com um luto, com relações que pesam, ou com a sensação de que o trabalho perdeu o sentido.",
      linkLabel: "conhecer a análise",
    },
    careerGuidance: {
      title: "Orientação profissional e de carreira",
      body: "Um percurso com começo, meio e fim: até doze encontros semanais com testes, conversas e atividades, para chegar à profissão que faz mais sentido no momento atual da sua vida.",
      linkLabel: "conhecer a orientação",
    },
    // CONCEPT §4's routing sentence, in her site's own words.
    boundary:
      "Quando a pergunta é o sentido do trabalho, o caminho é a análise. Quando a pergunta é qual profissão, é a orientação.",
  },
  oSintoma: {
    heading: "O sintoma como chamado",
    body: richText([
      // The tradition is named in the hero positioning and in the Análise door
      // above; naming it a third time here put the page over budget (GUD-001).
      "Há coisas que insistem: a ansiedade que volta, o sonho que se repete, o cansaço que não passa com descanso. Raramente são apenas um defeito a corrigir. São uma forma de a psique dizer algo que ainda não coube em palavras.",
      "O trabalho é escutar esse chamado até entender do que ele trata, em vez de silenciá-lo.",
    ]),
    linkLabel: "como eu trabalho",
  },
  cosmos: {
    caption: null,
  },
  sobreDigest: {
    heading: "Quem recebe você",
    // Hers, verbatim — the opening of the bio she wrote for the old home.
    body: richText([
      "Sou psicóloga clínica. Atendo pessoas que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa.",
    ]),
    linkLabel: "sobre a Luiza",
  },
  brasilExterior: {
    heading: "Brasil e exterior",
    // "on-line" is deliberately absent: the hero's positioning sentence and the
    // credential strip both say it before a reader reaches this section, and a
    // fourth occurrence on one page is a defect rather than emphasis (GUD-001).
    //
    // The countries left this sentence on 2026-08-10, when she added two more:
    // the strip below names all of them, with the local hour beside each, and a
    // list carried by prose is a list that has to be rewritten every time it
    // grows.
    body: "O atendimento é em português ou em inglês, no seu fuso. Morar fora não interrompe uma análise.",
    linkLabel: "quem mora fora",
  },
  comoComecar: {
    heading: "Como é começar",
    beats: [
      {
        numeral: "I",
        text: "Você me escreve pelo WhatsApp. Uma mensagem curta basta. Não precisa contar tudo de uma vez.",
      },
      {
        numeral: "II",
        // Two words carry her 2026-08-10 correction: "o valor e". The beat used to
        // read "Combinamos um horário … sem compromisso de seguir", and a reader
        // with no mention of money in sight supplied the missing fact themselves —
        // that a conversation nobody had priced was free. Naming the value of the
        // first conversation makes that reading unavailable, and the beat stays one
        // line, which is what a three-beat skim is for. The value comes first
        // because it is the fact that was missing. The page still states it
        // outright further down, in her own Contato paragraph; this beat only has
        // to stop being deniable.
        text: "Combinamos o valor e o horário para uma primeira conversa de cinquenta minutos, sem compromisso de seguir.",
      },
      {
        numeral: "III",
        text: "Depois dela, você decide. Se fizer sentido para nós dois, marcamos o encontro semanal.",
      },
    ],
    linkLabel: "a primeira conversa em detalhe",
  },
  // Hers.
  vozes: { heading: "Pacientes contam" },
  contato: {
    // Hers, verbatim — except `body`, which now carries the paid-session fact she
    // asked for on 2026-08-10 (ledger row 11). Her sentence is otherwise word for
    // word: only "sem compromisso" was completed into "sem compromisso de
    // continuar", and the arrangement of the value added beside the time.
    eyebrow: "Para começar",
    heading: "Uma conversa breve costuma ser o suficiente para vermos se faz sentido.",
    body: richText([
      "O caminho mais simples é o WhatsApp. Você me escreve uma mensagem curta (não precisa contar tudo de uma vez) e combinamos o valor e um horário para uma primeira conversa. É uma sessão cobrada, sem compromisso de continuar. A partir dela decidimos juntos como seguir.",
    ]),
    whatsappLabel: "Conversar pelo WhatsApp",
  },
};
