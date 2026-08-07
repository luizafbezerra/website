import { FORMAT_BOLD, FORMAT_ITALIC, type RichTextContent } from "./RichTextContent";

/** One inline run of a paragraph, with both emphases the editor can set. */
export type ParagraphRun = { text: string; bold: boolean; italic: boolean };

/**
 * Walk a `RichTextContent` and return its text runs **grouped by paragraph**.
 *
 * This is the one Lexical walker in the domain. `extractRuns` flattens its result
 * for the single-line accent heading; the Markdown twins keep the grouping,
 * because a paragraph break is the whole difference between a heading and a body.
 *
 * Every level is guarded: a missing root, a non-array `children`, a node that is
 * not a text node all yield fewer runs rather than an exception. Payload can hand
 * us an empty editor state, and a machine-facing text file is not a place to
 * throw.
 *
 * A paragraph whose `children` is not an array produces no entry at all, so the
 * caller never has to distinguish "empty paragraph" from "malformed node".
 */
export function extractParagraphs(content: RichTextContent | null | undefined): ParagraphRun[][] {
  const paragraphs = content?.root?.children;
  if (!Array.isArray(paragraphs)) return [];

  const extracted: ParagraphRun[][] = [];

  for (const paragraph of paragraphs) {
    const children = (paragraph as { children?: unknown }).children;
    if (!Array.isArray(children)) continue;

    const runs: ParagraphRun[] = [];
    for (const node of children) {
      const textNode = node as { type?: string; text?: string; format?: number };
      if (textNode.type !== "text" || typeof textNode.text !== "string") continue;

      const format = textNode.format ?? 0;
      runs.push({
        text: textNode.text,
        bold: (format & FORMAT_BOLD) !== 0,
        italic: (format & FORMAT_ITALIC) !== 0,
      });
    }

    extracted.push(runs);
  }

  return extracted;
}
