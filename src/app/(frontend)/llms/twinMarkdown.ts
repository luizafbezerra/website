import { getTranslations } from "next-intl/server";
import { getAnalise } from "@/domain/analise/getAnalise";
import type { Clinica } from "@/domain/clinica/Clinica";
import { getClinica } from "@/domain/clinica/getClinica";
import { REACH } from "@/domain/clinica/reach";
import { getFaq } from "@/domain/faq/getFaq";
import { groupFaqByCategory } from "@/domain/faq/groupFaqByCategory";
import { getInicio } from "@/domain/inicio/getInicio";
import { getInternacional } from "@/domain/internacional/getInternacional";
import type { MarkdownBlock } from "@/domain/markdown/MarkdownBlock";
import { renderMarkdown } from "@/domain/markdown/renderMarkdown";
import type { TwinContext, TwinLabels } from "@/domain/markdown/TwinContext";
import { MACHINE_INDEX_PATH } from "@/domain/markdown/twinPath";
import { analiseDoc } from "@/domain/markdown/twins/analiseDoc";
import { inicioDoc } from "@/domain/markdown/twins/inicioDoc";
import { internacionalDoc } from "@/domain/markdown/twins/internacionalDoc";
import { orientacaoProfissionalDoc } from "@/domain/markdown/twins/orientacaoProfissionalDoc";
import { perguntasDoc } from "@/domain/markdown/twins/perguntasDoc";
import { primeiraConversaDoc } from "@/domain/markdown/twins/primeiraConversaDoc";
import { privacidadeDoc } from "@/domain/markdown/twins/privacidadeDoc";
import { sobreDoc } from "@/domain/markdown/twins/sobreDoc";
import { getOrientacaoProfissional } from "@/domain/orientacaoProfissional/getOrientacaoProfissional";
import { getPerguntas } from "@/domain/perguntas/getPerguntas";
import { getPrimeiraConversa } from "@/domain/primeiraConversa/getPrimeiraConversa";
import { getPrivacidade } from "@/domain/privacidade/getPrivacidade";
import { type Locale, otherLocale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { PAGE_KEYS, type PageKey } from "@/domain/site/pages";
import { getSobre } from "@/domain/sobre/getSobre";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";

/**
 * One page's Markdown twin, assembled (REQ-011).
 *
 * This is the routes layer's half of the twins: reading the CMS through the same
 * domain actions the rendered page reads — never a second copy of the copy — and
 * resolving the two things a pure builder cannot reach for itself, the absolute
 * URLs (which read an env var, so they live in `src/infrastructure/`) and the
 * scaffolding labels (which come from next-intl). The shaping itself is pure and
 * lives in `src/domain/markdown/`.
 *
 * It is a module of its own rather than a function inside the twin route because
 * `/llms.txt` needs it too: the index advertises each twin's token count, and the
 * only count worth advertising is the one measured on the bytes served. Every
 * accessor underneath is request-scoped `cache()`, so building all sixteen for one
 * index render reads each global once per locale.
 */
export async function twinMarkdown(key: PageKey, locale: Locale): Promise<string> {
  const clinica = await getClinica(locale);
  const ctx = await twinContext(key, locale, clinica);

  return renderMarkdown(await twinBlocks(key, locale, ctx));
}

/** Dispatch to the page's own builder, reading exactly what that page's route reads. */
async function twinBlocks(
  key: PageKey,
  locale: Locale,
  ctx: TwinContext,
): Promise<MarkdownBlock[]> {
  switch (key) {
    case "inicio": {
      // The home twin carries the voices for the same reason the page does — and
      // through the same action, whose mapper drops every record without recorded
      // consent (SEC-002).
      const [page, testimonials, sobre] = await Promise.all([
        getInicio(locale),
        getTestimonials(locale),
        // Only for the academic record, which now stands on the home page rather
        // than behind its link — read from /sobre's own field, as the page does.
        getSobre(locale),
      ]);
      return inicioDoc(page, testimonials, sobre.formacao.items, ctx);
    }
    case "analise":
      return analiseDoc(await getAnalise(locale), ctx);
    case "orientacaoProfissional":
      return orientacaoProfissionalDoc(await getOrientacaoProfissional(locale), ctx);
    case "sobre":
      return sobreDoc(await getSobre(locale), ctx);
    case "primeiraConversa":
      return primeiraConversaDoc(await getPrimeiraConversa(locale), ctx);
    case "perguntas": {
      const [page, entries] = await Promise.all([getPerguntas(locale), getFaq(locale)]);
      return perguntasDoc(page, groupFaqByCategory(entries), ctx);
    }
    case "internacional":
      return internacionalDoc(await getInternacional(locale), ctx);
    case "privacidade":
      return privacidadeDoc(await getPrivacidade(locale), ctx);
  }
}

async function twinContext(key: PageKey, locale: Locale, clinica: Clinica): Promise<TwinContext> {
  const [twin, chrome, pratico, nav, horas] = await Promise.all([
    getTranslations({ locale, namespace: "twin" }),
    getTranslations({ locale, namespace: "chrome" }),
    getTranslations({ locale, namespace: "pratico" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "horas" }),
  ]);

  const labels: TwinLabels = {
    page: twin("page"),
    alternate: twin("alternate"),
    index: twin("index"),
    // Reused rather than restated: the strip's own `aria-label`, the agenda's
    // label, the footer's word for an email address, and the four fee labels the
    // rendered prático lists print.
    credentials: chrome("credentialLabel"),
    availability: chrome("availability.label"),
    email: chrome("footer.email"),
    fee: pratico("fee"),
    feeAnalysis: pratico("feeAnalysis"),
    feeCareerGuidance: pratico("feeCareerGuidance"),
    feeToDiscuss: pratico("feeToDiscuss"),
    // The same place names the rendered strip prints, so the twin's reach list
    // and the page's cannot disagree about how a city is spelled in English.
    reach: Object.fromEntries(
      REACH.map((place) => [
        place.key,
        { label: horas(`places.${place.key}.country`), value: horas(`places.${place.key}.city`) },
      ]),
    ),
  };

  const { state, responseWindow } = clinica.availability;
  const availability = chrome(`availability.${state}`);

  return {
    key,
    locale,
    clinica,
    pageUrls: byKey((page) => absoluteUrl(pagePath(page, locale))),
    pageLabels: byKey((page) => nav(page)),
    alternateUrl: absoluteUrl(pagePath(key, otherLocale(locale))),
    indexUrl: absoluteUrl(MACHINE_INDEX_PATH),
    englishHomeUrl: absoluteUrl(pagePath("inicio", "en")),
    availabilityLine: responseWindow ? `${availability} ${responseWindow}` : availability,
    labels,
  };
}

function byKey(value: (key: PageKey) => string): Record<PageKey, string> {
  return Object.fromEntries(PAGE_KEYS.map((key) => [key, value(key)])) as Record<PageKey, string>;
}
