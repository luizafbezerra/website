// ---------------------------------------------------------------------------
// Accent heading — a manuscript heading split into lead + coloured/italic
// accent word + trail (e.g. "O que se repete costuma ter algo " · "a dizer" ·
// "."). The CMS field (`src/fields/accentHeading.ts`) constrains the colour to
// a select; this maps that choice to a locked Tailwind class so the typography
// brief can't be broken from the admin. Pure (returns class strings).
// ---------------------------------------------------------------------------

export type AccentStyle = "terracotta" | "cobalt";

export type AccentHeading = {
  lead: string;
  accentWord: string;
  trail: string;
  accentStyle: AccentStyle;
  accentItalic: boolean;
};

const ACCENT_CLASS: Record<AccentStyle, string> = {
  terracotta: "text-terracotta-deep",
  cobalt: "text-cobalt",
};

/** Locked colour (+ optional italic) class for an accent word. */
export function accentWordClass(
  heading: Pick<AccentHeading, "accentStyle" | "accentItalic">,
): string {
  const colour = ACCENT_CLASS[heading.accentStyle];
  return heading.accentItalic ? `display-italic ${colour}` : colour;
}

export type PayloadAccentHeading = {
  lead?: string | null;
  accentWord?: string | null;
  trail?: string | null;
  accentStyle?: string | null;
  accentItalic?: boolean | null;
};

export function accentHeadingFromPayload(
  raw: PayloadAccentHeading | null | undefined,
  fallback: AccentHeading,
): AccentHeading {
  if (!raw) return fallback;
  const accentStyle: AccentStyle = raw.accentStyle === "cobalt" ? "cobalt" : "terracotta";
  return {
    lead: raw.lead ?? fallback.lead,
    accentWord: raw.accentWord ?? fallback.accentWord,
    trail: raw.trail ?? fallback.trail,
    accentStyle: raw.accentStyle == null ? fallback.accentStyle : accentStyle,
    accentItalic: raw.accentItalic ?? fallback.accentItalic,
  };
}
