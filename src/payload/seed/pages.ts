import type { Payload } from "payload";
import { ANALISE_DEFAULTS } from "@/domain/analise/Analise";
import { INICIO_DEFAULTS } from "@/domain/inicio/Inicio";
import { INTERNACIONAL_DEFAULTS } from "@/domain/internacional/Internacional";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PERGUNTAS_DEFAULTS } from "@/domain/perguntas/Perguntas";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "@/domain/primeiraConversa/PrimeiraConversa";
import { type Privacidade, PRIVACIDADE_DEFAULTS } from "@/domain/privacidade/Privacidade";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import { SOBRE_DEFAULTS } from "@/domain/sobre/Sobre";
import type { PageInicio } from "@/payload-types";

/**
 * Seed the page globals with the copy that already exists (TASK-026).
 *
 * Every page seeds from its own `<PAGE>_DEFAULTS` — the same values the page falls
 * back to when Payload is off or a field is blank — so a seeded row and the code
 * fallback start from one source of truth. Her supplied text lives in those
 * defaults verbatim; everything CONCEPT v3 asked for and she has not written yet
 * is a draft, marked as such in each defaults file and enumerated in that page's
 * plan under "copy needing her sign-off" (TASK-052).
 *
 * What is deliberately NOT seeded, and why:
 *
 *   · **Media.** No portrait, no signature, no plate. Provenance is never
 *     invented (CONCEPT §11), the portrait shoot has not happened, and an empty
 *     slot renders a labeled frame that says what belongs there (REQ-005).
 *   · **The wheel's twelve readings** on `/analise`. REQ-007 ships the wheel
 *     visual-only: a reading renders in her words or not at all.
 *   · **The Sonho ampliado parallels' content.** Only their three labels are
 *     written, so the rows exist for her to fill; a parallel with nothing but a
 *     label does not render.
 *   · **The four `/perguntas` section intros.** An intro she has not written means
 *     the section starts on its first question, which reads better than a
 *     placeholder sentence.
 *
 * Portuguese only, with two exceptions. English falls back to Portuguese through
 * Payload's `fallback: true` until her polish pass (RISK-001) — except on
 * `/internacional` and `/privacidade`, which are seeded in both locales.
 * `/internacional` because its CONCEPT §6 job includes serving anglophones and its
 * In-English section is dropped on `/en` as redundant, which would otherwise leave
 * `/en/international` the one English page with no English on it; `/privacidade`
 * because an anglophone reading a privacy statement they cannot read is a defect
 * rather than a rough edge.
 */

// Every richText field across the page globals shares the same Lexical editor
// shape; one cast bridges our structural RichTextContent to it.
type Lexical = NonNullable<NonNullable<PageInicio["hero"]>["lead"]>;
const rt = (content: RichTextContent): Lexical => content as unknown as Lexical;

/**
 * Row ids read back from a written localized array, so a second locale pass
 * updates the rows in place instead of replacing them.
 *
 * Only the text fields inside a row are localized — the rows themselves are
 * shared — so a row sent without an id reads as a new one and would replace the
 * Portuguese pass's rows, leaving pt (the fallback locale, which has nothing to
 * fall back to) empty. This is the exact trap `seed/clinica.ts` hit on
 * `identity.credentials`.
 */
function rowIds(rows: unknown): Array<string | null | undefined> {
  return Array.isArray(rows) ? rows.map((row) => (row as { id?: string | null }).id) : [];
}

/** Attach a row id when the first pass produced one, so the update lands in place. */
function withId<T extends object>(row: T, id: string | null | undefined): T {
  return id ? ({ id, ...row } as T) : row;
}

