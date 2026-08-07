import { extractParagraphs, type ParagraphRun } from "@/domain/richText/extractParagraphs";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import type { MarkdownBlock } from "./MarkdownBlock";
import { paragraph } from "./MarkdownBlock";

/**
 * A Lexical body → Markdown paragraphs, keeping the inline emphasis the editor
 * set.
 *
 * The emphasis is worth carrying: `*individuação*` on /analise and
 * `*um caminho sem volta*` on /sobre are the two places her prose leans on a
 * word, and a twin that flattened them would be quoting her less accurately than
 * the page does.
 *
 * A run whose text is only whitespace keeps its space but loses its markers —
 * `** **` is not emphasis in CommonMark and would print as literal asterisks.
 * Paragraphs that end up blank are dropped, which is what makes an empty editor
 * state produce no blocks at all rather than an empty line.
 */
export function richTextToMarkdown(content: RichTextContent | null | undefined): MarkdownBlock[] {
  return extractParagraphs(content).flatMap((runs) => {
    const block = paragraph(runs.map(emphasize).join(""));
    return block ? [block] : [];
  });
}

function emphasize(run: ParagraphRun): string {
  if (!run.text.trim()) return run.text;

  const markers = `${run.bold ? "**" : ""}${run.italic ? "*" : ""}`;
  if (!markers) return run.text;

  // Emphasis delimiters must hug the word: `* text *` is literal asterisks in
  // CommonMark, so any padding a run carries is moved outside the markers.
  const leading = run.text.slice(0, run.text.length - run.text.trimStart().length);
  const trailing = run.text.slice(run.text.trimEnd().length);

  // `**` + `*` opens as `***` and closes the same way, so one marker string
  // serves both ends.
  return `${leading}${markers}${run.text.trim()}${markers}${trailing}`;
}
