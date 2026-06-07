import { type SectionConfig, type SectionMeta, SECTION_REGISTRY } from "./sections";

export type NavLink = {
  label: string;
  href: string;
};

/** Off-page links appended after the auto-derived in-page anchors. */
export const NAV_EXTRA_LINKS_DEFAULT: NavLink[] = [{ label: "Escrita", href: "/blog" }];

/**
 * Build the navigation from the enabled, anchored sections (in section order)
 * plus the editable off-page links. Because anchors come from the live section
 * list, nav can never point at a disabled or removed section.
 */
export function navigationFrom(sections: SectionConfig[], extraLinks: NavLink[]): NavLink[] {
  const anchors: NavLink[] = sections
    .filter((s) => s.enabled)
    .map((s) => SECTION_REGISTRY[s.type])
    .filter((meta): meta is Required<SectionMeta> => Boolean(meta.anchorId && meta.navLabel))
    .map((meta) => ({ label: meta.navLabel, href: `/#${meta.anchorId}` }));

  return [...anchors, ...extraLinks];
}
