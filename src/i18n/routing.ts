import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, SITE_LOCALES } from "@/domain/site/Locale";
import { SITE_PAGES } from "@/domain/site/pages";

/**
 * Framework glue: next-intl's routing configuration, derived entirely from the
 * canonical page registry so there is one place a URL is decided.
 *
 * `src/i18n/` is an adapter layer, like `src/infrastructure/` — it imports
 * downward from `src/domain/` and nothing imports it from below.
 */

/**
 * Internal pathname → the external pathname per locale. The pt path doubles as
 * the internal one because pt is the default locale and the route folders are
 * named in Portuguese, so `/en/analysis` rewrites onto `/en/analise`.
 *
 * Pages CONCEPT has mapped but Phase 6 has not built yet are included on
 * purpose: their addresses are part of the URL contract from day one, and a
 * missing route simply 404s until its page lands.
 */
const pathnames = Object.fromEntries(SITE_PAGES.map((page) => [page.paths.pt, page.paths])) as {
  [Path in (typeof SITE_PAGES)[number]["paths"]["pt"]]: Record<
    (typeof SITE_LOCALES)[number],
    string
  >;
};

export const routing = defineRouting({
  locales: SITE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // pt-BR is canonical and lives unprefixed at the root; English mirrors the
  // tree under /en (REQ-002).
  localePrefix: "as-needed",
  pathnames,
  // The visitor's only cookie (SEC-001). Named and configured here rather than
  // left to defaults so /privacidade can describe it honestly: a language
  // preference, readable by the browser, no identifier, one year.
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
  // hreflang is emitted as page metadata (TASK-021) instead of as middleware
  // `Link` headers, so the tags carry our BCP-47 codes (pt-BR, not pt) and there
  // is exactly one source of alternates per page.
  alternateLinks: false,
});
