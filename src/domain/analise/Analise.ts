import { EMPTY_PAGE_PLATE, type PagePlate } from "@/domain/media/PagePlate";
import type { FactRow } from "@/domain/pages/FactRow";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import { ZODIAC_SIGN_IDS, type ZodiacSignId } from "@/domain/zodiac/zodiacContent";

// ---------------------------------------------------------------------------
// A Análise (`/analise`) — the seven sections of CONCEPT §6 plus the page's own
// opening, as the page and its components consume them. One member per tab in
// `page-analise`, so a field's admin path and its render path read the same.
//
// ANALISE_DEFAULTS is what renders when Payload is off or a field is blank, and
// it is also what `seed/pages.ts` writes on a fresh database.
//
// **On the copy in these defaults.** Two blocks are *hers, verbatim* and must
// never be reworded: `oQueTrazem.intro` (the five paragraphs she rewrote
// herself, rescued from the database in TASK-026) and the three
// `oQueTrazem.pillars`. Everything else is a *draft* stating only facts CONCEPT
// already fixes — §6's section list for this page ("espaço seguro de escuta,
// reflexão e transformação"; the symptom as a call from the unconscious; the
// whole person and individuação; the free, non-judgemental dialogue and the
// symbolic tools; weekly · on-line · pt/en · Brasil e exterior), §4's boundary
// sentence, §5's amplificação, and §9.3's example dream motif. Nothing drafted
// here is her voice until she says it is; TASK-052 owns the review.
//
// Two policies bind this page harder than any other:
//   · **Individuação is described, never promised** (CONCEPT §11). `aVisao` says
//     so in its own words rather than leaving it to a reviewer to notice.
//   · **The wheel's readings are hers alone** (REQ-007). All twenty-four are
//     `null` here and seeded empty; the wheel speaks through the painting and
//     its scholarly reference until she writes them.
//
// The fee is NOT here — it is composed from A Clínica (REQ-005), so one edit
// changes the price on every page that quotes it. Neither are the WhatsApp
// openers: they are cross-page facts in `clinica.notes`.
// ---------------------------------------------------------------------------

/** One symbolic tool of the method — a way of looking, not a technique. */
export type MethodTool = { title: string; text: string };

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
  aVisao: {
    heading: string;
    body: RichTextContent;
    plate: PagePlate;
  };
  oMetodo: {
    heading: string;
    body: RichTextContent;
    tools: MethodTool[];
    closingLine: string;
  };
  mandala: {
    heading: string;
    intro: string;
    readings: Record<ZodiacSignId, SignReading>;
  };
  oQueTrazem: {
    heading: string;
    intro: RichTextContent;
    note: string;
    pillars: Pillar[];
    boundary: string;
    linkLabel: string;
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
  };
  paraComecar: {
    heading: string;
    body: string;
    linkLabel: string;
  };
};

/** Twelve signs, no prose. The shape her admin edits fill in one field at a time. */
export const EMPTY_SIGN_READINGS: Record<ZodiacSignId, SignReading> = Object.fromEntries(
  ZODIAC_SIGN_IDS.map((id) => [id, { reading: null, vedicReading: null }]),
) as Record<ZodiacSignId, SignReading>;

/**
 * Her own rewrite of the pillars intro — five paragraphs, verbatim, carried here
 * from `src/payload/seed/pages.ts` where TASK-026 rescued them from the database
 * before the destructive migration. This is content, not code: never reword it,
 * never trim it, never "improve" its punctuation.
 */
