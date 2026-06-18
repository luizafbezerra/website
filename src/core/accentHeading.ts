// ---------------------------------------------------------------------------
// Accent heading — a manuscript heading where one word carries a coloured
// (optionally italic) treatment (e.g. "O que se repete costuma ter algo " +
// "a dizer" + "."). The whole heading is now a single constrained rich-text
// field (`src/fields/accentHeading.ts`): the editor types the line and marks
// the accent word in bold ("destaque"); the renderer applies the section's
// LOCKED colour + italic to the bold run, so the typography brief can't be
// broken from the admin. Pure (returns class strings + a fixed lookup).
// ---------------------------------------------------------------------------

export type AccentStyle = "terracotta" | "cobalt";

/** The locked visual treatment applied to a section's accent (destaque) word. */
export type AccentTreatment = { accentStyle: AccentStyle; accentItalic: boolean };

const ACCENT_CLASS: Record<AccentStyle, string> = {
  terracotta: "text-terracotta-deep",
  cobalt: "text-cobalt",
};

/** Locked colour (+ optional italic) class for an accent word. */
export function accentWordClass(treatment: AccentTreatment): string {
  const colour = ACCENT_CLASS[treatment.accentStyle];
  return treatment.accentItalic ? `display-italic ${colour}` : colour;
}

/**
 * Per-section accent treatment, fixed in code. The CMS only decides WHICH word
 * is the accent (bold in the constrained heading editor); the colour + italic
 * live here so they always match the brief regardless of who edits the copy.
 */
export type AccentSection = "pillars" | "about" | "writing" | "contact";

export const SECTION_ACCENT: Record<AccentSection, AccentTreatment> = {
  pillars: { accentStyle: "terracotta", accentItalic: true },
  about: { accentStyle: "cobalt", accentItalic: false },
  writing: { accentStyle: "terracotta", accentItalic: false },
  contact: { accentStyle: "terracotta", accentItalic: true },
};
