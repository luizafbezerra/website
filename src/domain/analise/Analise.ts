import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import { ZODIAC_SIGN_IDS, type ZodiacSignId } from "@/domain/zodiac/zodiacContent";

// ---------------------------------------------------------------------------
// A Análise (`/analise`) — five bands (the 2026-08 condensation of CONCEPT §6's
// seven sections): abertura · o que as pessoas trazem · como o trabalho acontece
// · na prática (with the ask folded in) · a mandala, which closes the page after
// the ask the way the Cosmos closes the home. Sonho ampliado remains a sixth,
// normally absent band gated on her curation. One member per tab in
// `page-analise`, so a field's admin path and its render path read the same.
//
// ANALISE_DEFAULTS is what renders when Payload is off or a field is blank, and
// it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** After her 2026-08-07 text landed, this is
// the page with the most of her own writing on it. *Hers, verbatim* — never to be
// reworded, and pinned by `src/domain/sourceCopy.test.ts`:
//
//   · `oMetodo.body` — the five paragraphs she rewrote herself, rescued from the
//     database in TASK-026, which is why they moved from the pillars' intro to
//     the method section. Two mechanical corrections; see `METODO_INTRO`.
//   · the three `oQueTrazem.pillars`
//   · `abertura.body` paragraph 2 (SRC-F.1)
//   · `oMetodo.individuacao` (SRC-F.2), minus its closing guardrail sentence
//   · `oMetodo.closingLine` (SRC-F.4)
//   · `pratico.comecar.body` (SRC-H)
//
// `oMetodo.toolsLine` is her vocabulary condensed rather than her sentences
// carried over — the one field on this page where that was necessary, and the
// ledger's OPEN-B. Everything else is a *draft* stating only facts CONCEPT
// already fixes. Drafts state facts plainly; only her words get to be profound.
// Nothing drafted here is her voice until she says it is; TASK-052 owns the
// review.
//
// Every correction to her text is a vetoable row in
// `docs/source-copy-2026-08-07.md`. Nothing in this file may edit her prose
// without adding a row there first.
//
// Two policies bind this page harder than any other:
//   · **Individuação is described, never promised** (CONCEPT §11). `oMetodo`'s
//     individuação note says so in its own words.
//   · **The wheel's readings are hers alone** (REQ-007). All twenty-four are
//     `null` here and seeded empty; the wheel speaks through the painting and
//     its scholarly reference until she writes them.
//
// The fee is NOT here — it is composed from A Clínica (REQ-005). Neither are the
// WhatsApp openers: they are cross-page facts in `clinica.notes`. The who-line
// under the h1 is composed from A Clínica too, never typed into a page.
// ---------------------------------------------------------------------------

/** One of the three pillars, I–III. */
export type Pillar = { numeral: string; title: string; text: string };

/**
 * Her prose for one sign of the wheel, both halves optional and both empty at
 * launch (REQ-007). A null reading renders nothing at all — never a placeholder
 * frame, because a missing paragraph is not a missing asset, and announcing the
 * gap to a visitor would be worse than the wheel simply being visual.
 */
export type SignReading = { reading: string | null; vedicReading: string | null };

/** One parallel set beside the dream motif (CONCEPT §9.3). */
export type DreamParallel = {
  label: string;
  text: string | null;
  plate: PagePlate;
};

export type Analise = {
  abertura: {
    heading: string;
    body: RichTextContent;
  };
  oQueTrazem: {
    heading: string;
    note: string;
    pillars: Pillar[];
    boundary: string;
    linkLabel: string;
  };
  oMetodo: {
    heading: string;
    /** Her five paragraphs, verbatim — the section's spine. */
    body: RichTextContent;
    /** How a session goes and what it works with, in place of three titled blocks. */
    toolsLine: string;
    /** The whole person and individuação — described, never promised. */
    individuacao: RichTextContent;
    /** Hers, verbatim. Exempt from the humanize pass (CON-005). */
    closingLine: string;
    plate: PagePlate;
  };
  sonhoAmpliado: {
    heading: string;
    intro: string;
    /** Empty hides the whole section — see `sonhoAmpliadoFrom`. */
    motif: string | null;
    parallels: DreamParallel[];
    closingLine: string | null;
  };
  pratico: {
    heading: string;
    items: FactRow[];
    /** The ask, folded into the practical band rather than a section of its own. */
    comecar: { body: string; linkLabel: string };
  };
  mandala: {
    heading: string;
    intro: string;
    readings: Record<ZodiacSignId, SignReading>;
  };
};

/** Twelve signs, no prose. The shape her admin edits fill in one field at a time. */
export const EMPTY_SIGN_READINGS: Record<ZodiacSignId, SignReading> = Object.fromEntries(
  ZODIAC_SIGN_IDS.map((id) => [id, { reading: null, vedicReading: null }]),
) as Record<ZodiacSignId, SignReading>;

