// ---------------------------------------------------------------------------
// Minimal Lexical rich-text builder. The Home global stores body copy as
// Payload `richText` (Lexical `SerializedEditorState`); this constructs the
// same shape for the code defaults so the seed and the fallback render the
// current copy — including inline italic emphasis. Structural type only (no
// `lexical`/`react` import) so `core/` stays framework-free.
// ---------------------------------------------------------------------------

export type RichTextRun = { text: string; italic?: boolean };
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

const FORMAT_ITALIC = 2; // Lexical text-format bitmask: bold=1, italic=2.

function textNode(run: RichTextRun) {
  return {
    type: "text",
    text: run.text,
    format: run.italic ? FORMAT_ITALIC : 0,
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
