import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/domain/site/Locale";
import { routing } from "./routing";

/**
 * Per-request i18n configuration: which locale this render is for, and the chrome
 * strings that go with it.
 *
 * Only chrome copy lives in `messages/` — nav labels, the toggle, skip links,
 * footer column titles, placeholder captions, the error pages. Everything a
 * visitor reads as content comes from Payload (GUD-002).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Normally the `[locale]` segment; falls back for requests the middleware did
  // not annotate (metadata routes, for instance).
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Every time the site states is anchored to Brasília (CONCEPT §6 logística),
    // including for visitors abroad — so formatting must never follow the server.
    timeZone: "America/Sao_Paulo",
  };
});
