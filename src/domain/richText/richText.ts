import {
  FORMAT_BOLD,
  FORMAT_ITALIC,
  type RichTextContent,
  type RichTextParagraph,
  type RichTextRun,
} from "./RichTextContent";

// ---------------------------------------------------------------------------
// Builder for the Lexical shape. Used by the code defaults and by the seed, so
// an un-edited CMS field and its hardcoded fallback render the same paragraphs
// — including inline italic emphasis.
// ---------------------------------------------------------------------------

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
