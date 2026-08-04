import { getHome } from "@/domain/home/getHome";
import type { NavLink } from "./NavLink";
import { navigationFrom } from "./navigationFrom";

/**
 * Navigation derived from the enabled, anchored sections plus the editable
 * off-page links. Used by the header, footer, and mobile nav across all pages.
 */
export async function getNavigation(): Promise<NavLink[]> {
  const home = await getHome();
  return navigationFrom(home.sections, home.navExtraLinks);
}
