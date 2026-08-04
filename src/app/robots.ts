import type { MetadataRoute } from "next";
import { SITE_INDEXABLE } from "@/infrastructure/env/siteIndexable";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

// Lives at the true app root (not inside the (frontend) route group): Next 16 +
// Turbopack does not register a `robots.ts` placed inside a route group as the
// /robots.txt metadata route (it 404s in dev), whereas `sitemap.ts` is picked
// up either way. Since robots.txt is the launch gate itself, it must be served
// reliably in every environment.

// AI agents + general search engines we explicitly welcome once the site goes
// live. The list reads as documentation of who we want crawling for SEO + AEO
// (see CLAUDE.md → Discoverability); the trailing `*: allow` already covers
// every other agent, so naming these is about intent, not gatekeeping.
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

// Pre-launch: the site still carries placeholder content (CRP credential,
// portrait, bio, testimonials). Until NEXT_PUBLIC_SITE_INDEXABLE flips, block
// every crawler — search engines and AI agents alike — so nothing indexes
// before real content lands. At launch the flag opens the allowlist below.
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      ...ALLOWED_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
