import { type AccentHeading as AccentHeadingContent, accentWordClass } from "@/core/accentHeading";

/**
 * Renders the inline content of an accent heading (lead + coloured/italic
 * accent word + trail). Place inside the section's own <h1>/<h2> so each
 * section keeps its heading element and sizing classes.
 */
export function AccentHeading({ heading }: { heading: AccentHeadingContent }) {
  return (
    <>
      {heading.lead}
      <span className={accentWordClass(heading)}>{heading.accentWord}</span>
      {heading.trail}
    </>
  );
}
