import {
  type SectionConfig,
  type SectionMeta,
  SECTION_REGISTRY,
} from "@/domain/sections/sectionRegistry";
import type { NavLink } from "./NavLink";

/**
 * Build the navigation from the enabled, anchored sections (in section order)
 * plus the editable off-page links. Because anchors come from the live section
 * list, nav can never point at a disabled or removed section.
 */
export function navigationFrom(sections: SectionConfig[], extraLinks: NavLink[]): NavLink[] {
  const anchors: NavLink[] = sections
    .filter((section) => section.enabled)
    .map((section) => SECTION_REGISTRY[section.type])
    .filter((meta): meta is Required<SectionMeta> => Boolean(meta.anchorId && meta.navLabel))
    .map((meta) => ({ label: meta.navLabel, href: `/#${meta.anchorId}` }));

  return [...anchors, ...extraLinks];
}
