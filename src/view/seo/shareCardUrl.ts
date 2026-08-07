import type { Locale } from "@/domain/site/Locale";
import type { PageKey } from "@/domain/site/pages";

/**
 * Where a page's share card lives.
 *
 * The card is served from its own route rather than through Next's
 * `opengraph-image` file convention, and the reason is `localePrefix:
 * 'as-needed'` with translated slugs: the physical route tree is Portuguese and
 * prefixed (`/pt/perguntas`, `/en/privacidade`), so the convention emits image
 * URLs at addresses that only resolve after a middleware redirect. The share
 * card is the one asset that must not depend on a scraper following redirects —
 * it renders on every WhatsApp share of her link, including the announcement to
 * the account. This route is the real, canonical address in both locales.
 *
 * `src/app/share-card/[locale]/[key]/route.tsx` implements it, and the
 * middleware matcher excludes the prefix so no rewriting touches it.
 */
export const SHARE_CARD_PREFIX = "/share-card";

/** The dimensions every platform previews at. Declared here so page metadata can
 * state them without importing the renderer, which pulls in `next/og`. */
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

export function shareCardPath(key: PageKey, locale: Locale): string {
  return `${SHARE_CARD_PREFIX}/${locale}/${key}`;
}
