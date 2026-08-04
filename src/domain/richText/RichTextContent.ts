// ---------------------------------------------------------------------------
// The Lexical rich-text shape, described structurally rather than imported from
// `lexical`, so the domain layer carries no framework dependency. Payload stores
// editorial body copy in this shape; the code defaults build the same shape so
// the seed and the fallback render identical prose.
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
export const FORMAT_BOLD = 1;
export const FORMAT_ITALIC = 2;
