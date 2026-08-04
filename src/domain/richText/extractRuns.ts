import { FORMAT_BOLD, type RichTextContent } from "./RichTextContent";

/** A flattened inline run extracted from RichTextContent. */
export type ExtractedRun = { text: string; bold: boolean };

/**
 * Flatten a RichTextContent's text nodes into runs, each flagged bold or not
 * (reading the Lexical format bitmask). Used to render a single-line accent
 * heading where the bold run is the "destaque" word. Paragraph breaks are
 * collapsed — a heading is one line — and every level is guarded so a missing
 * or malformed value yields an empty list rather than throwing.
 */
export function extractRuns(content: RichTextContent | null | undefined): ExtractedRun[] {
  const runs: ExtractedRun[] = [];
  const paragraphs = content?.root?.children;
  if (!Array.isArray(paragraphs)) return runs;

  for (const paragraph of paragraphs) {
    const children = (paragraph as { children?: unknown }).children;
    if (!Array.isArray(children)) continue;

    for (const node of children) {
      const textNode = node as { type?: string; text?: string; format?: number };
      if (textNode.type !== "text" || typeof textNode.text !== "string") continue;
      runs.push({
        text: textNode.text,
        bold: ((textNode.format ?? 0) & FORMAT_BOLD) !== 0,
      });
    }
  }

  return runs;
}
