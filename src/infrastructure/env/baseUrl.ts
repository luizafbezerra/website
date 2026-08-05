/**
 * The site's public origin. Every absolute URL the site emits — canonical tags,
 * hreflang, OpenGraph, the sitemap, JSON-LD, llms.txt — is built from here, so
 * moving to simbolosdoself.com.br is one env var (ASSUMPTION-003).
 *
 * Lives in the env folder because it reads the world rather than deciding
 * anything: `src/domain/site/pagePath.ts` owns which path a page has, this owns
 * what sits in front of it.
 */
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com").replace(/\/+$/, "");

export { BASE_URL };

/** An absolute URL for a site-relative path (`/en/analysis` → `https://…/en/analysis`). */
export function absoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}
