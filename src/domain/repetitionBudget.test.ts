import { describe, expect, it } from "vitest";
import pt from "@/../messages/pt.json";
import { ANALISE_DEFAULTS } from "@/domain/analise/Analise";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";
import { INICIO_DEFAULTS } from "@/domain/inicio/Inicio";
import { INTERNACIONAL_DEFAULTS } from "@/domain/internacional/Internacional";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PERGUNTAS_DEFAULTS } from "@/domain/perguntas/Perguntas";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PRIVACIDADE_DEFAULTS } from "@/domain/privacidade/Privacidade";
import { SOBRE_DEFAULTS } from "@/domain/sobre/Sobre";

// ---------------------------------------------------------------------------
// The repetition budget (plan GUD-001), mechanised.
//
// Seven phrases carry this site's whole positioning, which is exactly why they
// creep: every page wants to say it is online, bilingual, Jungian and available
// from anywhere, and each page says it truthfully. Read one page and it reads as
// emphasis. Read three and it reads as a template.
//
// The rule is at most three occurrences of each phrase per page, counted across
// what a visitor actually reads on that page: its own defaults plus the shared
// facts it composes (the credential strip, the who-line, the fee row, the
// colophon). A fourth occurrence is a defect to fix by **deleting the weakest
// occurrence**, never by finding a synonym: synonym cycling is its own tell, and
// the vocabulary here is deliberately fixed.
//
// Two pages sit above the budget and cannot come down. See ALLOWANCES.
// ---------------------------------------------------------------------------

const BUDGET = 3;

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

/** The shared facts every page composes, whoever the page is. */
const EVERY_PAGE = [pt.chrome.whoLine, pt.chrome.colophon.binding];

/** CONCEPT §6's credential strip, on the three pages that render it. */
const CREDENTIAL_STRIP = [CLINICA_DEFAULTS.credential, ...CLINICA_DEFAULTS.credentials];

/** The abroad note `PraticoSection` prints under a BRL fee row. */
const FEE_ROW = [CLINICA_DEFAULTS.fees.internationalNote];

type PageComposition = {
  own: unknown;
  /** Renders `Credencial`, and so the CONCEPT §6 strip. */
  credentialStrip?: true;
  /** Quotes BRL fees, and so prints the abroad note. */
  feeRow?: true;
  /** Prints her positioning sentence as body copy (the hero). */
  positioning?: true;
};

const PAGES: Record<string, PageComposition> = {
  "/": { own: INICIO_DEFAULTS, credentialStrip: true, positioning: true },
  "/analise": { own: ANALISE_DEFAULTS, feeRow: true },
  "/orientacao-profissional": { own: ORIENTACAO_PROFISSIONAL_DEFAULTS, feeRow: true },
  "/sobre": { own: SOBRE_DEFAULTS, credentialStrip: true },
  "/primeira-conversa": { own: PRIMEIRA_CONVERSA_DEFAULTS, feeRow: true },
  "/perguntas": { own: PERGUNTAS_DEFAULTS },
  "/internacional": { own: INTERNACIONAL_DEFAULTS, credentialStrip: true },
  "/privacidade": { own: PRIVACIDADE_DEFAULTS.pt },
};

const TERMS: Record<string, RegExp> = {
  "on-line": /on-line/gi,
  "Brasil e exterior":
    /(brasil e (o )?exterior|brasil (ou|e) (do )?exterior|todo o brasil|brasil ou do exterior)/gi,
  "português … inglês": /portugu[êe]s\s*(ou|e)\s*(em\s*)?ingl[êe]s/gi,
  individuação: /individua[çc][ãa]o/gi,
  "encontros semanais": /encontros? semanais?/gi,
  "a profissão que faz mais sentido": /profiss[ãa]o que faz mais sentido/gi,
  "psicologia analítica / junguiana": /(psicologia anal[íi]tica|jungui?an[ao]s?)/gi,
};

/**
 * Pages that exceed the budget and may not be brought down, with the reason.
 *
 * Every occurrence behind these two numbers is either **hers verbatim** (REQ-002
 * forbids editing it), **fixed by CONCEPT** (CON-007 forbids dropping the fact),
 * or **CON-005 protected**. Reaching three would mean overruling one of those, so
 * the budget loses instead.
 *
 * The test asserts each allowance is still *needed*, so the day one of these is
 * legitimately reduced, the stale entry fails and has to be deleted. An allowance
 * list nobody prunes is how a budget dies.
 */
const ALLOWANCES: Array<{ page: string; term: string; count: number; because: string }> = [
  {
    page: "/sobre",
    term: "psicologia analítica / junguiana",
    count: 5,
    because:
      "Three are hers verbatim (quemE.heading, quemE.body ¶3, and the Aprimoramento em Psicologia Clínica Junguiana row of her own academic record) and one is the CON-005 colophon. The fifth is abertura.lead, kept because /sobre is the address the entity graph gives the Person node and the lead is where an assistant reads the tradition.",
  },
  {
    page: "/internacional",
    term: "on-line",
    count: 4,
    because:
      "The h1 is CONCEPT §10's expat search term, the first paragraph is hers verbatim (SRC-G.1), the colophon is CON-005 and the credential strip is CONCEPT §6. There is no fourth occurrence left to delete.",
  },
];

function textOf(page: string): string {
  const composition = PAGES[page];
  return [
    ...stringsIn(composition.own),
    ...EVERY_PAGE,
    ...(composition.credentialStrip ? CREDENTIAL_STRIP : []),
    ...(composition.feeRow ? FEE_ROW : []),
    ...(composition.positioning ? [CLINICA_DEFAULTS.positioning] : []),
  ]
    .flatMap(stringsIn)
    .join("\n");
}

function countOf(page: string, term: string): number {
  // A fresh regex per call: /g regexes carry lastIndex between uses.
  const pattern = new RegExp(TERMS[term].source, "gi");
  return textOf(page).match(pattern)?.length ?? 0;
}

function allowanceFor(page: string, term: string): number {
  return ALLOWANCES.find((row) => row.page === page && row.term === term)?.count ?? BUDGET;
}

describe("repetition budget (GUD-001)", () => {
  for (const page of Object.keys(PAGES)) {
    for (const term of Object.keys(TERMS)) {
      it(`${page} says "${term}" at most ${allowanceFor(page, term)}×`, () => {
        expect(countOf(page, term)).toBeLessThanOrEqual(allowanceFor(page, term));
      });
    }
  }

  it("counts something on every page, so a broken walker cannot pass", () => {
    for (const page of Object.keys(PAGES)) {
      expect(textOf(page).length).toBeGreaterThan(200);
    }
  });

  for (const { page, term, count, because } of ALLOWANCES) {
    it(`still needs its allowance for ${term} on ${page}`, () => {
      // If either of these fails the page has changed, and the allowance is now
      // either stale or too small. Delete it or re-argue it; never just raise it.
      expect(countOf(page, term), `allowance is no longer needed: ${because}`).toBeGreaterThan(
        BUDGET,
      );
      expect(countOf(page, term), `allowance is out of date: ${because}`).toBe(count);
    });
  }
});
