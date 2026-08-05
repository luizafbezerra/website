import type { Locale } from "./Locale";

/**
 * The canonical page registry (REQ-001). Every navigation surface — header,
 * footer, sitemap, hreflang, llms.txt, the Markdown twins — derives from this
 * one list, so they can never disagree about which pages exist or where they
 * live.
 *
 * The paths are the site's own URL contract, locked from day one: CONCEPT §6
 * promises that no URL migrates between phases, which is why pages that have no
 * route yet still appear here with their final addresses. `status` records which
 * of them are actually built, so the sitemap advertises reality while the URL
 * map stays complete.
 *
 * This lives in the domain layer rather than beside the routes because the
 * registry is a fact about the product, not about Next.js: it is read by the
 * routing config, the metadata helpers, the SEO payloads, and the machine-facing
 * text files alike. It holds no visitor-facing copy — labels and titles are
 * keyed by `key` in `messages/{pt,en}.json`.
 */

/** In CONCEPT §6 map order. Admin sidebar and nav derivation follow this order. */
export const PAGE_KEYS = [
  "inicio",
  "analise",
  "orientacaoProfissional",
  "sobre",
  "primeiraConversa",
  "perguntas",
  "internacional",
  "privacidade",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export function isPageKey(value: string): value is PageKey {
  return (PAGE_KEYS as readonly string[]).includes(value);
}

/** The footer's three columns, in render order (CONCEPT §6 FOOTER). */
export const FOOTER_COLUMNS = ["clinica", "comecar", "mundo"] as const;

export type FooterColumn = (typeof FOOTER_COLUMNS)[number];

/**
 * `standalone` pages own their whole `<title>`; `suffixed` ones render as
 * `<página> · Símbolos do Self` (REQ-011). Only the home page is standalone —
 * its title carries the positioning sentence and her name.
 */
export type TitlePattern = "standalone" | "suffixed";

/** Whether a route exists yet. Flipped to `built` by the page's Phase 6 task. */
export type PageStatus = "built" | "planned";

/** Mirrors the sitemap protocol's vocabulary without importing Next's types. */
export type ChangeFrequency = "yearly" | "monthly" | "weekly";

export type SitePage = {
  key: PageKey;
  /**
   * Locale-relative path, leading slash, no locale prefix — `/analise` for pt,
   * `/analysis` for en. `pagePath` adds the prefix; `src/i18n/routing.ts` feeds
   * the same pairs to next-intl as its `pathnames` map.
   */
  paths: Record<Locale, string>;
  /** In the header's four-item nav (CONCEPT §6 HEADER). */
  inHeaderNav: boolean;
  /** Which footer column lists it, or null for pages the footer omits. */
  footerColumn: FooterColumn | null;
  titlePattern: TitlePattern;
  status: PageStatus;
  sitemapPriority: number;
  changeFrequency: ChangeFrequency;
};

/**
 * `as const satisfies` rather than a plain annotation: the const assertion keeps
 * the pt paths as string literals, which is what gives next-intl's `Link` a typed
 * set of hrefs (see `SitePathname`), while `satisfies` still checks every entry
 * against `SitePage`.
 */
export const SITE_PAGES = [
  {
    key: "inicio",
    paths: { pt: "/", en: "/" },
    // The mark-and-lockup on the left is the link home; a nav item would repeat it.
    inHeaderNav: false,
    footerColumn: "clinica",
    titlePattern: "standalone",
    status: "built",
    sitemapPriority: 1.0,
    changeFrequency: "yearly",
  },
  {
    key: "analise",
    paths: { pt: "/analise", en: "/analysis" },
    inHeaderNav: true,
    footerColumn: "clinica",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.9,
    changeFrequency: "yearly",
  },
  {
    key: "orientacaoProfissional",
    paths: { pt: "/orientacao-profissional", en: "/career-guidance" },
    inHeaderNav: true,
    footerColumn: "clinica",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.9,
    changeFrequency: "yearly",
  },
  {
    key: "sobre",
    paths: { pt: "/sobre", en: "/about" },
    inHeaderNav: true,
    footerColumn: "clinica",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.8,
    changeFrequency: "yearly",
  },
  {
    key: "primeiraConversa",
    paths: { pt: "/primeira-conversa", en: "/first-conversation" },
    inHeaderNav: true,
    footerColumn: "comecar",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.9,
    changeFrequency: "yearly",
  },
  {
    key: "perguntas",
    // Header omits it on purpose: it belongs where the doubt occurs, plus the
    // footer. The FAQ is answered content, so it changes most often.
    paths: { pt: "/perguntas", en: "/questions" },
    inHeaderNav: false,
    footerColumn: "comecar",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.6,
    changeFrequency: "monthly",
  },
  {
    key: "internacional",
    paths: { pt: "/internacional", en: "/international" },
    inHeaderNav: false,
    footerColumn: "comecar",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.7,
    changeFrequency: "yearly",
  },
  {
    key: "privacidade",
    paths: { pt: "/privacidade", en: "/privacy" },
    inHeaderNav: false,
    footerColumn: "mundo",
    titlePattern: "suffixed",
    status: "built",
    sitemapPriority: 0.2,
    changeFrequency: "yearly",
  },
] as const satisfies readonly SitePage[];

/**
 * The internal pathnames next-intl routes on — the pt paths, which are also the
 * `src/app/(frontend)/[locale]/…` folder names. English addresses rewrite onto
 * these.
 */
export type SitePathname = (typeof SITE_PAGES)[number]["paths"]["pt"];

export function sitePage(key: PageKey): SitePage {
  const page = SITE_PAGES.find((candidate) => candidate.key === key);
  if (!page) throw new Error(`Unknown site page: ${key}`);

  return page;
}

/**
 * The three selectors below deliberately carry no return annotation: inferring
 * from the `as const` tuple keeps each entry's `paths.pt` a string literal, and
 * that literal union is what lets next-intl's `Link` type-check an href built
 * from the registry. Annotating them `SitePage[]` would widen `paths.pt` to
 * `string` and the chrome would need a cast at every call site.
 */

/** Header nav items, in map order. */
export function headerNavPages() {
  return SITE_PAGES.filter((page) => page.inHeaderNav);
}

/** The pages a footer column lists, in map order. */
export function footerColumnPages(column: FooterColumn) {
  return SITE_PAGES.filter((page) => page.footerColumn === column);
}

/** Pages with a live route — what the sitemap and llms.txt may advertise. */
export function builtPages() {
  return SITE_PAGES.filter((page) => page.status === "built");
}
