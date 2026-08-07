import { describe, expect, it } from "vitest";
import en from "@/../messages/en.json";
import pt from "@/../messages/pt.json";
import { ANALISE_DEFAULTS } from "@/domain/analise/Analise";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";
import { INICIO_DEFAULTS } from "@/domain/inicio/Inicio";
import { INTERNACIONAL_DEFAULTS } from "@/domain/internacional/Internacional";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PERGUNTAS_DEFAULTS } from "@/domain/perguntas/Perguntas";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PRIVACIDADE_DEFAULTS } from "@/domain/privacidade/Privacidade";
import { SOBRE_DEFAULTS } from "@/domain/sobre/Sobre";

// ---------------------------------------------------------------------------
// The clinic is **on-line, without exception** (CONCEPT; plan CON-001). She used
// to practise from an office in Guarulhos, the old site said so on every page,
// and the copy is full of sentences that were rewritten to remove it. That makes
// the old claim the single likeliest thing to come back: a resurrected seed
// value, a paragraph restored from `docs/content-export-2026-08.md`, an agent
// "reinstating" a fact it found in a code comment.
//
// `twinDocs.test.ts` already guards the Markdown twins. This guards the source
// those twins are generated from, plus the two message catalogues, so a
// reintroduction fails here before it can reach a page, a twin, or a meta tag.
//
// Code comments are deliberately *not* scanned. Several of them record what the
// old copy said and why it changed, which is exactly the institutional memory
// that keeps somebody from putting it back by accident.
// ---------------------------------------------------------------------------

/** What may never appear in a string a visitor or an assistant can read. */
const IN_PERSON = /guarulhos|presencial|consult[óo]ri|in-person/i;

/**
 * Every string reachable from a value, at any depth.
 *
 * Deliberately structure-blind: it walks plain objects, arrays and Lexical rich
 * text alike, so a new field or a new nesting level is covered the day it is
 * added rather than the day somebody remembers to extend this list.
 */
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

const SOURCES = {
  ANALISE_DEFAULTS,
  CLINICA_DEFAULTS,
  FAQ_DEFAULTS,
  INICIO_DEFAULTS,
  INTERNACIONAL_DEFAULTS,
  ORIENTACAO_PROFISSIONAL_DEFAULTS,
  PERGUNTAS_DEFAULTS,
  PRIMEIRA_CONVERSA_DEFAULTS,
  PRIVACIDADE_DEFAULTS,
  SOBRE_DEFAULTS,
  "messages/pt.json": pt,
  "messages/en.json": en,
};

/**
 * The same sources minus every string written in English on purpose.
 *
 * Two of those are islands inside otherwise-Portuguese values and have to be
 * named here: `internacional.inEnglish` is the English band that renders *on the
 * Portuguese page* (CONCEPT §6), and `clinica.notes.english` is the WhatsApp
 * opener an anglophone taps. `PRIVACIDADE_DEFAULTS` carries both locales in one
 * constant, so only its `pt` half belongs here.
 */
const PT_SOURCES = {
  ANALISE_DEFAULTS,
  CLINICA_DEFAULTS: { ...CLINICA_DEFAULTS, notes: { ...CLINICA_DEFAULTS.notes, english: null } },
  FAQ_DEFAULTS,
  INICIO_DEFAULTS,
  INTERNACIONAL_DEFAULTS: { ...INTERNACIONAL_DEFAULTS, inEnglish: null },
  ORIENTACAO_PROFISSIONAL_DEFAULTS,
  PERGUNTAS_DEFAULTS,
  PRIMEIRA_CONVERSA_DEFAULTS,
  PRIVACIDADE_PT: PRIVACIDADE_DEFAULTS.pt,
  SOBRE_DEFAULTS,
  "messages/pt.json": pt,
};

describe("online-only (CON-001)", () => {
  for (const [name, source] of Object.entries(SOURCES)) {
    it(`${name} claims no in-person practice`, () => {
      const offending = stringsIn(source).filter((text) => IN_PERSON.test(text));
      expect(offending).toEqual([]);
    });
  }

  it("scans something, so a broken walker cannot pass silently", () => {
    // The guard above is a negative assertion, and a `stringsIn` that returned
    // nothing would satisfy every one of them.
    expect(stringsIn(SOURCES).length).toBeGreaterThan(500);
  });

  it("would catch the sentence the old site opened with", () => {
    expect(stringsIn({ tagline: "Consultório estabelecido em Guarulhos." })).toHaveLength(1);
    expect(IN_PERSON.test("Consultório estabelecido em Guarulhos.")).toBe(true);
    expect(IN_PERSON.test("Atendimento online e presencial.")).toBe(true);
  });

  it("writes on-line the same way in every Portuguese string", () => {
    // Her own spelling, in SRC-A and SRC-B of `docs/source-copy-2026-08-07.md`,
    // and the reason ledger row 7 corrected SRC-G.1. Unhyphenated "online" is not
    // wrong in Portuguese, it is just not what this site writes, and a page that
    // mixes the two reads as two authors. In English it is the correct spelling,
    // which is why this runs over `PT_SOURCES` and the guard above runs over all.
    const bare = stringsIn(PT_SOURCES).filter((text) => /\bonline\b/i.test(text));
    expect(bare).toEqual([]);
  });
});
