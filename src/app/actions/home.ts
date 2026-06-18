import { getHasPublishedPosts } from "@/app/actions/blog";
import {
  type Home,
  HOME_DEFAULTS,
  homeFromPayload,
  type PayloadHomeAbout,
  type PayloadHomeContact,
  type PayloadHomeHero,
  type PayloadHomePillars,
  type PayloadHomeStructure,
  type PayloadHomeVoices,
  type PayloadHomeWriting,
} from "@/core/home";
import { navigationFrom, type NavLink } from "@/core/navigation";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * The homepage is composed from seven small globals (structure + one per
 * section), read together and assembled into the single `Home` domain object.
 * Falls back to `HOME_DEFAULTS` when Payload is off or a global read fails
 * (e.g. pre-migration), the same graceful-degradation model as `getMandala`.
 */
export const getHome = cache(async function getHome(): Promise<Home> {
  const payload = await getPayloadSafe();
  if (!payload) return HOME_DEFAULTS;

  try {
    const [structure, hero, pillars, about, voices, writing, contact] = await Promise.all([
      payload.findGlobal({ slug: "home", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-hero", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-pillars", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-about", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-voices", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-writing", depth: 0, overrideAccess: true }),
      payload.findGlobal({ slug: "home-contact", depth: 0, overrideAccess: true }),
    ]);

    return homeFromPayload({
      structure: structure as PayloadHomeStructure,
      hero: hero as PayloadHomeHero,
      pillars: pillars as PayloadHomePillars,
      about: about as PayloadHomeAbout,
      voices: voices as PayloadHomeVoices,
      writing: writing as PayloadHomeWriting,
      contact: contact as PayloadHomeContact,
    });
  } catch (error) {
    console.error("[home] global read failed, falling back to defaults:", error);
    return HOME_DEFAULTS;
  }
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
