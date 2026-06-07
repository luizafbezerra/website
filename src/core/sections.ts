// ---------------------------------------------------------------------------
// Homepage section registry — the fixed set of body sections that can be
// reordered/toggled from the CMS, plus the metadata navigation derives from.
//
// Header/Hero are pinned at the top and Footer at the bottom in the page
// layout; only these body sections are orderable. Pure TS — no React. The
// type → component map lives in `ui/` (components can't be imported here).
// ---------------------------------------------------------------------------

export type SectionType = "pillars" | "about" | "cosmos" | "voices" | "writing" | "contact";

export const SECTION_TYPES: readonly SectionType[] = [
  "pillars",
  "about",
  "cosmos",
  "voices",
  "writing",
  "contact",
];

export type SectionMeta = {
  /** Anchor id the section renders, when it participates in in-page nav. */
  anchorId?: string;
  /** Label shown in the derived navigation, when anchored. */
  navLabel?: string;
};

export const SECTION_REGISTRY: Record<SectionType, SectionMeta> = {
  pillars: { anchorId: "abordagem", navLabel: "Como trabalho" },
  about: { anchorId: "sobre", navLabel: "Sobre" },
  cosmos: {},
  voices: {},
  writing: {},
  contact: { anchorId: "contato", navLabel: "Contato" },
};

export type SectionConfig = { type: SectionType; enabled: boolean };

/** Current homepage order, all enabled — the fallback when Payload is off. */
export const SECTIONS_DEFAULT: SectionConfig[] = SECTION_TYPES.map((type) => ({
  type,
  enabled: true,
}));

export function isSectionType(value: unknown): value is SectionType {
  return typeof value === "string" && (SECTION_TYPES as readonly string[]).includes(value);
}
