/**
 * The site's public origin. Every absolute URL the site emits — canonical tags,
 * hreflang, OpenGraph, the sitemap, JSON-LD, llms.txt — is built from here, so
 * the origin is decided in exactly one place: `NEXT_PUBLIC_BASE_URL`, which is
 * `https://simbolosdoself.com` in production. `www.` never reaches the app: the
 * Vercel domain configuration answers it with a 301 to the apex.
 *
 * Without it, a Vercel deployment falls back to its own address rather than a
 * placeholder domain: previews are `noindex` by Vercel's own header, so the
 * canonical there is harmless, but their share cards have to resolve for a
 * preview link pasted into WhatsApp to unfurl. Locally, the dev server.
 *
 * Lives in the env folder because it reads the world rather than deciding
 * anything: `src/domain/site/pagePath.ts` owns which path a page has, this owns
 * what sits in front of it. Server-only — `VERCEL_URL` is not a public variable,
 * so importing this from a client component would silently lose the fallback.
 */
const LOCAL_ORIGIN = "http://localhost:3000";

function resolveBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return LOCAL_ORIGIN;
}

const BASE_URL = resolveBaseUrl().replace(/\/+$/, "");

export { BASE_URL };

/** An absolute URL for a site-relative path (`/en/analysis` → `https://…/en/analysis`). */
export function absoluteUrl(path: string): string {
  return `${BASE_URL}${path}`;
}
