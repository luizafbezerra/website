import type { Locale } from "@/domain/site/Locale";
import type { InEnglishSection } from "./Internacional";

/**
 * The In-English section, or nothing — because the section is a **Portuguese-page
 * affordance**, not a section of the page in every language.
 *
 * CONCEPT §6 puts one short English block on `/internacional` so that an anglophone
 * who lands on the Portuguese page finds, in their own language, that she works in
 * English and where the English site is. Its fields are deliberately not localized:
 * it is written in English once.
 *
 * On `/en/international` the whole page is already English. The block would say,
 * in three lines, what the reader has just read in five sections, and its link
 * would point at the site they are already reading. So it is dropped there, and
 * the English page's fifth section is `Começar` reached one scroll earlier.
 *
 * This is the same shape of rule as `noteOpenersFor` in A Clínica, which drops the
 * English bilhete opener on `/en` for exactly the same reason — the redundancy is a
 * fact about the content, so it is a tested rule rather than a conditional inside a
 * component. `plan/feature-page-primeira-conversa-1.md` predicted this page would
 * need it.
 *
 * It reads the locale and nothing about the visitor (SEC-001): both locales are
 * prerendered, and which one a reader gets is decided by the URL they are on.
 */
export function inEnglishSectionFor(
  section: InEnglishSection,
  locale: Locale,
): InEnglishSection | null {
  return locale === "en" ? null : section;
}
