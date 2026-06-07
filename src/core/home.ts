import { type NavLink, NAV_EXTRA_LINKS_DEFAULT } from "./navigation";
import { type SectionConfig, isSectionType, SECTIONS_DEFAULT } from "./sections";

// ---------------------------------------------------------------------------
// Home domain — the homepage's structure (section order + toggles) and the
// editable navigation links. Long-form section copy is added to this global in
// a later phase. Mirrors the identity pattern: loose raw type, field-by-field
// guarding, defaults fallback.
// ---------------------------------------------------------------------------

export type Home = {
  sections: SectionConfig[];
  navExtraLinks: NavLink[];
};

export const HOME_DEFAULTS: Home = {
  sections: SECTIONS_DEFAULT,
  navExtraLinks: NAV_EXTRA_LINKS_DEFAULT,
};

export type PayloadHome = {
  sections?: Array<{ type?: string | null; enabled?: boolean | null }> | null;
  navExtraLinks?: Array<{ label?: string | null; href?: string | null }> | null;
};

export function homeFromPayload(doc: PayloadHome): Home {
  const rawSections = Array.isArray(doc.sections) ? doc.sections : [];
  const sections: SectionConfig[] = rawSections
    .filter((s) => isSectionType(s?.type))
    .map((s) => ({ type: s.type as SectionConfig["type"], enabled: s.enabled ?? true }));

  // A blank/never-saved global falls back to the default order; an explicit
  // empty extra-links array is respected (editor cleared it on purpose).
  const navExtraLinks: NavLink[] =
    doc.navExtraLinks == null
      ? HOME_DEFAULTS.navExtraLinks
      : doc.navExtraLinks
          .filter((l): l is { label: string; href: string } => Boolean(l?.label && l?.href))
          .map((l) => ({ label: l.label, href: l.href }));

  return {
    sections: sections.length > 0 ? sections : HOME_DEFAULTS.sections,
    navExtraLinks,
  };
}
