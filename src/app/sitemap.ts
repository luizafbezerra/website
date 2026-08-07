import type { MetadataRoute } from "next";
import { LOCALE_TAGS, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePathEntries, pagePathsByLocale } from "@/domain/site/pagePath";
import { builtPages } from "@/domain/site/pages";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";

export const revalidate = 3600;

/**
 * Derived from the canonical page registry × locales (TASK-021), so the sitemap
 * cannot disagree with the nav or the hreflang tags. Only pages whose route
 * exists are listed — the registry knows the addresses of the CONCEPT pages Phase
 * 6 has yet to build, and advertising those would be advertising 404s.
 *
 * Each entry also carries its locale alternates, which is how a crawler learns
 * that the pt and en variants are the same page.
 *
 * Lives at the true app root rather than inside `(frontend)`: sitemap and robots
 * are locale-independent, so keeping them outside `[locale]` means the middleware
 * never has to rewrite them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pagePathEntries(builtPages()).map(({ page, path }) => {
    const paths = pagePathsByLocale(page.key);

    return {
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.sitemapPriority,
      alternates: {
        languages: Object.fromEntries(
          SITE_LOCALES.map((locale) => [LOCALE_TAGS[locale], absoluteUrl(paths[locale])]),
        ),
      },
    };
  });
}