/**
 * Her own account of how she works — five paragraphs, verbatim, carried here
 * from `src/payload/seed/pages.ts` where TASK-026 rescued them from the database
 * before the destructive migration. This is content, not code: never reword it,
 * never trim it, never "improve" its rhythm.
 *
 * **Two mechanical corrections, and only two.** She authorised grammar fixes on
 * 2026-08-07 under a closed licence (plan CON-003), so paragraph 4 now reads
 * `é ditado` for her `são ditados` (the subject is *o conteúdo*, singular) and
 * `“anticapitalista”` for her `“anti capitalista”` (the prefix takes no hyphen
 * before a consonant). Both are logged as vetoable rows 1 and 2 in
 * `docs/source-copy-2026-08-07.md`, which is where any further edit has to be
 * argued before it is made.
 *
 * Her curly quotes stay curly and her em dashes stay em dashes. `writing:humanize`
 * §14 and §19 are suspended for this codebase precisely because of this
 * paragraph (plan CON-004) — its typography is the voice sample the skill's own
 * precedence rule defers to.
 */
const METODO_INTRO = richText([
  "Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
  "Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.",
  "Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.",
  "Gosto de dizer que a psicologia clínica é o trabalho mais “anticapitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros é ditado pelo paciente, de acordo com aquilo que ele está preparado para trazer.",
  "Eu só farei pontuações daquilo que acredito que você esteja preparado para receber, respeitando o tempo do seu processo e a sua subjetividade. Não existe pressa no processo de individuação.",
]);

/** The three themes of CONCEPT §4's first door, as she wrote them. Verbatim. */
const PILLARS: Pillar[] = [
  {
    numeral: "I",
    title: "Ansiedade & humor",
    text: "Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados querem dizer.",
  },
  {
    numeral: "II",
    title: "Relações & vida",
    text: "Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar para dentro e distinguir o que é nosso do que é do outro.",
  },
  {
    numeral: "III",
    title: "Carreira & propósito",
    text: "Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.",
  },
];

