import { type Locale, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { builtPages, type PageKey, sitePage } from "@/domain/site/pages";

// ---------------------------------------------------------------------------
// Where a page's Markdown twin lives (REQ-011, CONCEPT §10).
//
// **The address.** `/llms` + the page's own locale path + `.md`:
//
//     /                  →  /llms/index.md
//     /analise           →  /llms/analise.md
//     /en                →  /llms/en/index.md
//     /en/analysis       →  /llms/en/analysis.md
//
// So the mirror is the site's own URL map, one segment deeper, and it is derived
// from `pagePath` rather than written down a second time: the locale-prefix rule
// (`localePrefix: 'as-needed'`) stays in the one module that owns it. The `/llms`
// prefix pairs the mirror with `/llms.txt`, which indexes it.
//
// **Why not `/analise.md`, which is the llms.txt convention.** Two structural
// reasons, both about the route tree rather than about taste:
//
//   1. A single-segment dotted path lands on `[locale]`. `src/middleware.ts`
//      excludes any path containing a dot, so `/analise.md` reaches the router
//      unrewritten, where `[locale]/(pages)/page.tsx` matches it with
//      `locale = "analise.md"` — the same collision that makes `/favicon.ico`
//      fail today (TASK-046). A dynamic segment beats a catch-all, so no
//      catch-all can rescue those addresses; only sixteen static route folders
//      could, which would hand-write the registry's slugs a second time and let a
//      twin quietly survive a slug change.
//   2. The home page has no `.md` form. `/` + `.md` is `/.md`, so the convention
//      needs an `index` special case anyway — and once one address is not
//      mechanical, the pattern's only advantage over a named mirror is gone.
//
// A dot in the path is still what keeps these addresses out of the middleware, so
// every twin resolves in one request with no locale negotiation and no redirect —
// which is the whole point for a client that does not carry cookies.
// ---------------------------------------------------------------------------

/** The mirror's root segment. `/llms.txt` is its index. */
export const TWIN_PREFIX = "/llms";

/** The machine-readable index of the whole site — the twins' table of contents. */
export const MACHINE_INDEX_PATH = "/llms.txt";

/** The extension every twin carries, and the reason middleware never sees one. */
export const TWIN_EXTENSION = ".md";

/** The filename a page with no slug of its own takes (`/` and `/en`). */
const TWIN_INDEX = "index";

export function twinPath(key: PageKey, locale: Locale): string {
  const path = pagePath(key, locale);
  // The home page's locale path is the locale root itself, so it contributes no
  // filename and takes `index` instead.
  const isHome = sitePage(key).paths[locale] === "/";
  const base = path === "/" ? "" : path;

  return `${TWIN_PREFIX}${base}${isHome ? `/${TWIN_INDEX}` : ""}${TWIN_EXTENSION}`;
}

/** Every (page, locale) pair with a twin — what the route prerenders and the index lists. */
export function twinEntries(): Array<{ key: PageKey; locale: Locale; path: string }> {
  return builtPages().flatMap((page) =>
    SITE_LOCALES.map((locale) => ({
      key: page.key,
      locale,
      path: twinPath(page.key, locale),
    })),
  );
}

/**
 * Which twin a request is asking for, from the catch-all's segments — or `null`.
 *
 * Resolved by matching the whole address against the registry rather than by
 * parsing it, so the reverse direction cannot drift from `twinPath`: there is one
 * rule, and this asks it sixteen questions.
 */
export function twinFromSegments(segments: readonly string[]): {
  key: PageKey;
  locale: Locale;
} | null {
  const path = `${TWIN_PREFIX}/${segments.join("/")}`;
  const match = twinEntries().find((entry) => entry.path === path);

  return match ? { key: match.key, locale: match.locale } : null;
}
