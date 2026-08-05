import { z } from "zod";

/**
 * Exchange a long-lived Instagram User token for a fresh one.
 *
 * Instagram-Login tokens live 60 days and are refreshable any time after their
 * first 24 hours; the exchange returns a *new* token and invalidates nothing, so
 * a failed write on our side is recoverable (the old token keeps working until
 * its own expiry).
 *
 * The token is both the credential and the subject of the call, which is why it
 * travels in the query string — that is the shape Meta documents. Never cached:
 * a cached refresh would hand back a token we already replaced.
 *
 * Not `server-only`: the caller is a Payload task that also runs under the CLI.
 */

const REFRESH_ENDPOINT = "https://graph.instagram.com/refresh_access_token";

const refreshResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number(),
});

export type RefreshedInstagramToken = {
  accessToken: string;
  /** Seconds from now until the new token expires — about 60 days. */
  expiresInSeconds: number;
};

/** Throws when Meta refuses the exchange or answers in a shape we cannot trust. */
export async function fetchRefreshedToken(currentToken: string): Promise<RefreshedInstagramToken> {
  const url = `${REFRESH_ENDPOINT}?grant_type=ig_refresh_token&access_token=${encodeURIComponent(currentToken)}`;

  const response = await fetch(url, { cache: "no-store" });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Instagram refresh failed: HTTP ${response.status} — ${truncate(body)}`);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(body);
  } catch {
    throw new Error(`Instagram refresh returned non-JSON: ${truncate(body)}`);
  }

  const result = refreshResponseSchema.safeParse(parsedJson);
  if (!result.success) {
    // The body, not the zod issue list: what we need when reading the failure a
    // month later is what Meta actually said.
    throw new Error(`Instagram refresh returned an unexpected shape: ${truncate(body)}`);
  }

  return {
    accessToken: result.data.access_token,
    expiresInSeconds: result.data.expires_in,
  };
}

/** The error message is stored in the CMS, so the body cannot be unbounded. */
function truncate(body: string): string {
  const collapsed = body.replace(/\s+/g, " ").trim();
  return collapsed.length > 500 ? `${collapsed.slice(0, 500)}…` : collapsed;
}
