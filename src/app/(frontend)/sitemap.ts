import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

/**
 * Hand-listed while the site is one page plus the FAQ. Phase 3 replaces this
 * with a derivation from the canonical page registry (`src/domain/site/pages.ts`)
 * × locales, so nav, hreflang, and the sitemap can never disagree.
 */
const ROUTES: Omit<MetadataRoute.Sitemap[number], "lastModified">[] = [
  { url: `${BASE_URL}/`, changeFrequency: "yearly", priority: 1.0 },
  { url: `${BASE_URL}/perguntas`, changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({ ...route, lastModified }));
}
