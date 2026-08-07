// ---------------------------------------------------------------------------
// Coarse token accounting for the machine audience — `/llms.txt` today, the
// Markdown twins later. Agents budget their context window, so every indexed
// page advertises roughly how much reading it is.
// ---------------------------------------------------------------------------

/** Characters per token for pt-BR prose under common BPE tokenizers. */
const CHARS_PER_TOKEN = 4;

/** Rough token count of a plain-text body. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}
