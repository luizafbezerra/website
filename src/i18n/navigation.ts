import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware wrappers around Next's navigation APIs. `Link` takes an internal
 * (pt) pathname and renders the visitor's locale variant; `usePathname` returns
 * the internal pathname, which is what lets the PT·EN toggle switch language
 * without leaving the current page.
 *
 * Machine-facing absolute URLs — canonical, hreflang, sitemap, JSON-LD — are
 * built from `src/domain/site/pagePath.ts` instead. Both read the same registry.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
