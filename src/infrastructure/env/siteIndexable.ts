/**
 * Master launch switch for discoverability.
 *
 * While unset or not exactly "true" the site stays dark: `robots.txt` disallows
 * every crawler and every page carries `noindex`. Flipping
 * `NEXT_PUBLIC_SITE_INDEXABLE=true` (one env var on Vercel) at real release
 * opens the AI-agent allowlist + general crawl in `robots.ts` and drops the
 * global `noindex` in the root layout — launch is a single config change.
 *
 * Pre-launch content (placeholder CRP, portrait, unreviewed testimonials) must
 * never be indexed before this flips. Public env var → inlined at build, so
 * both branches are compiled and the flip takes effect on the next deploy.
 */
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
