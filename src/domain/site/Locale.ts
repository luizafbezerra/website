/**
 * The two languages the site ships in (REQ-002). pt-BR is canonical and lives at
 * the root; English mirrors the whole tree under `/en`.
 *
 * These short codes are the app's own vocabulary — they name the locale segment,
 * the Payload content locale, and the message files. `LOCALE_TAGS` holds the
 * BCP-47 form for the places that need a real language tag (`<html lang>`,
 * hreflang, JSON-LD `inLanguage`).
 */
export const SITE_LOCALES = ["pt", "en"] as const;

export type Locale = (typeof SITE_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return SITE_LOCALES.includes(value as Locale);
}

/**
 * BCP-47 tags. Portuguese is pinned to Brazil because the practice is Brazilian
 * and the register is pt-BR; English is left unregionalised on purpose — the
 * audience is anglophones anywhere, not the US or the UK specifically.
 */
export const LOCALE_TAGS: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** The other locale — what the header's PT·EN toggle switches to. */
export function otherLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}
