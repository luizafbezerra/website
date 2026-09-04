import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";

// Lives at the true app root (not inside the (frontend) route group): Next 16 +
// Turbopack does not register a `robots.ts` placed inside a route group as the
// /robots.txt metadata route (it 404s in dev), whereas `sitemap.ts` is picked
// up either way.

// AI agents + general search engines we explicitly welcome. The list reads as
// documentation of who we want crawling for SEO + AEO (see CLAUDE.md →
// Discoverability); the trailing `*: allow` already covers every other agent, so
// naming these is about intent, not gatekeeping.
const ALLOWED_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot",
];

// Payload's admin and REST/GraphQL surface. The admin already answers with
// `noindex`; this keeps crawlers from spending their budget discovering that.
// Everything else — pages, share cards, the Markdown twins, llms.txt — is public.
const PRIVATE_PATHS = ["/admin", "/api/"];

/**
 * The site is open to every crawler. Pre-launch it answered `Disallow: /`
 * behind an env switch; that gate came out with the release PR, so merging to
 * `main` is what opens the site. Vercel adds `X-Robots-Tag: noindex` to preview
 * deployments on its own, which is why no switch is needed for them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE_PATHS })),
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
