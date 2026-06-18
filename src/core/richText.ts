// ---------------------------------------------------------------------------
// Minimal Lexical rich-text builder. The Home global stores body copy as
// Payload `richText` (Lexical `SerializedEditorState`); this constructs the
// same shape for the code defaults so the seed and the fallback render the
// current copy — including inline italic emphasis. Structural type only (no
// `lexical`/`react` import) so `core/` stays framework-free.
// ---------------------------------------------------------------------------

export type RichTextRun = { text: string; italic?: boolean; bold?: boolean };
/** A paragraph: a plain string, or runs when inline emphasis is needed. */
export type RichTextParagraph = string | RichTextRun[];

/** Structurally compatible with Lexical's SerializedEditorState. */
export type RichTextContent = {
  root: {
    type: "root";
    format: "";
    indent: 0;
    version: 1;
    direction: "ltr";
    children: unknown[];
  };
};

// Lexical text-format bitmask: bold=1, italic=2 (OR-combined per run).
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

function textNode(run: RichTextRun) {
  return {
    type: "text",
    text: run.text,
    format: (run.bold ? FORMAT_BOLD : 0) | (run.italic ? FORMAT_ITALIC : 0),
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
}

function paragraphNode(paragraph: RichTextParagraph) {
  const runs: RichTextRun[] = typeof paragraph === "string" ? [{ text: paragraph }] : paragraph;
  return {
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    textFormat: 0,
    children: runs.map(textNode),
  };
}

export function richText(paragraphs: RichTextParagraph[]): RichTextContent {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map(paragraphNode),
    },
  };
}

/** A flattened inline run extracted from RichTextContent. */
export type ExtractedRun = { text: string; bold: boolean };

/**
 * Flatten a RichTextContent's text nodes into runs, each flagged bold or not
 * (reading the Lexical format bitmask, bold = 1). Used to render a single-line
 * accent heading where the bold run is the "destaque" word. Paragraph breaks
 * are collapsed — a heading is one line — and guards every level so a missing
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
      const n = node as { type?: string; text?: string; format?: number };
      if (n.type !== "text" || typeof n.text !== "string") continue;
      runs.push({ text: n.text, bold: ((n.format ?? 0) & FORMAT_BOLD) !== 0 });
    }
  }
  return runs;
}
