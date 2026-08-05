import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * The blog and the standalone `/simbolos` page were removed with the CONCEPT v3
 * rebuild. Nothing is live yet (ASSUMPTION-001), so these cover the handful of
 * links that may already have been shared rather than any SEO equity —
 * permanent so crawlers and agents stop asking. `/simbolos` points at the page
 * that inherits the painted wheel; `/analise` itself is built in Phase 6.
 */
const REMOVED_PAGE_REDIRECTS = [
  { source: "/blog/:path*", destination: "/", permanent: true },
  { source: "/simbolos", destination: "/analise", permanent: true },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async redirects() {
    return REMOVED_PAGE_REDIRECTS;
  },
};

// Nested inner-to-outer: next-intl registers its Turbopack `resolveAlias` first,
// and withPayload spreads the incoming `turbopack` block through rather than
// replacing it, so both plugins' aliases survive.
// @ts-ignore
export default withPayload(withNextIntl(nextConfig));
