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
 * **Both locales, on all eight pages.** Until 2026-08-07 only `/internacional` and
 * `/privacidade` had English copy and the other six leaned on Payload's
 * `fallback: true`, which served Portuguese to an English reader. That fallback is
 * the right safety net and the wrong shipping state, so every page now seeds `en`
 * too. The English is a translation of her settled Portuguese, and it is
 * explicitly provisional: her own polish pass over it is still owed (CONCEPT
 * §13.9), and RISK-004 of `plan/design-site-copy-1.md` names the loss of register
 * that a translated voice carries.
 *
 * Portuguese is always written first and English second, because only the first
 * pass mints row ids and the second has to reuse them (see `rowIds`).
 *
 * Two English strings are **not** translations and must not be treated as such:
 * `internacional.inEnglish`, which is written in English once and read on the
 * *Portuguese* page, and `clinica.notes.english`, the opener an anglophone taps.
 * Both are shared between locales rather than localized.
 *
 * `/privacidade` keeps its own route: its copy is keyed by locale in
 * `PRIVACIDADE_DEFAULTS` rather than held here, because an anglophone reading a
 * privacy statement they cannot read is a defect rather than a rough edge, and
 * that page has to degrade into English even with Payload switched off.
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
  // Portuguese is written first on every page, and English second, because the
  // English pass needs the row ids the Portuguese pass minted (see `rowIds`).
  const english = { ...shared, locale: "en" } as const;

  // ── Início ────────────────────────────────────────────────────────────────
  const inicio = INICIO_DEFAULTS;
  const inicioPt = await payload.updateGlobal({
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

  const inicioBeatIds = rowIds(inicioPt.comoComecar?.beats);
  await payload.updateGlobal({
    ...english,
    slug: "page-inicio",
    data: {
      hero: {
        lead: rt(INICIO_EN.hero.lead),
        ctaPrimaryLabel: INICIO_EN.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: INICIO_EN.hero.ctaSecondaryLabel,
      },
      instagram: { heading: INICIO_EN.instagram.heading, intro: INICIO_EN.instagram.intro },
      doisCaminhos: {
        heading: INICIO_EN.doisCaminhos.heading,
        analysis: INICIO_EN.doisCaminhos.analysis,
        careerGuidance: INICIO_EN.doisCaminhos.careerGuidance,
        boundary: INICIO_EN.doisCaminhos.boundary,
      },
      oSintoma: {
        heading: INICIO_EN.oSintoma.heading,
        body: rt(INICIO_EN.oSintoma.body),
        linkLabel: INICIO_EN.oSintoma.linkLabel,
      },
      sobreDigest: {
        heading: INICIO_EN.sobreDigest.heading,
        body: rt(INICIO_EN.sobreDigest.body),
        linkLabel: INICIO_EN.sobreDigest.linkLabel,
      },
      brasilExterior: {
        heading: INICIO_EN.brasilExterior.heading,
        body: INICIO_EN.brasilExterior.body,
        linkLabel: INICIO_EN.brasilExterior.linkLabel,
      },
      comoComecar: {
        heading: INICIO_EN.comoComecar.heading,
        beats: INICIO_EN.comoComecar.beats.map((row, index) => withId(row, inicioBeatIds[index])),
        linkLabel: INICIO_EN.comoComecar.linkLabel,
      },
      vozes: { heading: INICIO_EN.vozes.heading },
      contato: {
        eyebrow: INICIO_EN.contato.eyebrow,
        heading: INICIO_EN.contato.heading,
        body: rt(INICIO_EN.contato.body),
        whatsappLabel: INICIO_EN.contato.whatsappLabel,
      },
    },
  });

  // ── A Análise ─────────────────────────────────────────────────────────────
  // Her five-paragraph method text and the three pillars are hers, verbatim;
  // the rest is drafted from CONCEPT §6 (as condensed in 2026-08).
  const analise = ANALISE_DEFAULTS;
  const analisePt = await payload.updateGlobal({
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

  const pillarIds = rowIds(analisePt.oQueTrazem?.pillars);
  const parallelIds = rowIds(analisePt.sonhoAmpliado?.parallels);
  const analisePraticoIds = rowIds(analisePt.pratico?.items);
  await payload.updateGlobal({
    ...english,
    slug: "page-analise",
    data: {
      abertura: { heading: ANALISE_EN.abertura.heading, body: rt(ANALISE_EN.abertura.body) },
      oQueTrazem: {
        heading: ANALISE_EN.oQueTrazem.heading,
        note: ANALISE_EN.oQueTrazem.note,
        pillars: ANALISE_EN.oQueTrazem.pillars.map((row, index) => withId(row, pillarIds[index])),
        boundary: ANALISE_EN.oQueTrazem.boundary,
        linkLabel: ANALISE_EN.oQueTrazem.linkLabel,
      },
      oMetodo: {
        heading: ANALISE_EN.oMetodo.heading,
        body: rt(ANALISE_EN.oMetodo.body),
        toolsLine: ANALISE_EN.oMetodo.toolsLine,
        individuacao: rt(ANALISE_EN.oMetodo.individuacao),
        closingLine: ANALISE_EN.oMetodo.closingLine,
      },
      sonhoAmpliado: {
        heading: ANALISE_EN.sonhoAmpliado.heading,
        intro: ANALISE_EN.sonhoAmpliado.intro,
        // Still null, and still her switch: the section is gated on the motif in
        // both locales, so translating the labels does not turn it on.
        motif: analise.sonhoAmpliado.motif,
        parallels: ANALISE_EN.sonhoAmpliado.parallels.map((row, index) =>
          withId(row, parallelIds[index]),
        ),
      },
      pratico: {
        heading: ANALISE_EN.pratico.heading,
        items: ANALISE_EN.pratico.items.map((row, index) => withId(row, analisePraticoIds[index])),
        comecar: ANALISE_EN.pratico.comecar,
      },
      mandala: { heading: ANALISE_EN.mandala.heading, intro: ANALISE_EN.mandala.intro },
    },
  });

  // ── Orientação profissional e de carreira ─────────────────────────────────
  const orientacao = ORIENTACAO_PROFISSIONAL_DEFAULTS;
  const orientacaoPt = await payload.updateGlobal({
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

  const caseIds = rowIds(orientacaoPt.paraQuem?.cases);
  const stepIds = rowIds(orientacaoPt.oPercurso?.steps);
  const distinctionIds = rowIds(orientacaoPt.nemCoaching?.distinctions);
  const orientacaoPraticoIds = rowIds(orientacaoPt.pratico?.items);
  await payload.updateGlobal({
    ...english,
    slug: "page-orientacao-profissional",
    data: {
      abertura: {
        heading: ORIENTACAO_PROFISSIONAL_EN.abertura.heading,
        body: rt(ORIENTACAO_PROFISSIONAL_EN.abertura.body),
      },
      paraQuem: {
        heading: ORIENTACAO_PROFISSIONAL_EN.paraQuem.heading,
        cases: ORIENTACAO_PROFISSIONAL_EN.paraQuem.cases.map((text, index) =>
          withId({ text }, caseIds[index]),
        ),
      },
      oPercurso: {
        heading: ORIENTACAO_PROFISSIONAL_EN.oPercurso.heading,
        body: rt(ORIENTACAO_PROFISSIONAL_EN.oPercurso.body),
        steps: ORIENTACAO_PROFISSIONAL_EN.oPercurso.steps.map((row, index) =>
          withId(row, stepIds[index]),
        ),
        deliverable: ORIENTACAO_PROFISSIONAL_EN.oPercurso.deliverable,
      },
      nemCoaching: {
        heading: ORIENTACAO_PROFISSIONAL_EN.nemCoaching.heading,
        body: rt(ORIENTACAO_PROFISSIONAL_EN.nemCoaching.body),
        distinctions: ORIENTACAO_PROFISSIONAL_EN.nemCoaching.distinctions.map((row, index) =>
          withId(row, distinctionIds[index]),
        ),
        anchor: ORIENTACAO_PROFISSIONAL_EN.nemCoaching.anchor,
        bridge: ORIENTACAO_PROFISSIONAL_EN.nemCoaching.bridge,
      },
      pratico: {
        heading: ORIENTACAO_PROFISSIONAL_EN.pratico.heading,
        items: ORIENTACAO_PROFISSIONAL_EN.pratico.items.map((row, index) =>
          withId(row, orientacaoPraticoIds[index]),
        ),
        comecar: ORIENTACAO_PROFISSIONAL_EN.pratico.comecar,
      },
    },
  });

  // ── Sobre ─────────────────────────────────────────────────────────────────
  // Her bio moved here from the old home digest; the page that owns it now owns
  // its only copy in the repository.
  const sobre = SOBRE_DEFAULTS;
  const sobrePt = await payload.updateGlobal({
    ...shared,
    slug: "page-sobre",
    data: {
      abertura: { heading: sobre.abertura.heading, lead: rt(sobre.abertura.lead) },
      quemE: { heading: sobre.quemE.heading, body: rt(sobre.quemE.body) },
      // `period` is null on every row: not even her own 2026-08-07 text states a
      // year, and a guessed one on the page whose job is verification is
      // unrecoverable.
      formacao: {
        heading: sobre.formacao.heading,
        intro: sobre.formacao.intro,
        items: sobre.formacao.items,
      },
      aClinica: {
        heading: sobre.aClinica.heading,
        body: rt(sobre.aClinica.body),
        linkLabel: sobre.aClinica.linkLabel,
      },
    },
  });

  const formacaoIds = rowIds(sobrePt.formacao?.items);
  await payload.updateGlobal({
    ...english,
    slug: "page-sobre",
    data: {
      abertura: { heading: SOBRE_EN.abertura.heading, lead: rt(SOBRE_EN.abertura.lead) },
      quemE: { heading: SOBRE_EN.quemE.heading, body: rt(SOBRE_EN.quemE.body) },
      formacao: {
        heading: SOBRE_EN.formacao.heading,
        intro: SOBRE_EN.formacao.intro,
        // Only `title` is localized: `institution` is a proper noun shared between
        // locales, and `period` is unset in both because she supplied no years.
        items: SOBRE_EN.formacao.items.map((row, index) => withId(row, formacaoIds[index])),
      },
      aClinica: {
        heading: SOBRE_EN.aClinica.heading,
        body: rt(SOBRE_EN.aClinica.body),
        linkLabel: SOBRE_EN.aClinica.linkLabel,
      },
    },
  });

  // ── A primeira conversa ───────────────────────────────────────────────────
  const primeiraConversa = PRIMEIRA_CONVERSA_DEFAULTS;
  const primeiraConversaPt = await payload.updateGlobal({
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

  const conversaStepIds = rowIds(primeiraConversaPt.passoAPasso?.steps);
  const permissaoIds = rowIds(primeiraConversaPt.passoAPasso?.permissoes?.items);
  const logisticaIds = rowIds(primeiraConversaPt.logistica?.items);
  const doubtIds = rowIds(primeiraConversaPt.logistica?.doubts);
  await payload.updateGlobal({
    ...english,
    slug: "page-primeira-conversa",
    data: {
      abertura: {
        heading: PRIMEIRA_CONVERSA_EN.abertura.heading,
        lead: rt(PRIMEIRA_CONVERSA_EN.abertura.lead),
      },
      passoAPasso: {
        heading: PRIMEIRA_CONVERSA_EN.passoAPasso.heading,
        steps: PRIMEIRA_CONVERSA_EN.passoAPasso.steps.map((row, index) =>
          withId(row, conversaStepIds[index]),
        ),
        permissoes: {
          items: PRIMEIRA_CONVERSA_EN.passoAPasso.permissoes.items.map((text, index) =>
            withId({ text }, permissaoIds[index]),
          ),
        },
      },
      logistica: {
        heading: PRIMEIRA_CONVERSA_EN.logistica.heading,
        items: PRIMEIRA_CONVERSA_EN.logistica.items.map((row, index) =>
          withId(row, logisticaIds[index]),
        ),
        doubts: PRIMEIRA_CONVERSA_EN.logistica.doubts.map((row, index) =>
          withId(row, doubtIds[index]),
        ),
        linkLabel: PRIMEIRA_CONVERSA_EN.logistica.linkLabel,
      },
      bilhete: {
        heading: PRIMEIRA_CONVERSA_EN.bilhete.heading,
        intro: rt(PRIMEIRA_CONVERSA_EN.bilhete.intro),
        chooseLabel: PRIMEIRA_CONVERSA_EN.bilhete.chooseLabel,
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

  // No row ids to carry: `sections` is a group of four, not an array, and the
  // section intros stay null in both locales.
  await payload.updateGlobal({
    ...english,
    slug: "page-perguntas",
    data: {
      abertura: { heading: PERGUNTAS_EN.abertura.heading, intro: PERGUNTAS_EN.abertura.intro },
      sections: {
        analise: { heading: PERGUNTAS_EN.sections.analise },
        orientacao: { heading: PERGUNTAS_EN.sections.orientacao },
        pratico: { heading: PERGUNTAS_EN.sections.pratico },
        internacional: { heading: PERGUNTAS_EN.sections.internacional },
      },
      fecho: {
        heading: PERGUNTAS_EN.fecho.heading,
        body: PERGUNTAS_EN.fecho.body,
        whatsappLabel: PERGUNTAS_EN.fecho.whatsappLabel,
        linkLabel: PERGUNTAS_EN.fecho.linkLabel,
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

  payload.logger.info("  ✓ page globals (all 8, in pt + en)");
}

// ---------------------------------------------------------------------------
// The English page copy.
//
// It lives here rather than in the `*_DEFAULTS` objects because the domain layer
// holds one shape per concept, not one per locale: each page's code fallback is
// Portuguese, and Payload's own `fallback: true` covers a blank English field.
// This is the seed's copy, so it belongs to the seed. `/privacidade` is the one
// documented exception, keyed by locale in its own defaults, because there a
// fallback into Portuguese legal prose is a defect rather than a rough edge.
//
// **Three rules bind every string below.**
//
//   1. **CON-002 — she is never a "Jungian analyst" in English.** That is a
//      formally protected title. She is a *clinical psychologist working in the
//      Jungian tradition*, and what she practises is *Jungian-oriented
//      psychotherapy* or *analytical psychology*.
//   2. **Her paragraphs are translated, not paraphrased.** An English reader
//      should meet the same person: her doubled "orientação profissional e
//      orientação de carreira" stays doubled, her exclamation mark stays, her
//      curly quotes around "anticapitalista" stay curly, and the em dash in her
//      individuação sentence stays an em dash (CON-004).
//   3. **Individuation is described, never promised** (CON-006). The guardrail
//      sentence that closes `oMetodo.individuacao` is translated with the rest.
//
// British spelling throughout, matching `messages/en.json` ("programme",
// "recognise", "centre"), and its established vocabulary: Analysis · Career
// guidance · Brazil and abroad · Brasília time · clinical psychologist.
//
// **All of it is provisional.** CONCEPT §13.9 reserves her own pass over the
// English, and RISK-004 states the cost plainly: her voice is Portuguese, and a
// translated voice loses register no matter how careful the translator.
// ---------------------------------------------------------------------------

const INICIO_EN = {
  hero: {
    // Hers, verbatim in Portuguese. The two italic runs are the words the
    // manuscript emphasises, and they survive the translation.
    lead: richText([
      [
        {
          text: "I work with adults at moments when everyday life no longer accounts for what is happening: an ",
        },
        { text: "anxiety", italic: true },
        { text: " that will not pass, a recent " },
        { text: "grief", italic: true },
        {
          text: ", work that has lost its meaning. I listen to what insists, and to what has not yet found words.",
        },
      ],
    ]),
    ctaPrimaryLabel: "talk on WhatsApp",
    ctaSecondaryLabel: "how the first conversation works",
  },
  instagram: {
    heading: "What I post",
    intro:
      "On Instagram, everything moves past quickly. Here each post sits at the centre, one at a time, with the text that came with it.",
  },
  doisCaminhos: {
    heading: "Two paths",
    analysis: {
      title: "Analysis",
      body: "Jungian psychotherapy, weekly and with no set end. For people who arrive with anxiety, with a grief, with relationships that weigh, or with the sense that work has lost its meaning.",
      linkLabel: "read about analysis",
    },
    careerGuidance: {
      title: "Career and vocational guidance",
      body: "A programme with a beginning, a middle and an end: up to twelve weekly meetings with tests, conversations and activities, to reach the profession that makes the most sense in your life right now.",
      linkLabel: "read about career guidance",
    },
    // CONCEPT §4's routing sentence. Protected from the humanize pass on the
    // Portuguese side (CON-005), and translated here as carefully as it was written.
    boundary:
      "When the question is what work means in your life, the path is analysis. When the question is which profession, it is career guidance.",
  },
  oSintoma: {
    heading: "The symptom as a call",
    body: richText([
      "What insists — the anxiety that returns, the dream that repeats, the tiredness that rest does not touch — is rarely just a fault to correct. It is a way the psyche has of saying something that has not yet fitted into words.",
      "The work is to listen to that call until you understand what it is about, rather than to silence it.",
    ]),
    linkLabel: "how I work",
  },
  sobreDigest: {
    heading: "Who receives you",
    // Hers, verbatim in Portuguese.
    body: richText([
      "I am a clinical psychologist. I work with adults going through anxiety, grief, career transitions or suffering in their relationships.",
      "The pace matters as much as the content. Nothing that usually brings someone to analysis is understood in a hurry.",
    ]),
    linkLabel: "about Luiza",
  },
  brasilExterior: {
    heading: "Brazil and abroad",
    body: "Sessions are in Portuguese or in English, in your own time zone. I have worked with people in Portugal, England and the United States — living abroad does not interrupt an analysis.",
    linkLabel: "if you live abroad",
  },
  comoComecar: {
    heading: "How it begins",
    beats: [
      {
        numeral: "I",
        text: "You write to me on WhatsApp. A short message is enough — you do not have to tell everything at once.",
      },
      {
        numeral: "II",
        text: "We arrange a time for a first conversation of about fifty minutes, with no commitment to continue.",
      },
      {
        numeral: "III",
        text: "After it, you decide. If it makes sense for us both, we set the weekly meeting.",
      },
    ],
    linkLabel: "the first conversation in detail",
  },
  // Hers.
  vozes: { heading: "What patients say" },
  contato: {
    // Hers, verbatim in Portuguese.
    eyebrow: "To begin",
    heading: "A short conversation is usually enough to see whether this makes sense.",
    body: richText([
      "The simplest way is WhatsApp. You write me a short message (you do not have to tell everything at once) and we arrange a time for a first conversation, with no commitment. From there we decide together how to continue.",
    ]),
    whatsappLabel: "Talk on WhatsApp",
  },
};

const ANALISE_EN = {
  abertura: {
    // The page's search term in English, and still the page's own name.
    heading: "Jungian analysis",
    body: richText([
      "Analysis is a safe space for listening, reflection and change: Jungian-oriented psychotherapy, online, in weekly meetings, in Portuguese or in English, from anywhere in Brazil or abroad.",
      // Hers (SRC-F.1).
      "Unlike approaches that focus only on silencing a symptom (anxiety or distress, say), the clinic of depth psychology understands that the symptom has a purpose: it is a call from our unconscious asking for attention.",
    ]),
  },
  oQueTrazem: {
    heading: "What people bring",
    note: "Three fronts that commonly bring someone to analysis. They almost always cross, and the work starts wherever it hurts most now.",
    // Hers, verbatim in Portuguese.
    pillars: [
      {
        numeral: "I",
        title: "Anxiety & mood",
        text: "Anxiety that tightens the chest, episodes of sadness, fears that paralyse, a melancholy that settles without a name. The work begins by listening to what those states are trying to say.",
      },
      {
        numeral: "II",
        title: "Relationships & life",
        text: "Griefs, separations, conflicts with family, loneliness, old deprivations. Our bonds form who we are; when they collapse or weigh, it is worth turning inward and telling apart what is ours from what belongs to the other person.",
      },
      {
        numeral: "III",
        title: "Career & purpose",
        text: "Dissatisfaction at work, stress, the sense of being on the wrong path, the search for a vocation that makes sense. Analysis opens space to listen to what the psyche already knows.",
      },
    ],
    // CONCEPT §4's boundary sentence (CON-005 on the Portuguese side).
    boundary:
      "When the question is what work means in your life, it is matter for analysis. When the question is which profession to follow, there is a more direct path: career guidance, a programme with a beginning, a middle and an end.",
    linkLabel: "read about career and vocational guidance",
  },
  oMetodo: {
    heading: "How the work happens",
    // **Hers, verbatim in Portuguese — all five paragraphs.** Her curly quotes are
    // kept curly and her two licensed corrections are carried across: the subject
    // agreement in paragraph 4 and the closed-up "anticapitalist".
    body: richText([
      "I take seriously what shows itself in dreams, fantasies, images and symptoms. They are not noise: they are the ways the psyche speaks about what does not yet fit into words.",
      "I do not remove symptoms; I work on strengthening your ego so that one day those symptoms are no longer necessary. Analytical practice does not work to eliminate symptoms — we deal with depth psychology.",
      "How do we do that? Through becoming conscious of your own emotions, your personality, the moment you are living, how you react to the sorrows and the joys of your own existence. Alongside that, consistent work, through weekly meetings.",
      "I like to say that clinical psychology is the most “anticapitalist” work there is, because what it offers brings no quick solution and no painless one. As a matter of ethics, the content of the meetings is dictated by the patient, according to what they are ready to bring.",
      "I will only offer an observation when I believe you are ready to receive it, respecting the time of your process and your subjectivity. There is no hurry in the process of individuation.",
    ]),
    // Her vocabulary, condensed the way the Portuguese is (ledger OPEN-B).
    toolsLine:
      "Sessions are a space for free, welcoming dialogue without judgement. Beyond the conversation, the work draws on symbolic tools to reach what lies past the rational: dreams, the images, fantasies and symbols of your day to day, the patterns that repeat and block your development.",
    // Hers (SRC-F.2), with the italic run on Individuation where she capitalised
    // it. The closing sentence is ours: CONCEPT §11's guarantee (CON-006).
    individuacao: richText([
      [
        {
          text: "In this approach we look at the human being as a whole. We explore not only your life history and your conscious challenges, but also the language of your inner world. We work with the idea of ",
        },
        { text: "Individuation", italic: true },
        {
          text: " — the continuous process of becoming who you really are, integrating your light and your shadow. It is a concept that describes the direction of the work, not a result that analysis promises.",
        },
      ],
    ]),
    // Hers (SRC-F.4), in full.
    closingLine:
      "It is a work of collaboration. Together we will build bridges between your conscious and your unconscious, bringing more balance, meaning and vitality to your life.",
  },
  sonhoAmpliado: {
    heading: "The amplified dream",
    intro:
      "Amplification is the name for that gesture. When an image insists, it is not translated from outside: it is set beside its relatives, in painting, in myth, in Jung's own work, until the dreamer recognises what it is asking for.",
    parallels: [{ label: "A painting" }, { label: "A myth" }, { label: "A passage" }],
  },
  pratico: {
    heading: "In practice",
    items: [
      { label: "Frequency", value: "One meeting a week." },
      { label: "Duration", value: "About fifty minutes per meeting." },
      { label: "How it happens", value: "By video call. I send the link before each meeting." },
      {
        label: "How long it lasts",
        value:
          "Analysis has no fixed term: it is medium to long-term work, and it is you who decides whether to continue or to stop.",
      },
      { label: "Languages", value: "Portuguese or English." },
      { label: "From where", value: "From anywhere in Brazil or abroad." },
      { label: "Times", value: "Always Brasília time." },
    ],
    comecar: {
      // Hers (SRC-H). Her "si mesmo(a)" needs no parenthesis in English, where
      // "yourself" is already ungendered.
      body: "If you feel it is time to begin this journey back to yourself, it will be a joy to accompany your process.",
      linkLabel: "what happens in a first conversation",
    },
  },
  mandala: {
    heading: "The mandala of the signs",
    intro:
      "Twelve painted figures, twenty-seven lunar mansions, the Earth at the centre. Here the signs are vocabulary: images for naming what you live through, never a prediction and never a reading about who you are.",
  },
};

const ORIENTACAO_PROFISSIONAL_EN = {
  abertura: {
    heading: "Career and vocational guidance",
    // Hers (SRC-B), split at her own sentence boundaries. Her doubled
    // "orientação profissional e orientação de carreira" is kept doubled.
    body: richText([
      "I specialise in professional guidance and career guidance, trained at PUC-SP. Through psychological tests, conversations and proposed activities, I can help you discover the profession that makes the most sense in your life right now.",
      "Up to twelve weekly meetings, online. In Portuguese or in English, from anywhere in Brazil or abroad.",
    ]),
  },
  paraQuem: {
    heading: "Who it is for",
    cases: [
      "Choosing a first course or a first profession — without deciding by elimination.",
      "Changing field, when the question is not whether you can, but where to.",
      "Understanding what happened when the work you always did lost its meaning.",
      "Starting again after a dismissal, after a pause, after years given to something else.",
    ],
  },
  oPercurso: {
    heading: "The path",
    body: richText([
      "The path moves through four movements. How many meetings each one takes depends on you — twelve is the ceiling, not the goal.",
    ]),
    steps: [
      {
        numeral: "I",
        title: "What brought you here",
        text: "Your history: the choice you made or could not make, what draws you and what you avoid, what your family expected. This is where the question takes shape.",
      },
      {
        numeral: "II",
        title: "The tests",
        text: "Psychological tests applied within the process and read together with you. They decide nothing on your behalf: they return material the conversation alone cannot reach.",
      },
      {
        numeral: "III",
        title: "The world of work",
        text: "Between one meeting and the next, activities to carry out: researching careers, talking to people who already work in them, trying things. The reality of professions enters the process.",
      },
      {
        numeral: "IV",
        title: "Reading it back",
        text: "We gather what appeared and talk about what became clear. It is not a report with one single answer: it is a reading you understand because you built it with me.",
      },
    ],
    // Leads with what only this band adds: the promise itself is made in her own
    // words in the abertura, and repeating it here would spend the page's
    // repetition budget on nothing (GUD-001).
    deliverable:
      "What you take away is not only the answer: it is understanding how you arrived at it. That is what lets you choose again, if in a few years your life asks for something else.",
  },
  nemCoaching: {
    heading: "Neither coaching nor a test on its own",
    body: richText([
      "Anyone looking for help deciding a career finds three things with similar names: a test that returns a list of professions, a form of support aimed at goals, and career guidance done inside psychology. This is the third.",
    ]),
    distinctions: [
      {
        title: "A psychologist, registered.",
        text: "The guidance happens inside clinical psychology: professional registration, a code of ethics, and confidentiality about everything you bring. If something appears that calls for another kind of care, I recognise it and say so.",
      },
      {
        title: "The tests stay inside the process.",
        text: "Psychological tests may only be administered and interpreted by psychologists. Here they enter as working material, not as a verdict: read with you, in the light of your history.",
      },
      {
        title: "Vocation read in depth.",
        text: "Interest and aptitude explain part of a choice. The other part lies in what repeats without your noticing, in what attracts and frightens at the same time. That is the material analytical psychology listens to.",
      },
    ],
    anchor:
      "In the Jungian tradition, a vocation is not a label waiting to be discovered. It forms along with the person, in the process Jung called individuation.",
    bridge: {
      body: "Sometimes the path begins and the question turns out to be a different one — not which profession, but why nothing feels like enough, or a tiredness that was already there beforehand. When that is what it is, I say so, and analysis is the better path.",
      linkLabel: "read about analysis",
    },
  },
  pratico: {
    heading: "In practice",
    items: [
      {
        label: "Duration",
        value: "Up to twelve weekly meetings, with a beginning, a middle and an end.",
      },
      { label: "How it happens", value: "By video call, at an agreed time." },
      { label: "Languages", value: "Portuguese or English." },
      { label: "From where", value: "From anywhere in Brazil or abroad." },
      { label: "Times", value: "Always Brasília time." },
    ],
    comecar: {
      body: "If the career question is yours, write to me. In the first conversation I explain the path calmly, and you decide afterwards.",
      linkLabel: "what happens in a first conversation",
    },
  },
};

const SOBRE_EN = {
  abertura: {
    // Her name is the page's h1 in both locales: /about is the address the entity
    // graph gives the Person node.
    heading: "Luiza Fernandes Bezerra",
    lead: richText([
      "I am a clinical psychologist and I work in the tradition of Jung's analytical psychology. I see adults in analysis and in career and vocational guidance, always online, in Portuguese or in English, anywhere in Brazil or abroad.",
      "This page is for you to know me before you write: who I am, where I trained, and how this clinic came about.",
    ]),
  },
  quemE: {
    // Hers, verbatim in Portuguese.
    heading: "A careful listening, in the Jungian tradition.",
    body: richText([
      "I am a clinical psychologist. I work with adults going through anxiety, grief, career transitions or suffering in their relationships.",
      // Hers (SRC-E.1 + SRC-E.2).
      "My journey in psychology now spans twenty-two years, with direct clinical practice since 2014. My aim is to offer a safe space for listening, reflection and change, for anyone seeking to know themselves authentically and deeply.",
      // Hers (SRC-E.3), exclamation mark and all. The italic run falls on the
      // phrase PRODUCT quotes as hers.
      [
        {
          text: "My theoretical and academic approach is the Analytical Psychology of Carl Gustav Jung. The first time I came into contact with his theory I was in my second year at university, and it was ",
        },
        { text: "a path with no way back", italic: true },
        {
          text: " for me! Since then I have taken courses along that line, as well as my final dissertation and later my postgraduate studies.",
        },
      ],
      "The pace matters as much as the content. Nothing that usually brings someone to analysis is understood in a hurry: persistent symptoms, dreams that return, symbols that touch something before we have words.",
      "The first sessions are for us to see together whether we can continue.",
    ]),
  },
  formacao: {
    heading: "Training",
    // Hers (SRC-E.4).
    intro: "I believe that caring for another person demands constant study and rigorous depth.",
    // Her own course names, translated. `institution` is not localized — PUC-SP,
    // Instituto Numen and USP are proper nouns — and `period` stays unset in both
    // locales because no source, including her own text, states a year.
    items: [
      { title: "Degree in Psychology" },
      { title: "Postgraduate degree in Clinical Psychology" },
      { title: "Advanced training in Jungian Clinical Psychology" },
      { title: "Advanced training in Career and Vocational Guidance" },
      { title: "Extension course in Psychology and Religion" },
      { title: "Extension course in Psychology, Religion and Anomalous Phenomena" },
    ],
  },
  aClinica: {
    heading: "From a page to a clinic",
    body: richText([
      "Símbolos do Self began as a page: classical paintings and lines from Jung, one at a time, for more than forty-five thousand people. The name passed from the page to the clinic.",
      // CON-005 on the Portuguese side — the sentence that states the whole
      // relationship between the clinic and the person.
      "Símbolos do Self is the place; I am the one who receives you in it. On the page, the images stand on their own; in the clinic they become work, between two people, in the time of whoever arrives.",
      "Sessions are in Portuguese or in English, for anywhere in Brazil and for people living abroad.",
    ]),
    linkLabel: "how the first conversation works",
  },
};

const PRIMEIRA_CONVERSA_EN = {
  abertura: {
    heading: "The first conversation",
    lead: richText([
      "A conversation of about fifty minutes, by video call, in Portuguese or in English, from wherever you are — Brazil or abroad.",
      "It is for us to get to know each other: you say what is happening, I listen, and at the end the decision to continue is yours.",
    ]),
  },
  passoAPasso: {
    heading: "How it happens",
    steps: [
      {
        numeral: "I",
        title: "You write to me",
        text: "A message on WhatsApp, whatever length it comes out.",
      },
      {
        numeral: "II",
        title: "We arrange the time",
        text: "You choose from the times I have, and I send the call link before the day.",
      },
      {
        numeral: "III",
        title: "The fifty minutes",
        text: "You say what is happening, at whatever pace comes. I listen, ask some questions, and tell you how I would work with what you brought.",
      },
      {
        numeral: "IV",
        title: "You decide afterwards",
        text: "If it makes sense for us both, we set the weekly meeting. If you want to think it over, write back another day — there is nothing to sign.",
      },
    ],
    // CONCEPT §6's three lines (CON-005 on the Portuguese side). They are the
    // shortest sentences on the site and the most load-bearing, so the English
    // stays as plain as the Portuguese.
    permissoes: {
      items: [
        "You do not need to prepare anything.",
        "You do not need to be able to name what you feel.",
        "No subject is too small.",
      ],
    },
  },
  logistica: {
    heading: "What we agree",
    items: [
      { label: "Duration", value: "About fifty minutes." },
      { label: "How it happens", value: "By video call. I send the link beforehand." },
      {
        label: "Rescheduling",
        value: "Things come up: let me know in advance and we rearrange.",
      },
      {
        label: "Times",
        value: "Always Brasília time. If you live abroad, I do the arithmetic with you.",
      },
      { label: "Languages", value: "Portuguese or English." },
    ],
    doubts: [
      {
        question: "Do you work with people living outside Brazil?",
        answer:
          "Yes. I have worked with people in Portugal, England and the United States — we settle the time zone and continue in Portuguese or in English.",
      },
      {
        question: "How long do you take to reply?",
        answer:
          "Within one working day. If I have no times free at the moment, I say so in my reply rather than leaving you waiting.",
      },
    ],
    linkLabel: "all the frequently asked questions",
  },
  bilhete: {
    heading: "The note",
    intro: richText([
      "Writing the first message is usually the hardest part. So it is already written: choose the one closest to your own case and it opens in my WhatsApp — you can still change the text before you send it.",
    ]),
    chooseLabel: "choose where to begin",
  },
};

const PERGUNTAS_EN = {
  abertura: {
    heading: "Frequently asked questions",
    intro:
      "The doubts that come up most before a first conversation — about Jungian analysis, about career and vocational guidance, and about how the sessions work: online, once a week, in Portuguese or in English, for anywhere in Brazil and for people living abroad.",
  },
  // CONCEPT §6's four section names. The four intros stay null in both locales.
  sections: {
    analise: "About analysis",
    orientacao: "About career guidance",
    pratico: "Practical",
    internacional: "International",
  },
  fecho: {
    heading: "Is your question not here?",
    body: "Write anyway. What this page does not answer, I answer by message.",
    whatsappLabel: "write on WhatsApp",
    linkLabel: "what happens in a first conversation",
  },
};

/**
 * `/internacional` in English. Unlike the six constants above, this one predates
 * her 2026-08-07 text; TASK-033 re-translated its opening against it.
 */
const INTERNACIONAL_EN = {
  abertura: {
    heading: "A Brazilian psychologist online, for people living abroad",
    // Paragraph 1 is her own sentence (SRC-G.1), which arrived on 2026-08-07 and
    // now opens the Portuguese page too. It gives the reason before the fact, so
    // paragraph 2 no longer needs to repeat "online" — and neither does the trust
    // line below, which dropped the same appositive on the Portuguese side.
    body: richText([
      "So that distance is never an obstacle to your process of self-knowledge, my sessions happen online.",
      "I work with Brazilians living abroad and with people from other countries, in Portuguese or in English, by video call. I have worked with Brazilians in Portugal, England and the United States.",
      "Jungian-oriented psychotherapy and career guidance, in weekly meetings. We settle the time zone, the language and the payment in the first conversation.",
    ]),
    trustLine:
      "Sessions follow Brazilian telepsychology regulation: that is how a Brazilian psychologist works with people living in another country.",
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
