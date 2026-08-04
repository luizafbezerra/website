export type NavLink = {
  label: string;
  href: string;
};

/**
 * Off-page links appended after the auto-derived in-page anchors. Empty since
 * the blog was removed — the site is single-page until Phase 6 adds the eight
 * CONCEPT pages, which come from the page registry rather than from here.
 */
export const NAV_EXTRA_LINKS_DEFAULT: NavLink[] = [];