export async function seedPages(payload: Payload): Promise<void> {
  const shared = { locale: "pt", overrideAccess: true, context: { skipRevalidate: true } } as const;

  // ── Início ────────────────────────────────────────────────────────────────
  const inicio = INICIO_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-inicio",
    data: {
      hero: {
        lead: rt(inicio.hero.lead),
        ctaPrimaryLabel: inicio.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: inicio.hero.ctaSecondaryLabel,
      },
      instagram: { heading: inicio.instagram.heading, intro: inicio.instagram.intro },
      doisCaminhos: {
        heading: inicio.doisCaminhos.heading,
        analysis: inicio.doisCaminhos.analysis,
        careerGuidance: inicio.doisCaminhos.careerGuidance,
        boundary: inicio.doisCaminhos.boundary,
      },
      oSintoma: {
        heading: inicio.oSintoma.heading,
        body: rt(inicio.oSintoma.body),
        linkLabel: inicio.oSintoma.linkLabel,
      },
      sobreDigest: {
        heading: inicio.sobreDigest.heading,
        body: rt(inicio.sobreDigest.body),
        linkLabel: inicio.sobreDigest.linkLabel,
      },
      brasilExterior: {
        heading: inicio.brasilExterior.heading,
        body: inicio.brasilExterior.body,
        linkLabel: inicio.brasilExterior.linkLabel,
      },
      comoComecar: {
        heading: inicio.comoComecar.heading,
        beats: inicio.comoComecar.beats,
        linkLabel: inicio.comoComecar.linkLabel,
      },
      vozes: { heading: inicio.vozes.heading },
      contato: {
        eyebrow: inicio.contato.eyebrow,
        heading: inicio.contato.heading,
        body: rt(inicio.contato.body),
        whatsappLabel: inicio.contato.whatsappLabel,
      },
    },
  });

  // ── A Análise ─────────────────────────────────────────────────────────────
  // Her five-paragraph method text and the three pillars are hers, verbatim;
  // the rest is drafted from CONCEPT §6 (as condensed in 2026-08).
  const analise = ANALISE_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-analise",
    data: {
      abertura: { heading: analise.abertura.heading, body: rt(analise.abertura.body) },
      oQueTrazem: {
        heading: analise.oQueTrazem.heading,
        note: analise.oQueTrazem.note,
        pillars: analise.oQueTrazem.pillars,
        boundary: analise.oQueTrazem.boundary,
        linkLabel: analise.oQueTrazem.linkLabel,
      },
      oMetodo: {
        heading: analise.oMetodo.heading,
        body: rt(analise.oMetodo.body),
        toolsLine: analise.oMetodo.toolsLine,
        individuacao: rt(analise.oMetodo.individuacao),
        closingLine: analise.oMetodo.closingLine,
      },
      sonhoAmpliado: {
        heading: analise.sonhoAmpliado.heading,
        intro: analise.sonhoAmpliado.intro,
        // Null: the section waits for her words (its motif is its own switch).
        motif: analise.sonhoAmpliado.motif,
        // Labels only: the three kinds of parallel exist as rows for her to fill.
        parallels: analise.sonhoAmpliado.parallels.map(({ label }) => ({ label })),
      },
      pratico: {
        heading: analise.pratico.heading,
        items: analise.pratico.items,
        comecar: analise.pratico.comecar,
      },
      mandala: { heading: analise.mandala.heading, intro: analise.mandala.intro },
    },
  });

  // ── Orientação profissional e de carreira ─────────────────────────────────
  const orientacao = ORIENTACAO_PROFISSIONAL_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-orientacao-profissional",
    data: {
      abertura: { heading: orientacao.abertura.heading, body: rt(orientacao.abertura.body) },
      paraQuem: {
        heading: orientacao.paraQuem.heading,
        cases: orientacao.paraQuem.cases.map((text) => ({ text })),
      },
      oPercurso: {
        heading: orientacao.oPercurso.heading,
        body: rt(orientacao.oPercurso.body),
        steps: orientacao.oPercurso.steps,
        deliverable: orientacao.oPercurso.deliverable,
      },
      nemCoaching: {
        heading: orientacao.nemCoaching.heading,
        body: rt(orientacao.nemCoaching.body),
        distinctions: orientacao.nemCoaching.distinctions,
        anchor: orientacao.nemCoaching.anchor,
        bridge: orientacao.nemCoaching.bridge,
      },
      pratico: {
        heading: orientacao.pratico.heading,
        items: orientacao.pratico.items,
        comecar: orientacao.pratico.comecar,
      },
    },
  });

  // ── Sobre ─────────────────────────────────────────────────────────────────
  // Her bio moved here from the old home digest; the page that owns it now owns
  // its only copy in the repository.
  const sobre = SOBRE_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-sobre",
    data: {
      abertura: { heading: sobre.abertura.heading, lead: rt(sobre.abertura.lead) },
      quemE: { heading: sobre.quemE.heading, body: rt(sobre.quemE.body) },
      // `period` is null on every row: no source document states a year, and a
      // guessed one on the page whose job is verification is unrecoverable.
      formacao: { heading: sobre.formacao.heading, items: sobre.formacao.items },
      aClinica: {
        heading: sobre.aClinica.heading,
        body: rt(sobre.aClinica.body),
        linkLabel: sobre.aClinica.linkLabel,
      },
      assinatura: { closingLine: sobre.assinatura.closingLine },
    },
  });

  // ── A primeira conversa ───────────────────────────────────────────────────
  const primeiraConversa = PRIMEIRA_CONVERSA_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-primeira-conversa",
    data: {
      abertura: {
        heading: primeiraConversa.abertura.heading,
        lead: rt(primeiraConversa.abertura.lead),
      },
      passoAPasso: {
        heading: primeiraConversa.passoAPasso.heading,
        steps: primeiraConversa.passoAPasso.steps,
        permissoes: {
          items: primeiraConversa.passoAPasso.permissoes.items.map((text) => ({ text })),
        },
      },
      logistica: {
        heading: primeiraConversa.logistica.heading,
        items: primeiraConversa.logistica.items,
        doubts: primeiraConversa.logistica.doubts,
        linkLabel: primeiraConversa.logistica.linkLabel,
      },
      bilhete: {
        heading: primeiraConversa.bilhete.heading,
        intro: rt(primeiraConversa.bilhete.intro),
        chooseLabel: primeiraConversa.bilhete.chooseLabel,
      },
    },
  });

  // ── Perguntas ─────────────────────────────────────────────────────────────
  // The frame around the questions; the questions themselves are rows in the
  // `faq` collection, written by `seedFaq` from FAQ_DEFAULTS.
  const perguntas = PERGUNTAS_DEFAULTS;
  await payload.updateGlobal({
    ...shared,
    slug: "page-perguntas",
    data: {
      abertura: { heading: perguntas.abertura.heading, intro: perguntas.abertura.intro },
      sections: {
        analise: { heading: perguntas.sections.analise.heading },
        orientacao: { heading: perguntas.sections.orientacao.heading },
        pratico: { heading: perguntas.sections.pratico.heading },
        internacional: { heading: perguntas.sections.internacional.heading },
      },
      fecho: {
        heading: perguntas.fecho.heading,
        body: perguntas.fecho.body,
        whatsappLabel: perguntas.fecho.whatsappLabel,
        linkLabel: perguntas.fecho.linkLabel,
      },
    },
  });

  // ── Brasil e exterior ─────────────────────────────────────────────────────
  // Seeded in pt and en (see the file comment). Both localized arrays need their
  // row ids on the English pass.
  const internacional = INTERNACIONAL_DEFAULTS;
  const internacionalPt = await payload.updateGlobal({
    ...shared,
    slug: "page-internacional",
    data: {
      abertura: {
        heading: internacional.abertura.heading,
        body: rt(internacional.abertura.body),
        trustLine: internacional.abertura.trustLine,
      },
      brasileirosFora: {
        heading: internacional.brasileirosFora.heading,
        body: rt(internacional.brasileirosFora.body),
        cities: internacional.brasileirosFora.cities,
      },
      // Not localized — one English section, written once, read on the pt page.
      inEnglish: internacional.inEnglish,
      pratico: { heading: internacional.pratico.heading, items: internacional.pratico.items },
      comecar: {
        heading: internacional.comecar.heading,
        body: internacional.comecar.body,
        linkLabel: internacional.comecar.linkLabel,
      },
    },
  });

  const cityIds = rowIds(internacionalPt.brasileirosFora?.cities);
  const internacionalPraticoIds = rowIds(internacionalPt.pratico?.items);
  const internacionalEn = INTERNACIONAL_EN;

  await payload.updateGlobal({
    slug: "page-internacional",
    locale: "en",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: {
      abertura: {
        heading: internacionalEn.abertura.heading,
        body: rt(internacionalEn.abertura.body),
        trustLine: internacionalEn.abertura.trustLine,
      },
      brasileirosFora: {
        heading: internacionalEn.brasileirosFora.heading,
        body: rt(internacionalEn.brasileirosFora.body),
        cities: internacionalEn.brasileirosFora.cities.map((row, index) =>
          withId(row, cityIds[index]),
        ),
      },
      inEnglish: internacional.inEnglish,
      pratico: {
        heading: internacionalEn.pratico.heading,
        items: internacionalEn.pratico.items.map((row, index) =>
          withId(row, internacionalPraticoIds[index]),
        ),
      },
      comecar: {
        heading: internacionalEn.comecar.heading,
        body: internacionalEn.comecar.body,
        linkLabel: internacionalEn.comecar.linkLabel,
      },
    },
  });

  // ── Privacidade ───────────────────────────────────────────────────────────
  // The launch gate of TASK-042: the page has to name the aggregate statistics
  // honestly before the site is indexable, in the language the reader is reading.
  const privacidadeData = (
    page: Privacidade,
    ids: { guarda: Array<string | null | undefined>; nuncaFaz: Array<string | null | undefined> },
  ) => ({
    abertura: { heading: page.abertura.heading, body: rt(page.abertura.body) },
    guarda: {
      heading: page.guarda.heading,
      items: page.guarda.items.map((item, index) =>
        withId({ title: item.title, text: item.text }, ids.guarda[index]),
      ),
    },
    nuncaFaz: {
      heading: page.nuncaFaz.heading,
      items: page.nuncaFaz.items.map((item, index) =>
        withId({ title: item.title, text: item.text }, ids.nuncaFaz[index]),
      ),
    },
    bilheteNota: {
      heading: page.bilheteNota.heading,
      body: page.bilheteNota.body,
      linkLabel: page.bilheteNota.linkLabel,
    },
    responsavel: {
      heading: page.responsavel.heading,
      body: rt(page.responsavel.body),
      rights: page.responsavel.rights,
      confidentiality: page.responsavel.confidentiality,
    },
  });

  const privacidadePt = await payload.updateGlobal({
    ...shared,
    slug: "page-privacidade",
    data: privacidadeData(PRIVACIDADE_DEFAULTS.pt, { guarda: [], nuncaFaz: [] }),
  });

  await payload.updateGlobal({
    slug: "page-privacidade",
    locale: "en",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: privacidadeData(PRIVACIDADE_DEFAULTS.en, {
      guarda: rowIds(privacidadePt.guarda?.items),
      nuncaFaz: rowIds(privacidadePt.nuncaFaz?.items),
    }),
  });

  payload.logger.info("  ✓ page globals (all 8; internacional and privacidade in pt + en)");
}

