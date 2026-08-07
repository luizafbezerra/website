const THOUSAND = 1000;

/** Human-readable count for an index line: "~840 tokens" / "~1.4k tokens". */
export function formatTokens(count: number): string {
  return count >= THOUSAND ? `~${(count / THOUSAND).toFixed(1)}k tokens` : `~${count} tokens`;
}
