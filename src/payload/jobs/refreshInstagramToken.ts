import type { PayloadRequest, TaskConfig } from "payload";
import { alertInstagramTokenFailure } from "@/infrastructure/alerts/alertInstagramTokenFailure";
import { fetchRefreshedToken } from "@/infrastructure/instagram/fetchRefreshedToken";
import { resolveInstagramToken } from "@/infrastructure/instagram/resolveInstagramToken";
import type { PayloadInstagramAuth } from "@/infrastructure/payload/getInstagramAuthGlobal";

/**
 * Keep the Instagram token alive without a human in the loop.
 *
 * Instagram-Login tokens last 60 days and are renewed by exchanging the current
 * one for a fresh one. Left alone, that is a calendar reminder every two months
 * and a dead feed whenever someone misses it; this task makes the site renew its
 * own credential.
 *
 * **Cadence.** The task's cron is 03:00 and the Vercel cron that pokes
 * `/api/payload-jobs/run` is 04:00. `/run` evaluates schedules itself, so the
 * hour of slack means the job is always already due when the runner arrives —
 * which matters on Hobby, where cron firing times drift by up to an hour. The
 * first `/run` after a deploy only *queues* the job; the first real refresh
 * therefore lands on day two, which is irrelevant against a 60-day token.
 *
 * **`retries: 0` on purpose.** The daily cron *is* the retry cadence. A token
 * with a month of runway left has no use for a retry ten seconds later, and
 * failures need to be countable — three consecutive days of failure is a signal,
 * three retries inside one minute is noise.
 *
 * The handler uses `req.payload` rather than `getPayloadSafe`, because it runs
 * outside a React request (and under the Payload CLI, which cannot resolve
 * `server-only`). Everything it imports is free of that marker for the same
 * reason.
 */

/** Renew when less than this remains — a month of runway for ~29 retries. */
const REFRESH_WHEN_REMAINING_MS = 30 * 24 * 60 * 60 * 1000;

/** Three days of silence before a human is emailed. */
const ALERT_AFTER_FAILURES = 3;

const AUTH_SLUG = "instagram-auth";

export const refreshInstagramTokenTask: TaskConfig<{
  input: Record<string, never>;
  output: { refreshed: boolean; reason?: string };
}> = {
  slug: "refreshInstagramToken",
  label: "Renovar o token do Instagram",
  retries: 0,
  schedule: [{ cron: "0 3 * * *", queue: "default" }],
  handler: async ({ req }) => {
    const { payload } = req;

    const auth = (await payload.findGlobal({
      slug: AUTH_SLUG,
      overrideAccess: true,
      depth: 0,
    })) as PayloadInstagramAuth;

    const currentToken = resolveInstagramToken(auth);
    if (!currentToken) {
      // Nothing to renew and nothing broken: the site simply has no Instagram
      // credential yet, and the feed is already hiding itself.
      return { output: { refreshed: false, reason: "no-token" } };
    }

    const now = new Date();
    // A null `expiresAt` means the token came from the environment and has never
    // been through this task, so its real expiry is unknown — renew immediately
    // and let the response tell us when it actually ends.
    const expiresAt = auth?.expiresAt ? new Date(auth.expiresAt) : null;
    const isDue =
      expiresAt === null || expiresAt.getTime() - now.getTime() < REFRESH_WHEN_REMAINING_MS;

    if (!isDue) {
      return { output: { refreshed: false, reason: "not-due" } };
    }

    try {
      const refreshed = await fetchRefreshedToken(currentToken);

      await payload.updateGlobal({
        slug: AUTH_SLUG,
        overrideAccess: true,
        req,
        data: {
          accessToken: refreshed.accessToken,
          previousToken: currentToken,
          expiresAt: new Date(now.getTime() + refreshed.expiresInSeconds * 1000).toISOString(),
          lastRefreshedAt: now.toISOString(),
          consecutiveFailures: 0,
          lastError: null,
        },
      });

      return { output: { refreshed: true } };
    } catch (error) {
      const failures = (auth?.consecutiveFailures ?? 0) + 1;
      await recordFailure({ req, auth, currentToken, error, failures, now });

      if (failures >= ALERT_AFTER_FAILURES) {
        await alertInstagramTokenFailure(payload, error, failures);
      }

      // Rethrow so the run is marked failed in `payload-jobs` — the collection is
      // the audit trail, and a swallowed error would show a clean history while
      // the token quietly ran down.
      throw error;
    }
  },
};

/**
 * Persist the failure. Guarded, because the write itself can be what failed: a
 * database that is down must not replace the real error with a second one.
 *
 * The env token is copied into `accessToken` on the way past. Without it a
 * failing env-bootstrapped install leaves an empty global, and the failure
 * counter it carries reads as belonging to no token at all.
 */
async function recordFailure({
  req,
  auth,
  currentToken,
  error,
  failures,
  now,
}: {
  req: PayloadRequest;
  auth: PayloadInstagramAuth;
  currentToken: string;
  error: unknown;
  failures: number;
  now: Date;
}): Promise<void> {
  const { payload } = req;
  const detail = error instanceof Error ? error.message : String(error);
  const lastError = `${now.toISOString()} — ${detail}`.slice(0, 2000);

  try {
    await payload.updateGlobal({
      slug: AUTH_SLUG,
      overrideAccess: true,
      req,
      data: {
        ...(auth?.accessToken ? {} : { accessToken: currentToken }),
        consecutiveFailures: failures,
        lastError,
      },
    });
  } catch (writeError) {
    payload.logger.error({
      msg: "[instagram] could not record the token-refresh failure",
      err: writeError,
    });
  }
}
