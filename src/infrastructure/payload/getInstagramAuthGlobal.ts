import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";

// ---------------------------------------------------------------------------
// The raw `instagram-auth` global exactly as Payload returns it. Machine state,
// not content: no locale argument, because a credential has no language.
//
// The global denies read to everyone over HTTP (see
// `src/payload/globals/instagramAuth.ts`), so `overrideAccess: true` here is not
// the usual convenience — it is the only way in. That is the design: the token is
// reachable from server code and from nowhere else.
//
// `cache` is React's request-scoped memoizer, kept on the I/O like every other
// accessor in this folder, so one render reads the token once.
// ---------------------------------------------------------------------------

export type PayloadInstagramAuth = {
  accessToken?: string | null;
  previousToken?: string | null;
  expiresAt?: string | null;
  lastRefreshedAt?: string | null;
  consecutiveFailures?: number | null;
  lastError?: string | null;
} | null;

/** The `instagram-auth` global, or null when Payload is disabled or unreachable. */
export const getInstagramAuthGlobal = cache(
  async function getInstagramAuthGlobal(): Promise<PayloadInstagramAuth> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({
      slug: "instagram-auth",
      depth: 0,
      overrideAccess: true,
    });
    return doc as PayloadInstagramAuth;
  },
);