const PILLARS_INTRO = richText([
  "Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
  "Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.",
  "Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.",
  "Gosto de dizer que a psicologia clínica é o trabalho mais “anti capitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros são ditados pelo paciente, de acordo com aquilo que ele está preparado para trazer.",
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
    // The h1 carries the search term the page targets ("análise junguiana") and
    // still reads as the page's own name — CONCEPT §10 puts this cluster here.
    heading: "A análise junguiana",
    // The whole AEO front-load (REQ-012): what it is, how often, in which
    // languages, from where — and the one idea the rest of the page unfolds.
    body: richText([
      "A análise é um espaço seguro de escuta, reflexão e transformação: psicoterapia de orientação junguiana, on-line, em encontros semanais, em português ou em inglês, para quem está em qualquer lugar do Brasil ou do exterior.",
      "O que costuma trazer alguém até aqui — a ansiedade que não passa, um luto que não se resolve, o sonho que volta, a sensação de estar no caminho errado — não é apenas um defeito a corrigir. O sintoma tem um propósito: é também um chamado do inconsciente, algo pedindo para ser escutado antes de poder mudar.",
    ]),
  },
  aVisao: {
    heading: "A pessoa inteira",
    body: richText([
      "A psicologia analítica não trata um sintoma isolado, e sim a pessoa inteira: a história, o corpo, os vínculos, os sonhos, o que se repete e o que nunca foi dito. O sintoma é uma parte da conversa, não o assunto todo.",
      [
        { text: "Jung deu um nome ao movimento dessa vida inteira em direção a si mesma: " },
        { text: "individuação", italic: true },
        {
          text: " — tornar-se quem você realmente é, integrando suas luzes e sombras. É um conceito que descreve a direção de um trabalho, não um resultado que se entrega no fim: ninguém conclui a própria individuação, e a análise não a promete.",
        },
      ],
    ]),
    plate: EMPTY_PAGE_PLATE,
  },
  oMetodo: {
    heading: "Como o trabalho acontece",
    body: richText([
      "Os encontros são uma conversa livre, acolhedora e sem julgamento. Você fala do que está vivo agora, no ritmo que der; eu escuto e, quando faz sentido, faço uma pontuação. Nada precisa vir organizado.",
      "Junto disso entram as ferramentas simbólicas da tradição junguiana — modos de olhar para o material que a sua psique já está produzindo, todos os dias, sem pedir licença.",
    ]),
    tools: [
      {
        title: "Os sonhos",
        text: "As imagens, os personagens, o que volta de uma noite para outra. O sonho não é decifrado por fora, com um dicionário: ele é ampliado junto com você, até que você reconheça do que ele fala.",
      },
      {
        title: "As imagens e fantasias do dia a dia",
        text: "Devaneios, um filme que não sai da cabeça, uma cena que se repete na imaginação, um símbolo que aparece em toda parte. O que prende a atenção sem explicação costuma estar dizendo algo.",
      },
      {
        title: "Os padrões que se repetem",
        text: "As mesmas situações nas relações, no trabalho, nas escolhas. Reconhecer o padrão é o começo de poder fazer diferente — e quase sempre ele guarda uma história mais antiga que a atual.",
      },
    ],
    // Quoted from CONCEPT §6, which takes it from her own words.
    closingLine: "É um trabalho de colaboração.",
  },
  mandala: {
    heading: "A mandala dos signos",
    intro:
      "Doze figuras pintadas, vinte e sete mansões lunares, a Terra ao centro. Na análise os signos são vocabulário: um repertório de imagens para nomear o que se vive — nunca uma previsão, nunca uma leitura sobre quem você é.",
    // REQ-007: hers alone, and empty until she writes them.
    readings: EMPTY_SIGN_READINGS,
  },
  oQueTrazem: {
    // Heading and note are drafts from TASK-026's seed; the intro and the three
    // pillars below them are hers, verbatim.
    heading: "O que se repete costuma ter algo a dizer.",
    intro: PILLARS_INTRO,
    note: "Três frentes que costumam trazer alguém para a análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
    pillars: PILLARS,
    // CONCEPT §4's boundary sentence, in prose: sentido do trabalho → análise ·
    // qual profissão → orientação. The two doors overlap at pillar III by design.
    boundary:
      "A terceira frente encosta na outra porta da clínica. Quando a pergunta é o sentido do trabalho na sua vida, ela é matéria de análise; quando a pergunta é qual profissão seguir, existe um caminho mais direto — a orientação profissional e de carreira, um programa com começo, meio e fim.",
    linkLabel: "conhecer a orientação profissional e de carreira",
  },
  sonhoAmpliado: {
    heading: "Sonho ampliado",
    // A fact about her method, which CONCEPT §5 fixes: amplificação is her craft,
    // "setting a symbol beside its parallels".
    intro:
      "Amplificação é o nome desse gesto na tradição junguiana. Quando uma imagem insiste, ela não é traduzida de fora: é posta ao lado das suas parentes — na pintura, no mito, na obra de Jung — até que o próprio sonhador reconheça o que ela pede.",
    // The dream is quoted speech — CONCEPT §9.3's own example of a motif someone
    // brings to a session, not prose in her name. Clearing it hides the section.
    motif: "Sonhei que encontrava um cômodo desconhecido na minha casa.",
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
          "A análise não tem prazo fixo. É um trabalho de médio a longo prazo, e quem decide seguir ou parar é você.",
      },
      { label: "Idiomas", value: "Português ou inglês." },
      { label: "De onde", value: "De qualquer lugar do Brasil ou do exterior." },
      {
        label: "Horários",
        value: "Sempre no horário de Brasília. Se você mora fora, eu faço a conta com você.",
      },
    ],
  },
  paraComecar: {
    heading: "Para começar",
    body: "Se algo aqui parece com o que você está vivendo, me escreva. A primeira conversa serve para nos conhecermos — e é depois dela que você decide se quer seguir.",
    linkLabel: "o que acontece na primeira conversa",
  },
};
