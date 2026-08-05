import { SECTIONS_DEFAULT } from "@/domain/sections/sectionRegistry";
import { NAV_EXTRA_LINKS_DEFAULT } from "./NavLink";
import type { NavLink } from "./NavLink";
import { navigationFrom } from "./navigationFrom";

/**
 * The navigation the header, footer and mobile drawer render today: the surviving
 * home page's in-page anchors.
 *
 * It reads code defaults rather than the CMS because the global that used to
 * order those sections is gone — the eight-page map replaces it. TASK-030/031
 * rebuild this chrome from the page registry (`src/domain/site/pages.ts`), which
 * is where navigation belongs; until then this keeps the anchors and the CMS from
 * disagreeing by having only one source.
 */
export function siteNavigation(): NavLink[] {
  return navigationFrom(SECTIONS_DEFAULT, NAV_EXTRA_LINKS_DEFAULT);
}
