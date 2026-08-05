import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE, type Locale, LOCALE_TAGS, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePathsByLocale } from "@/domain/site/pagePath";
import { type PageKey, sitePage } from "@/domain/site/pages";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";

/**
 * The one place a page's title, canonical URL, and hreflang set are assembled
 * (TASK-021). Pages call this instead of hand-writing `alternates`, so the pt and
 * en variants of every page always point at each other.
 *
 * Titles and descriptions come from `messages/{pt,en}.json` under `meta.<key>`;
 * the registry decides whether the title is absolute or gets the
 * `· Símbolos do Self` suffix from the layout's template (REQ-011).
 */

/** OpenGraph wants underscored territory codes, not the BCP-47 tags. */
const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export async function pageMetadata(key: PageKey, locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${key}` });
  const paths = pagePathsByLocale(key);
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(paths[locale]);

  return {
    // The home page carries the positioning sentence and her name, so it owns its
    // whole title rather than inheriting the layout's suffix template.
    title: sitePage(key).titlePattern === "standalone" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SITE_LOCALES.map((alternate) => [LOCALE_TAGS[alternate], absoluteUrl(paths[alternate])]),
        ),
        // x-default points at the canonical pt address because that address is
        // also the one that negotiates: an English browser landing there is
        // redirected to /en by the middleware.
        "x-default": absoluteUrl(paths[DEFAULT_LOCALE]),
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: SITE_LOCALES.filter((alternate) => alternate !== locale).map(
        (alternate) => OPEN_GRAPH_LOCALES[alternate],
      ),
    },
  };
}
