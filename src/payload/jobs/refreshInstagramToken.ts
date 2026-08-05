import type { PayloadRequest, WorkflowConfig } from "payload";
import { alertInstagramTokenFailure } from "@/infrastructure/alerts/alertInstagramTokenFailure";
import { fetchRefreshedToken } from "@/infrastructure/instagram/fetchRefreshedToken";
import { resolveInstagramToken } from "@/infrastructure/instagram/resolveInstagramToken";
import type { PayloadInstagramAuth } from "@/infrastructure/payload/getInstagramAuthGlobal";

/**
 * Keep the Instagram token alive without a human in the loop.
 *
 * Instagram-Login tokens last 60 days and are renewed by exchanging the current
 * one for a fresh one. Left alone, that is a calendar reminder every two months
 * and a dead feed whenever someone misses it; this workflow makes the site renew
 * its own credential.
 *
 * **A workflow of two tasks, so a fetched token cannot be lost.** The dangerous
 * moment is between Meta answering and our database accepting the write: a
 * single-task job that dies there has burned a refresh and kept nothing. Here
 * the exchange and the save are separate tasks, and Payload persists each
 * task's output into the job log the moment it succeeds — so a token that was
 * fetched but not saved survives in `payload-jobs`, and the retry **restores it
 * from the log instead of asking Meta again** (`shouldRestore` defaults to
 * true; the fetched token is only re-requested if the fetch itself failed).
 * The save task also retries in-process first, because most write failures are
 * transient and the token is still in memory.
 *
 * **Cadence.** The workflow's cron is 03:00 and the Vercel cron that pokes
 * `/api/payload-jobs/run` is 04:00. `/run` evaluates schedules itself, so the
 * hour of slack means the job is always already due when the runner arrives —
 * which matters on Hobby, where cron firing times drift by up to an hour. A
 * failed run's retry also waits for the next day's poke: the daily cron *is*
 * the retry cadence, and a token with a month of runway has no use for a
 * second attempt ten seconds later. `concurrency` keeps a retrying job and a
 * freshly scheduled one from ever running together.
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

/** In-process attempts at the save, while the token is still in memory. */
const SAVE_ATTEMPTS = 3;

const AUTH_SLUG = "instagram-auth";

/** What the fetch task hands the save task — absolute expiry, not seconds, so a
 * next-day retry restoring this output still writes the correct date. */
type FetchedToken = { accessToken: string; expiresAt: string };

export const refreshInstagramTokenWorkflow: WorkflowConfig = {
  slug: "refreshInstagramToken",
  schedule: [{ cron: "0 3 * * *", queue: "default" }],
  retries: 3,
  concurrency: () => "instagram-token-refresh",
  handler: async ({ inlineTask, req }) => {
    const { payload } = req;

    // Plain reads before any task: idempotent, safe to repeat on a retry, and a
    // retry *should* repeat them — if a concurrent run already saved a fresh
    // token, the due-check below ends this job instead of overwriting it.
    const auth = (await payload.findGlobal({
      slug: AUTH_SLUG,
      overrideAccess: true,
      depth: 0,
    })) as PayloadInstagramAuth;

    const currentToken = resolveInstagramToken(auth);
    if (!currentToken) {
      // Nothing to renew and nothing broken: the site simply has no Instagram
      // credential yet, and the feed is already hiding itself.
      return;
    }

    const now = new Date();
    // A null `expiresAt` means the token came from the environment and has never
    // been through this workflow, so its real expiry is unknown — renew
    // immediately and let the response tell us when it actually ends.
    const expiresAt = auth?.expiresAt ? new Date(auth.expiresAt) : null;
    const isDue =
      expiresAt === null || expiresAt.getTime() - now.getTime() < REFRESH_WHEN_REMAINING_MS;

    if (!isDue) return;

    try {
      const fetched = await inlineTask<Record<string, never>, FetchedToken>("buscar token novo", {
        // A failed *fetch* is not retried inside this job: the old token is
        // untouched, so tomorrow's scheduled run is the retry.
        retries: 0,
        task: async () => {
          const refreshed = await fetchRefreshedToken(currentToken);
          return {
            output: {
              accessToken: refreshed.accessToken,
              expiresAt: new Date(Date.now() + refreshed.expiresInSeconds * 1000).toISOString(),
            },
          };
        },
      });

      await inlineTask<Record<string, never>, Record<string, never>>("gravar token", {
        // Cross-run retries: if every in-process attempt fails, the job re-runs
        // on the next daily poke, restores `fetched` from the log, and lands
        // here again — the fetched token is never lost to a failed write.
        retries: SAVE_ATTEMPTS,
        task: async () => {
          await saveWithRetry(req, {
            accessToken: fetched.accessToken,
            previousToken: currentToken,
            expiresAt: fetched.expiresAt,
            lastRefreshedAt: new Date().toISOString(),
            consecutiveFailures: 0,
            lastError: null,
          });
          return { output: {} };
        },
      });
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
 * Write the renewed credential, retrying in-process while it is still in
 * memory. Most write failures are transient (a dropped connection, a lock);
 * three spaced attempts absorb those without involving the job machinery.
 */
async function saveWithRetry(
  req: PayloadRequest,
  data: Record<string, unknown>,
  attempts = SAVE_ATTEMPTS,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await req.payload.updateGlobal({ slug: AUTH_SLUG, overrideAccess: true, req, data });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }

  throw lastError;
}

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
