import { DEFAULT_LOCALE, type Locale, SITE_LOCALES } from "./Locale";
import { type PageKey, type SitePage, sitePage } from "./pages";

/**
 * Site-relative path for a page in a locale — `/analise`, `/en/analysis`, `/`,
 * `/en`.
 *
 * This is the single place the "prefix every locale except the default" rule is
 * written down (next-intl's `localePrefix: 'as-needed'`). Machine-facing URLs —
 * canonical tags, hreflang, the sitemap, JSON-LD, llms.txt, the Markdown twins —
 * are all built from here, so they cannot drift from each other. In-app
 * navigation goes through next-intl's `Link` instead, which reads the same
 * registry paths from `src/i18n/routing.ts` and applies the same rule.
 */
export function pagePath(key: PageKey, locale: Locale): string {
  return localePath(sitePage(key).paths[locale], locale);
}

/** Every locale's path for one page, for building an hreflang set. */
export function pagePathsByLocale(key: PageKey): Record<Locale, string> {
  const page = sitePage(key);

  return Object.fromEntries(
    SITE_LOCALES.map((locale) => [locale, localePath(page.paths[locale], locale)]),
  ) as Record<Locale, string>;
}

/** Every (page, locale) pair — the sitemap and llms.txt enumerate from this. */
export function pagePathEntries(
  pages: readonly SitePage[],
): Array<{ page: SitePage; locale: Locale; path: string }> {
  return pages.flatMap((page) =>
    SITE_LOCALES.map((locale) => ({
      page,
      locale,
      path: localePath(page.paths[locale], locale),
    })),
  );
}

function localePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;

  const prefix = `/${locale}`;
  return path === "/" ? prefix : `${prefix}${path}`;
}
