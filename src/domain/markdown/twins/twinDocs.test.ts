import { describe, expect, it } from "vitest";
import { ANALISE_DEFAULTS } from "@/domain/analise/Analise";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";
import { groupFaqByCategory } from "@/domain/faq/groupFaqByCategory";
import { INICIO_DEFAULTS } from "@/domain/inicio/Inicio";
import { INTERNACIONAL_DEFAULTS } from "@/domain/internacional/Internacional";
import type { MarkdownBlock } from "@/domain/markdown/MarkdownBlock";
import { renderMarkdown } from "@/domain/markdown/renderMarkdown";
import type { TwinContext, TwinLabels } from "@/domain/markdown/TwinContext";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PERGUNTAS_DEFAULTS } from "@/domain/perguntas/Perguntas";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PRIVACIDADE_DEFAULTS } from "@/domain/privacidade/Privacidade";
import { type Locale, otherLocale, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { PAGE_KEYS, type PageKey } from "@/domain/site/pages";
import { SOBRE_DEFAULTS } from "@/domain/sobre/Sobre";
import type { Testimonial } from "@/domain/testimonials/Testimonial";
import { analiseDoc } from "./analiseDoc";
import { inicioDoc } from "./inicioDoc";
import { internacionalDoc } from "./internacionalDoc";
import { orientacaoProfissionalDoc } from "./orientacaoProfissionalDoc";
import { perguntasDoc } from "./perguntasDoc";
import { primeiraConversaDoc } from "./primeiraConversaDoc";
import { privacidadeDoc } from "./privacidadeDoc";
import { sobreDoc } from "./sobreDoc";

// ---------------------------------------------------------------------------
// The eight twins, built from the code defaults — which are the same objects the
// seed writes, so this is the real copy rather than a fixture of it.
//
// One file for all eight because what is worth testing is what they have in
// common: the frame, the omissions, the two locale-dependent rules, and the four
// hard rules of the task (CON-001, GUD-002, SEC-002, CON-002). A per-builder test
// would mostly assert that a section list is the section list.
// ---------------------------------------------------------------------------

const BASE = "https://simbolosdoself.test";

const LABELS: TwinLabels = {
  page: "Página",
  alternate: "In English",
  index: "Índice de todas as páginas",
  credentials: "Credenciais",
  availability: "Agenda",
  email: "E-mail",
  fee: "Valor",
  feeAnalysis: "Valor · análise",
  feeCareerGuidance: "Valor · orientação profissional",
  feeToDiscuss: "A combinar antes da primeira sessão.",
  // The `horas.places.*` names, as `twinMarkdown` resolves them.
  reach: {
    eua: { label: "Estados Unidos", value: "Nova York" },
    canada: { label: "Canadá", value: "Toronto" },
    brasil: { label: "Brasil", value: "Brasília" },
    portugal: { label: "Portugal", value: "Lisboa" },
    inglaterra: { label: "Inglaterra", value: "Londres" },
    holanda: { label: "Holanda", value: "Amsterdã" },
  },
};

const AVAILABILITY = "Com horários disponíveis.";

function contextFor(key: PageKey, locale: Locale): TwinContext {
  const byKey = (value: (page: PageKey) => string) =>
    Object.fromEntries(PAGE_KEYS.map((page) => [page, value(page)])) as Record<PageKey, string>;

  return {
    key,
    locale,
    clinica: CLINICA_DEFAULTS,
    pageUrls: byKey((page) => `${BASE}${pagePath(page, locale)}`),
    pageLabels: byKey((page) => page),
    alternateUrl: `${BASE}${pagePath(key, otherLocale(locale))}`,
    indexUrl: `${BASE}/llms.txt`,
    englishHomeUrl: `${BASE}${pagePath("inicio", "en")}`,
    availabilityLine: AVAILABILITY,
    labels: LABELS,
  };
}

function docFor(key: PageKey, locale: Locale, testimonials: Testimonial[] = []): MarkdownBlock[] {
  const ctx = contextFor(key, locale);

  switch (key) {
    case "inicio":
      return inicioDoc(INICIO_DEFAULTS, testimonials, SOBRE_DEFAULTS.formacao.items, ctx);
    case "analise":
      return analiseDoc(ANALISE_DEFAULTS, ctx);
    case "orientacaoProfissional":
      return orientacaoProfissionalDoc(ORIENTACAO_PROFISSIONAL_DEFAULTS, ctx);
    case "sobre":
      return sobreDoc(SOBRE_DEFAULTS, ctx);
    case "primeiraConversa":
      return primeiraConversaDoc(PRIMEIRA_CONVERSA_DEFAULTS, ctx);
    case "perguntas":
      return perguntasDoc(PERGUNTAS_DEFAULTS, groupFaqByCategory(FAQ_DEFAULTS), ctx);
    case "internacional":
      return internacionalDoc(INTERNACIONAL_DEFAULTS, ctx);
    case "privacidade":
      return privacidadeDoc(PRIVACIDADE_DEFAULTS[locale], ctx);
  }
}

const textOf = (key: PageKey, locale: Locale, testimonials?: Testimonial[]) =>
  renderMarkdown(docFor(key, locale, testimonials));

const everyTwin = PAGE_KEYS.flatMap((key) => SITE_LOCALES.map((locale) => ({ key, locale })));

describe("every twin", () => {
  it.each(everyTwin)("$key/$locale opens on exactly one h1", ({ key, locale }) => {
    const document = docFor(key, locale);
    const headings = document.filter((block) => block.kind === "heading");

    expect(headings.filter((block) => block.level === 1)).toHaveLength(1);
    expect(document[0]).toMatchObject({ kind: "heading", level: 1 });
  });

  it.each(everyTwin)("$key/$locale front-loads the practice's facts", ({ key, locale }) => {
    const text = textOf(key, locale);

    // Where am I, who receives me, and how do I reach her — before any section.
    expect(text).toContain(CLINICA_DEFAULTS.clinicName);
    expect(text).toContain(CLINICA_DEFAULTS.fullName);
    expect(text).toContain(CLINICA_DEFAULTS.positioning);
    expect(text).toContain(`**${LABELS.page}** — ${BASE}${pagePath(key, locale)}`);
    expect(text).toContain(
      `**${LABELS.alternate}** — ${BASE}${pagePath(key, otherLocale(locale))}`,
    );
    expect(text).toContain(`**${LABELS.credentials}** — PUC-SP · clínica desde 2014`);
    expect(text).toContain(`**${LABELS.availability}** — ${AVAILABILITY}`);
    expect(text).toContain(CLINICA_DEFAULTS.whatsappUrl);
    expect(text).toContain(CLINICA_DEFAULTS.email);
  });

  it.each(everyTwin)("$key/$locale ends on the way back to the index", ({ key, locale }) => {
    expect(textOf(key, locale).trimEnd()).toMatch(
      /\n- \*\*Índice de todas as páginas\*\* — https:\/\/[^\s]+\/llms\.txt$/,
    );
  });

  /** CON-001: the twins are metadata as much as content. */
  it.each(everyTwin)("$key/$locale claims no room a patient walks into", ({ key, locale }) => {
    expect(textOf(key, locale)).not.toMatch(/guarulhos|presencial|consult[óo]ri|in-person/i);
  });

  /** REQ-005 is a rule about layout honesty; a text file has no frames to be honest about. */
  it.each(everyTwin)("$key/$locale mentions no asset that is still missing", ({ key, locale }) => {
    expect(textOf(key, locale)).not.toMatch(/em prepara|in preparation/i);
  });

  it.each(everyTwin)("$key/$locale nests no deeper than h3", ({ key, locale }) => {
    for (const block of docFor(key, locale)) {
      if (block.kind === "heading") expect(block.level).toBeLessThanOrEqual(3);
    }
  });
});

describe("the fee", () => {
  it("is quoted where the page quotes it, scoped to that page's own service", () => {
    expect(textOf("analise", "pt")).toContain(`**${LABELS.fee}** — ${LABELS.feeToDiscuss}`);
    expect(textOf("orientacaoProfissional", "pt")).toContain(
      `**${LABELS.fee}** — ${LABELS.feeToDiscuss}`,
    );
    expect(textOf("primeiraConversa", "pt")).toContain(
      `**${LABELS.fee}** — ${LABELS.feeToDiscuss}`,
    );
  });

  it("is not quoted on /internacional, where money is stated in dólar or euro", () => {
    const text = textOf("internacional", "pt");

    expect(text).not.toContain(`**${LABELS.fee}** —`);
    // Nor the shared BRL note that accompanies every quoted price.
    expect(text).not.toContain(CLINICA_DEFAULTS.fees.internationalNote);
    // The page's own money row is there instead.
    expect(text).toContain("**Valores** — Para quem mora fora do Brasil");
  });

  it("carries both notes wherever a BRL price appears", () => {
    for (const key of ["analise", "orientacaoProfissional", "primeiraConversa"] as const) {
      expect(textOf(key, "pt")).toContain(CLINICA_DEFAULTS.fees.note as string);
      expect(textOf(key, "pt")).toContain(CLINICA_DEFAULTS.fees.internationalNote as string);
    }
  });

  // The row alone says only "a combinar"; her note is what turns that into an
  // instruction. A twin that quoted the row without the note would be back to the
  // circular version the pages just left behind.
  it("never quotes the price without saying where it gets agreed", () => {
    for (const key of ["analise", "orientacaoProfissional", "primeiraConversa"] as const) {
      expect(textOf(key, "pt")).toMatch(/WhatsApp/);
      expect(textOf(key, "pt")).not.toContain("A combinar na primeira conversa");
    }
  });
});

describe("the reach", () => {
  // The site's countries used to live inside four prose sentences, which is why
  // adding two meant rewriting all four. They are one list now, and these are the
  // two documents that state it.
  it("lists every country on the two pages that carry the strip", () => {
    for (const key of ["inicio", "internacional"] as const) {
      const text = textOf(key, "pt");

      for (const place of Object.values(LABELS.reach)) {
        expect(text).toContain(`**${place.label}** — ${place.value}`);
      }
    }
  });

  it("states no hour and no offset, because a twin is cached and they are not", () => {
    for (const key of ["inicio", "internacional"] as const) {
      const text = textOf(key, "pt");

      expect(text).not.toMatch(/\d{1,2}h\d{2}/);
      expect(text).not.toMatch(/horas? (à frente|atrás) de Bras[íi]lia/i);
    }
  });

  // The one enumeration left in prose: a direct question, answered directly.
  it("keeps /primeira-conversa's own answer naming all five countries", () => {
    const text = textOf("primeiraConversa", "pt");

    for (const country of ["Portugal", "Inglaterra", "Holanda", "Estados Unidos", "Canadá"]) {
      expect(text).toContain(country);
    }
  });
});

describe("the locale-dependent rules", () => {
  it("keeps the In-English block on the Portuguese twin and drops it on the English one", () => {
    expect(textOf("internacional", "pt")).toContain(INTERNACIONAL_DEFAULTS.inEnglish.heading);
    expect(textOf("internacional", "pt")).toContain(INTERNACIONAL_DEFAULTS.inEnglish.body);
    expect(textOf("internacional", "en")).not.toContain(INTERNACIONAL_DEFAULTS.inEnglish.body);
  });

  it("offers the English bilhete opener on the Portuguese twin only", () => {
    const english = CLINICA_DEFAULTS.notes.english as string;

    expect(textOf("primeiraConversa", "pt")).toContain(english);
    expect(textOf("primeiraConversa", "en")).not.toContain(english);
  });

  it("never offers the international opener on the bilhete, in either locale", () => {
    const international = CLINICA_DEFAULTS.notes.international as string;

    for (const locale of SITE_LOCALES) {
      expect(textOf("primeiraConversa", locale)).not.toContain(international);
    }
  });

  it("renders the English privacy page in English, not in Portuguese", () => {
    expect(textOf("privacidade", "en")).toContain("What the site never does");
    expect(textOf("privacidade", "en")).not.toContain("O que o site nunca faz");
  });
});

describe("/perguntas' twin", () => {
  it("renders every question as its own discrete block, under its category", () => {
    const document = docFor("perguntas", "pt");
    const questions = document.filter((block) => block.kind === "heading" && block.level === 3);
    const categories = document.filter((block) => block.kind === "heading" && block.level === 2);

    expect(questions).toHaveLength(FAQ_DEFAULTS.length);
    // The four sections of CONCEPT §6, plus the closing hand-off.
    expect(categories).toHaveLength(5);

    const text = renderMarkdown(document);
    for (const entry of FAQ_DEFAULTS) {
      expect(text).toContain(`### ${entry.question}`);
      expect(text).toContain(entry.answer);
    }
  });
});

describe("/analise's twin", () => {
  it("keeps the wheel's heading and its policy sentence, and nothing else", () => {
    const document = docFor("analise", "pt");
    const start = document.findIndex(
      (block) => block.kind === "heading" && block.text === ANALISE_DEFAULTS.mandala.heading,
    );
    const rest = document.slice(start + 1);
    const end = rest.findIndex((block) => block.kind === "heading");

    // Exactly one block under the heading: the intro that states the site's rule
    // about symbols — vocabulary, "nunca uma leitura sobre quem você é".
    expect(rest.slice(0, end)).toEqual([
      { kind: "paragraph", text: ANALISE_DEFAULTS.mandala.intro },
    ]);
  });

  it("still omits a per-sign reading after she writes one", () => {
    const withReading = {
      ...ANALISE_DEFAULTS,
      mandala: {
        ...ANALISE_DEFAULTS.mandala,
        readings: {
          ...ANALISE_DEFAULTS.mandala.readings,
          aries: { reading: "O impulso que abre o ano.", vedicReading: "Ashwini, o cavaleiro." },
        },
      },
    };
    const text = renderMarkdown(analiseDoc(withReading, contextFor("analise", "pt")));

    expect(text).not.toContain("O impulso que abre o ano.");
    expect(text).not.toContain("Ashwini, o cavaleiro.");
  });

  it("keeps Sonho ampliado absent while her motif is unwritten — the default state", () => {
    // The intro alone must not keep the section alive here when the page hides it.
    expect(textOf("analise", "pt")).not.toContain(ANALISE_DEFAULTS.sonhoAmpliado.heading);
  });

  it("quotes the motif once she writes it, and omits the parallels she has not", () => {
    const withMotif = {
      ...ANALISE_DEFAULTS,
      sonhoAmpliado: {
        ...ANALISE_DEFAULTS.sonhoAmpliado,
        motif: "Sonhei que encontrava um cômodo desconhecido na minha casa.",
      },
    };
    const text = renderMarkdown(analiseDoc(withMotif, contextFor("analise", "pt")));

    expect(text).toContain("> Sonhei que encontrava um cômodo desconhecido na minha casa.");
    for (const parallel of ANALISE_DEFAULTS.sonhoAmpliado.parallels) {
      expect(text).not.toContain(`**${parallel.label}**`);
    }
  });
});

describe("/ (Início)'s twin", () => {
  it("has no Vozes section while there are no consented voices (SEC-002)", () => {
    expect(textOf("inicio", "pt")).not.toContain(INICIO_DEFAULTS.vozes.heading);
  });

  it("quotes a voice with an initial and its context once one exists", () => {
    const voice: Testimonial = {
      body: "Foi a primeira vez que alguém escutou o sonho inteiro.",
      attribution: "M.",
      context: "orientação de carreira",
      service: "orientacao",
      abroad: false,
    };
    const text = textOf("inicio", "pt", [voice]);

    expect(text).toContain(INICIO_DEFAULTS.vozes.heading);
    expect(text).toContain(`> ${voice.body}`);
    expect(text).toContain("— M., orientação de carreira");
  });

  // She asked for the record to stand on the first page rather than behind a
  // link; the twin follows the page, and it is rendered from /sobre's own field
  // rather than from a second copy.
  it("states the whole academic record, as /sobre's twin does", () => {
    const home = textOf("inicio", "pt");

    for (const item of SOBRE_DEFAULTS.formacao.items) {
      expect(home).toContain(`- ${item.title} — ${item.institution}`);
    }
    // Her one editorial line about the record stays on /sobre alone.
    expect(home).not.toContain(SOBRE_DEFAULTS.formacao.intro as string);
  });

  it("describes neither the cosmic overture nor the Instagram squares", () => {
    const text = textOf("inicio", "pt");

    // The section that names her world stays; the images and their captions do not.
    expect(text).toContain(INICIO_DEFAULTS.instagram.heading);
    expect(text).toContain(CLINICA_DEFAULTS.instagramUrl);
    expect(text).not.toMatch(/cosmos|abertura cósmica|lâmina/i);
  });

  it("hands off to each page it links, at that page's own address", () => {
    const text = textOf("inicio", "pt");

    for (const [label, path] of [
      [INICIO_DEFAULTS.doisCaminhos.analysis.linkLabel, "/analise"],
      [INICIO_DEFAULTS.doisCaminhos.careerGuidance.linkLabel, "/orientacao-profissional"],
      [INICIO_DEFAULTS.sobreDigest.linkLabel, "/sobre"],
      [INICIO_DEFAULTS.brasilExterior.linkLabel, "/internacional"],
      [INICIO_DEFAULTS.comoComecar.linkLabel, "/primeira-conversa"],
    ] as const) {
      expect(text).toContain(`[${label}](${BASE}${path})`);
    }
  });
});

describe("/sobre's twin", () => {
  it("states the academic record at the precision she has confirmed, with no invented year", () => {
    const text = textOf("sobre", "pt");

    expect(text).toContain("- Graduação em Psicologia — PUC-SP"); // Her own course names, from her 2026-08-07 text. This row and the Instituto
    // Numen one used to be truncated because no source document named them.
    expect(text).toContain("- Pós-graduação em Psicologia Clínica — Instituto Numen");
    expect(text).toContain("- Extensão em Psicologia, Religião e Fenômenos Anômalos — USP");
    // `period` is unset on every row, so no row prints a parenthesis.
    expect(text).not.toMatch(/— (PUC-SP|USP|Instituto Numen) \(/);
  });

  it("describes what she says, never the images the page hangs beside it", () => {
    const text = textOf("sobre", "pt");

    expect(text).toContain(SOBRE_DEFAULTS.aClinica.linkLabel);
    expect(text).not.toMatch(/retrato|assinatura|signature/i);
  });
});
