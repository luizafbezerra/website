import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import type { PageKey } from "@/domain/site/pages";

/**
 * One global per page (REQ-003): the sidebar group "Páginas" lists the eight
 * addresses of CONCEPT §6 in map order, and each global's tabs are that page's
 * own sections. Cross-page facts are not repeated here — they live once in
 * "A Clínica" — so every field in this folder answers "which page am I editing?".
 *
 * The tabs are NAMED, so each section owns a data path (`hero.lead`,
 * `pratico.body`): the domain mapper reads one section at a time and two
 * sections can both have a `heading` without colliding.
 */
export const PAGES_GROUP = "Páginas";

export const pageAccess: GlobalConfig["access"] = {
  read: () => true,
  update: ({ req }) => req.user?.role === "admin",
};

/**
 * Revalidate a page's own routes — both locales, since one edit changes the
 * Portuguese page and (through Payload's locale fallback) the English mirror.
 * Skipped during seed, which writes outside a Next request where
 * `revalidatePath` throws.
 */
export function revalidatePageHook(
  key: PageKey,
): NonNullable<GlobalConfig["hooks"]>["afterChange"] {
  return [
    ({ context }) => {
      if (context?.skipRevalidate) return;
      for (const locale of SITE_LOCALES) revalidatePath(pagePath(key, locale));
    },
  ];
}
