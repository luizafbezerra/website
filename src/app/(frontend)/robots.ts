import type { MetadataRoute } from "next";

// Pre-launch: site contains placeholder content (CRP credential, portrait, bio,
// testimonials). Block every crawler — search engines and AI agents alike — so
// nothing indexes before real content lands. Flip back to the AI-agent allowlist
// once the production-readiness pass closes (see CLAUDE.md → Discoverability).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
