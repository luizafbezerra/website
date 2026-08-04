import { type AccentTreatment, accentWordClass } from "@/view/styling/accentHeading";
import { extractRuns } from "@/domain/richText/extractRuns";
import type { RichTextContent } from "@/domain/richText/RichTextContent";

/**
 * Renders the inline content of an accent heading: the editor's typed line with
 * the marked (bold) run wrapped in the section's locked accent treatment
 * (colour + optional italic). Place inside the section's own <h1>/<h2> so each
 * section keeps its heading element and sizing classes. A small inline
 * serializer — headings are a single line, so paragraph breaks are collapsed.
 */
export function AccentHeading({
  heading,
  accent,
}: {
  heading: RichTextContent;
  accent: AccentTreatment;
}) {
  const runs = extractRuns(heading);
  return (
    <>
      {runs.map((run, i) =>
        run.bold ? (
          <span key={i} className={accentWordClass(accent)}>
            {run.text}
          </span>
        ) : (
          run.text
        ),
      )}
    </>
  );
}
