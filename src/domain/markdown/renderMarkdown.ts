import type { MarkdownBlock } from "./MarkdownBlock";

// ---------------------------------------------------------------------------
// Block list → Markdown text. The whole of the twins' formatting lives here, so
// the eight page builders never see a `#` or a newline.
//
// **Nothing is escaped, and that is a decision.** The source is editorial prose
// from the CMS: em dashes, guillemets, "Lei nº 13.709/2018", `NEXT_LOCALE`.
// CommonMark treats every one of those literally in the middle of a line
// (intra-word underscores are not emphasis), while escaping would put
// backslashes into her sentences for a machine to read back. The one construct
// that could change a block's meaning is a line *starting* with markup, which is
// why `paragraph` and the list items are trimmed and joined per block rather
// than allowed to carry their own line structure.
// ---------------------------------------------------------------------------

export function renderMarkdown(blocks: readonly MarkdownBlock[]): string {
  return `${blocks.map(renderBlock).join("\n\n")}\n`;
}

function renderBlock(block: MarkdownBlock): string {
  switch (block.kind) {
    case "heading":
      return `${"#".repeat(block.level)} ${block.text}`;
    case "paragraph":
      return block.text;
    case "quote":
      // A quoted line may itself be several sentences but never several
      // paragraphs — every quoting site on the site is one utterance.
      return `> ${block.text}`;
    case "bullets":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "numbered":
      // Markdown renumbers from 1 regardless of the digits written here, and the
      // sequences this renders (I–V passo a passo, the four movements of the
      // percurso) are ordered facts rather than her typography — the roman
      // numerals are a DESIGN convention for the rendered page.
      return block.items.map((item, index) => `${index + 1}. ${item}`).join("\n");
  }
}
