import { getTranslations } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import type { Locale } from "@/domain/site/Locale";
import type { PageKey } from "@/domain/site/pages";
import { renderShareCard } from "./shareCard";

/**
 * One share card per page, filled from the registry and the clinic's own facts
 * so a route file only has to name its page.
 *
 * The home card is the identity card — her name, her role, her positioning
 * sentence — because a link to the root is a link to the practice. Every other
 * page is titled by the page and bylined by her, which is the "por" lockup doing
 * on a shared image what it does in the header.
 */
export async function pageShareCard(key: PageKey, locale: Locale) {
  const [clinica, nav, chrome, meta] = await Promise.all([
    getClinica(locale),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "chrome" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  const isHome = key === "inicio";
  const description = meta.has(`${key}.description`)
    ? meta(`${key}.description`)
    : clinica.positioning;

  return renderShareCard({
    eyebrow: clinica.clinicName,
    title: isHome ? clinica.fullName : nav(key),
    byline: isHome ? clinica.role : `${chrome("lockupBy")} ${clinica.fullName}`,
    description,
  });
}