/**
 * `/internacional` in English — a draft in exactly the same sense as the
 * Portuguese, awaiting her sign-off (TASK-052).
 *
 * It lives here rather than in `INTERNACIONAL_DEFAULTS` because the domain layer
 * holds one shape per concept, not one per locale: the page's code fallback is
 * Portuguese and Payload's own fallback covers a blank English field. This is the
 * seed's copy, so it belongs to the seed. `/privacidade` takes the other route —
 * its defaults are keyed by locale — because there an English reader falling back
 * to Portuguese legal prose is a defect rather than a rough edge, and the page
 * must degrade correctly even with Payload off.
 */
const INTERNACIONAL_EN = {
  abertura: {
    heading: "A Brazilian psychologist online, for people living abroad",
    body: richText([
      "I work online with Brazilians living abroad and with people from other countries, in Portuguese or in English, by video call. I have worked with Brazilians in Portugal, England and the United States.",
      "Jungian-oriented psychotherapy and career guidance, in weekly meetings. We settle the time zone, the language and the payment in the first conversation.",
    ]),
    trustLine:
      "Sessions follow Brazilian telepsychology regulation: that is how a Brazilian psychologist works online with people living in another country.",
  },
  brasileirosFora: {
    heading: "For Brazilians living outside Brazil",
    body: richText([
      "You do not need to be in Brazil to begin, and you do not need to interrupt what you have already begun because you moved. The work happens in Portuguese, by video call, from wherever you live.",
      "Three examples, to give the measure of the difference:",
    ]),
    // The offsets name a range on purpose: Brazil abolished daylight saving time
    // in 2019, Europe and the United States did not, so a fixed hour difference
    // would be wrong for part of every year.
    cities: [
      {
        city: "Lisbon",
        note: "Three or four hours ahead of Brasília, depending on European daylight saving time — late afternoon there is mid-afternoon here.",
      },
      {
        city: "London",
        note: "The same time zone as Lisbon: early evening in London is still late afternoon in Brazil.",
      },
      {
        city: "New York",
        note: "One or two hours behind Brasília, depending on US daylight saving time — late afternoon in New York is early evening here.",
      },
    ],
  },
  pratico: {
    heading: "In practice",
    items: [
      {
        label: "Time zones",
        value:
          "Brasília time is the reference. I do the arithmetic with you and offer times that already fit your day.",
      },
      {
        label: "Fees",
        value:
          "For people living outside Brazil, fees are in dollars or euros. We agree on the amount and how to pay in the first conversation.",
      },
      { label: "How it happens", value: "By video call. I send the link before each meeting." },
      { label: "Languages", value: "Portuguese or English, whichever you prefer." },
      {
        label: "From where",
        value:
          "From anywhere in the world. You need a stable connection and a place where you can speak without being interrupted.",
      },
    ],
  },
  comecar: {
    heading: "Begin from where you are",
    body: "Write and tell me where you are writing from — that already settles half of what we need to arrange. We sort out the rest in the conversation.",
    linkLabel: "see how the first conversation works",
  },
};