export const ANALISE_DEFAULTS: Analise = {
  abertura: {
    // The h1 is the page's own name. It used to carry "junguiana" as the search
    // term; the tradition is named "psicologia analítica" throughout now — the
    // name Jung himself chose — and the term the page targets lives in the meta
    // title and in paragraph 1 below.
    heading: "A análise",
    // Paragraph 1 is the AEO front-load (REQ-012): what it is, how often, in
    // which languages, from where. The who-line rendered under it comes from A
    // Clínica. Paragraph 2 is **hers, verbatim** (SRC-F.1) — it says what the
    // drafted paragraph it replaced was reaching for, in her own frame: the
    // symptom has a purpose. Her lead-in sentence ("Eu trabalho com a Psicologia
    // Analítica, desenvolvida por Carl Gustav Jung.") is deliberately absent,
    // because paragraph 1 already names the tradition and repeating it here
    // spends the GUD-001 budget on nothing; that omission is OPEN-D in the
    // ledger and it is hers to overrule.
    body: richText([
      "A análise é um espaço seguro de escuta, reflexão e transformação: psicoterapia de orientação analítica, on-line, em encontros semanais, em português ou em inglês, de qualquer lugar do Brasil ou do exterior.",
      "Diferente de abordagens que focam apenas em calar um sintoma (como a ansiedade ou a angústia), a clínica da psicologia profunda entende que o sintoma tem um propósito: ele é um chamado do nosso inconsciente pedindo atenção.",
    ]),
  },
  oQueTrazem: {
    // Recognition before method: the cold searcher's first question is "does she
    // work with what I have", so the pillars are the page's second band.
    heading: "O que as pessoas trazem",
    note: "Três frentes que costumam trazer alguém à análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
    pillars: PILLARS,
    // CONCEPT §4's boundary sentence, in prose: sentido do trabalho → análise ·
    // qual profissão → orientação. The two doors overlap at pillar III by design.
    boundary:
      "Quando a pergunta é o sentido do trabalho na sua vida, ela é matéria de análise. Quando a pergunta é qual profissão seguir, existe um caminho mais direto: a orientação profissional e de carreira, um programa com começo, meio e fim.",
    linkLabel: "conhecer a orientação profissional e de carreira",
  },
  oMetodo: {
    heading: "Como o trabalho acontece",
    // Hers, verbatim — the drafted paraphrase that once opened this section is
    // gone; her own five paragraphs are the section.
    body: METODO_INTRO,
    // Her vocabulary, condensed to one field. SRC-F.3 is a paragraph plus three
    // bullets, and this band holds a single line (CONCEPT §6), so this is the
    // **one place her text did not land verbatim** — printing her bullets as
    // bullets needs a repeatable field, which is OPEN-B in the ledger and her
    // call to make.
    toolsLine:
      "As sessões são um espaço de diálogo livre, acolhedor e sem julgamentos. Além da conversa, o trabalho recorre a ferramentas simbólicas para alcançar o que está além do racional: os sonhos, as imagens, fantasias e símbolos do seu dia a dia, os padrões que se repetem e bloqueiam o seu desenvolvimento.",
    // Hers, verbatim (SRC-F.2), with the italic run on `Individuação` where she
    // capitalised it. The closing sentence is **ours**: CONCEPT §11's guarantee
    // that individuação is described, never promised. Her prose describes a
    // continuous process and so already satisfies the rule, which is why whether
    // this sentence stays is OPEN-C in the ledger rather than settled here.
    individuacao: richText([
      [
        {
          text: "Nesta abordagem, olhamos para o ser humano de forma integral. Nós exploramos não apenas a sua história de vida e seus desafios conscientes, mas também a linguagem do seu mundo interno. Trabalhamos com a ideia de ",
        },
        { text: "Individuação", italic: true },
        {
          text: " — o processo contínuo de se tornar quem você realmente é, integrando suas luzes e sombras. É um conceito que descreve a direção do trabalho, não um resultado que a análise prometa.",
        },
      ],
    ]),
    // Hers, verbatim and in full (SRC-F.4). CONCEPT §6 quoted only its first
    // sentence; her 2026-08-07 text gives the whole thing.
    //
    // **Exempt from the humanize pass.** The `-ing` tail ("promovendo…") and the
    // closing triad ("equilíbrio, sentido e vitalidade") are the two patterns
    // `writing:humanize` §3 and §7 exist to strip, and here they are her voice
    // rather than a tell. REQ-004 keeps the pass off her copy; CON-005 lists this
    // field by name. An agent that "fixes" this line has broken the page.
    closingLine:
      "É um trabalho de colaboração. Juntos, vamos construir pontes entre o seu consciente e o seu inconsciente, promovendo mais equilíbrio, sentido e vitalidade para a sua vida.",
    plate: EMPTY_PAGE_PLATE,
  },
  sonhoAmpliado: {
    heading: "Sonho ampliado",
    // A fact about her method, which CONCEPT §5 fixes: amplificação is her craft,
    // "setting a symbol beside its parallels".
    // "na tradição da psicologia analítica" removed: the abertura names it, and
    // Jung is named in this same sentence anyway (GUD-001).
    intro:
      "Amplificação é o nome desse gesto. Quando uma imagem insiste, ela não é traduzida de fora: é posta ao lado das suas parentes na pintura, no mito, na obra de Jung, até que o próprio sonhador reconheça o que ela pede.",
    // Null until her curation exists: the section is gated on the motif, and a
    // dream quote beside empty parallel labels is scaffolding a visitor has to
    // look at. Prod already stores it cleared; the default now agrees.
    motif: null,
    // The three kinds of parallel, labeled. Each one's content is her curation
    // (CONCEPT §9.3: "her words required"), so every text is null and every plate
    // is empty; a parallel with nothing to read does not render.
    parallels: [
      { label: "Uma pintura", text: null, plate: EMPTY_PAGE_PLATE },
      { label: "Um mito", text: null, plate: EMPTY_PAGE_PLATE },
      { label: "Uma passagem", text: null, plate: EMPTY_PAGE_PLATE },
    ],
    closingLine: null,
  },
  pratico: {
    heading: "Na prática",
    // The fee row is composed from A Clínica and prepended by `PraticoSection`.
    items: [
      { label: "Frequência", value: "Um encontro por semana." },
      { label: "Duração", value: "Cerca de cinquenta minutos por encontro." },
      {
        label: "Como acontece",
        value: "Por chamada de vídeo. Eu envio o link antes de cada encontro.",
      },
      {
        label: "Quanto tempo dura",
        value:
          "A análise não tem prazo fixo: é um trabalho de médio a longo prazo, e quem decide seguir ou parar é você.",
      },
      { label: "Idiomas", value: "Português ou inglês." },
      { label: "De onde", value: "De qualquer lugar do Brasil ou do exterior." },
      { label: "Horários", value: "Sempre no horário de Brasília." },
    ],
    // The ask closes the practical band instead of holding a band of its own.
    //
    // The body is **hers, verbatim** (SRC-H), `si mesmo(a)` and all — CON-003
    // forbids tidying those parentheses. It carries no imperative, and does not
    // need one: `ComecarFold` renders the WhatsApp block immediately below it, so
    // the invitation is her sentence and the verb is the button.
    comecar: {
      body: "Se você sente que é o momento de iniciar essa jornada de volta para si mesmo(a), será uma alegria acompanhar o seu processo.",
      linkLabel: "o que acontece na primeira conversa",
    },
  },
  mandala: {
    heading: "A mandala dos signos",
    intro:
      "Doze figuras pintadas, vinte e sete mansões lunares, a Terra ao centro. Aqui os signos são vocabulário: imagens para nomear o que se vive, nunca uma previsão nem uma leitura sobre quem você é.",
    // REQ-007: hers alone, and empty until she writes them.
    readings: EMPTY_SIGN_READINGS,
  },
};
