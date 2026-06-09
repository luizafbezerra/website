import { getHasPublishedPosts } from "@/app/actions/blog";
import { type Home, HOME_DEFAULTS, homeFromPayload, type PayloadHome } from "@/core/home";
import { navigationFrom, type NavLink } from "@/core/navigation";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * Homepage structure (section order + toggles + nav links) from the Payload
 * `home` global, with a graceful fall back to `HOME_DEFAULTS` (same degradation
 * model as `getIdentity`).
 */
export const getHome = cache(async function getHome(): Promise<Home> {
  const payload = await getPayloadSafe();
  if (!payload) return HOME_DEFAULTS;

  const home = await payload.findGlobal({ slug: "home", depth: 0, overrideAccess: true });
  return homeFromPayload(home as PayloadHome);
});

/**
 * Navigation derived from the enabled, anchored sections plus the editable
 * off-page links. Used by the header, footer, and mobile nav across all pages.
 *
 * The `/blog` link is dropped when there are no published posts, so nothing
 * advertises the blog while it is empty (it stays reachable directly).
 */
export const getNavigation = cache(async function getNavigation(): Promise<NavLink[]> {
  const [home, hasPosts] = await Promise.all([getHome(), getHasPublishedPosts()]);
  const extraLinks = hasPosts
    ? home.navExtraLinks
    : home.navExtraLinks.filter((l) => !l.href.startsWith("/blog"));
  return navigationFrom(home.sections, extraLinks);
});
