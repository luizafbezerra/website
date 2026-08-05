import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Locale negotiation and pathname rewriting (REQ-002). On a first visit with no
 * cookie, next-intl reads `Accept-Language` and redirects an English browser to
 * `/en`; the PT·EN toggle then writes `NEXT_LOCALE`, which wins over the header
 * on every later visit. Nothing about the visitor is stored server-side.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except Payload's own routes (`/admin`, `/api`, including
  // `/api/graphql`), Next and Vercel internals, and any path with a file
  // extension — which is how `robots.txt`, `sitemap.xml`, `llms.txt`, the fonts
  // and the plates stay untouched (RISK-002).
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
};
