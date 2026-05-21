import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home page
  entries.push({
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1.0,
  });

  entries.push({
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  entries.push({
    url: `${BASE_URL}/perguntas`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  });

  return entries;
}
