import { isLocale, SITE_LOCALES } from "@/domain/site/Locale";
import { builtPages, isPageKey } from "@/domain/site/pages";
import { pageShareCard } from "@/view/seo/pageShareCard";

/**
 * The social share cards, one per built page per locale (TASK-033). See
 * `src/view/seo/shareCardUrl.ts` for why these are a route rather than Next's
 * `opengraph-image` convention.
 */

export const runtime = "nodejs";

export function generateStaticParams() {
  return builtPages().flatMap((page) => SITE_LOCALES.map((locale) => ({ locale, key: page.key })));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; key: string }> },
) {
  const { locale, key } = await params;
  if (!isLocale(locale) || !isPageKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  return pageShareCard(key, locale);
}
