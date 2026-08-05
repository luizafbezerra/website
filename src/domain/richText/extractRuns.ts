import { extractParagraphs } from "./extractParagraphs";
import type { RichTextContent } from "./RichTextContent";

/** A flattened inline run extracted from RichTextContent. */
export type ExtractedRun = { text: string; bold: boolean };

/**
 * Flatten a RichTextContent's text nodes into runs, each flagged bold or not
 * (reading the Lexical format bitmask). Used to render a single-line accent
 * heading where the bold run is the "destaque" word. Paragraph breaks are
 * collapsed — a heading is one line.
 *
 * The walk itself lives in `extractParagraphs`, which keeps the paragraph
 * grouping the Markdown twins need; this projection drops the grouping and the
 * italic flag a heading has no use for, so the accent heading keeps its exact
 * two-field shape.
 */
export function extractRuns(content: RichTextContent | null | undefined): ExtractedRun[] {
  return extractParagraphs(content)
    .flat()
    .map((run) => ({ text: run.text, bold: run.bold }));
}
