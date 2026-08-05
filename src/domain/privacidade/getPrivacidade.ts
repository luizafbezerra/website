import { getPagePrivacidadeGlobal as infraGetPagePrivacidadeGlobal } from "@/infrastructure/payload/getPagePrivacidadeGlobal";
import type { Locale } from "@/domain/site/Locale";
import { PRIVACIDADE_DEFAULTS, type Privacidade } from "./Privacidade";
import { privacidadeFromPayload } from "./privacidadeFromPayload";

/**
 * The privacy page's own copy. This is the single read path for the
 * `page-privacidade` global; her name, her role, the CRP and the email come from
 * `getClinica` instead, so the page never restates a cross-page fact.
 *
 * Falls back to `PRIVACIDADE_DEFAULTS[locale]` when Payload is off and when the
 * read fails. That matters more here than on any other page: an error screen where
 * a privacy statement should be reads as a site that has something to hide, and
 * the written page is true whether or not a database answers.
 */
export async function getPrivacidade(locale: Locale): Promise<Privacidade> {
  try {
    const doc = await infraGetPagePrivacidadeGlobal(locale);
    if (!doc) return PRIVACIDADE_DEFAULTS[locale];

    return privacidadeFromPayload(doc, locale);
  } catch (error) {
    console.error("[privacidade] global read failed, falling back to defaults:", error);
    return PRIVACIDADE_DEFAULTS[locale];
  }
}
