import type { PayloadInstagramAuth } from "@/infrastructure/payload/getInstagramAuthGlobal";

/**
 * Which Instagram token to use right now.
 *
 * The stored one wins, because it is the one that rotates: the daily refresh job
 * writes a fresh 60-day token into the `instagram-auth` global, and from the
 * second refresh onward the env var is stale. `INSTAGRAM_TOKEN` stays as the
 * bootstrap — the value a human pasted once so the loop had somewhere to start —
 * and as the fallback for a database that has not been written yet.
 *
 * Deliberately **not** `server-only`: the refresh task runs under the Payload
 * CLI (plain node, no React), which cannot resolve that import. This file is a
 * rule with no I/O, so both sides can share it.
 */
export function resolveInstagramToken(auth: PayloadInstagramAuth | null): string | null {
  const stored = auth?.accessToken?.trim();
  if (stored) return stored;

  const fromEnv = process.env.INSTAGRAM_TOKEN?.trim();
  return fromEnv ? fromEnv : null;
}
