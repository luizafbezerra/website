import type { Clinica } from "@/domain/clinica/Clinica";
import type { Locale } from "@/domain/site/Locale";
import type { PageKey } from "@/domain/site/pages";

// ---------------------------------------------------------------------------
// Everything a twin needs that is not the page's own copy: the practice's
// cross-page facts, the absolute addresses, and the handful of labels a visitor
// never reads.
//
// Two boundaries are visible in this type and both are deliberate.
//
// **The URLs arrive resolved.** `absoluteUrl` reads an environment variable, so
// it lives in `src/infrastructure/`; the domain may not import it (CON-003). The
// route composes the addresses from `pagePath` + `absoluteUrl` and hands them
// down, exactly as every page's metadata already does.
//
// **The labels arrive resolved too.** They come from `messages/{pt,en}.json`
// through next-intl, which is framework glue the domain never imports. Only
// scaffolding is here — "Página", "Agenda", "Valor" — because everything a
// visitor reads as content comes from Payload (GUD-002) and reaches a builder as
// part of the page's own domain object.
// ---------------------------------------------------------------------------

export type TwinLabels = {
  /** "Página" · "Page" — the row holding the canonical URL. */
  page: string;
  /** "Em inglês" · "In Portuguese" — the row holding the other locale's URL. */
  alternate: string;
  /** "Índice de todas as páginas" · "Index of every page" — the /llms.txt row. */
  index: string;
  /** `chrome.credentialLabel`, reused: the same word the strip's `aria-label` uses. */
  credentials: string;
  /** `chrome.availability.label`. */
  availability: string;
  /** `chrome.footer.email`. */
  email: string;
  /** The four `pratico.*` labels, so a twin quotes the price the page quotes. */
  fee: string;
  feeAnalysis: string;
  feeCareerGuidance: string;
  feeToDiscuss: string;
};

export type TwinContext = {
  key: PageKey;
  locale: Locale;
  clinica: Clinica;
  /** Absolute canonical URL of every page, in this twin's locale. */
  pageUrls: Record<PageKey, string>;
  /**
   * Each page's nav label, for the two hand-offs whose link text lives in
   * `messages` rather than in the CMS (Início's link to /perguntas is one). Where
   * she wrote the label herself, the page's own `linkLabel` wins.
   */
  pageLabels: Record<PageKey, string>;
  /** This page's canonical URL in the other locale. */
  alternateUrl: string;
  /** Absolute URL of `/llms.txt`. */
  indexUrl: string;
  /** Absolute URL of the site root in English — /internacional's one hand-off. */
  englishHomeUrl: string;
  /** The agenda sentence, already composed from the state and the response window. */
  availabilityLine: string;
  labels: TwinLabels;
};
