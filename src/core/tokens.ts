// ---------------------------------------------------------------------------
// Coarse token accounting for the machine audience — `/llms.txt` today, the
// Markdown twins later. Agents budget their context window, so every indexed
// page advertises roughly how much reading it is. Pure; no React, no I/O.
// ---------------------------------------------------------------------------

/** Characters per token for pt-BR prose under common BPE tokenizers. */
const CHARS_PER_TOKEN = 4;

const THOUSAND = 1000;

/** Rough token count of a plain-text body. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/** Human-readable count for an index line: "~840 tokens" / "~1.4k tokens". */
export function formatTokens(count: number): string {
  return count >= THOUSAND ? `~${(count / THOUSAND).toFixed(1)}k tokens` : `~${count} tokens`;
}
