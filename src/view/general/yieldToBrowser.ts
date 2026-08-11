"use client";

/**
 * Hands the main thread back, then resumes — the seam that turns one long task
 * into several short ones.
 *
 * `scheduler.postTask` is the honest version: the browser may run input and
 * rendering before it comes back. Where it does not exist, a double
 * `requestAnimationFrame` is the closest equivalent that still guarantees a
 * paint has committed in between — a single rAF can be coalesced into the same
 * frame as the caller's own style update.
 *
 * `user-visible`, not `background`. Background priority is starved outright by a
 * busy main thread, and the caller here is a multi-step build that has to finish:
 * a reader who lands inside the section by anchor or scroll restoration reveals
 * the canvas immediately, its render loop saturates the thread, and background
 * steps then never run — the build stalls and the reveal falls through to its
 * timeout. Yielding is the goal; being deprioritised indefinitely is not.
 *
 * Resolves whether or not the yield was honoured, so a caller stepping through
 * stages can never strand itself; pass an `AbortSignal` to stop a torn-down
 * consumer from advancing.
 */

type Scheduler = {
  postTask: (
    callback: () => void,
    options?: { priority?: string; signal?: AbortSignal },
  ) => Promise<unknown>;
};

export function yieldToBrowser(signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.resolve();

  const scheduler = (globalThis as { scheduler?: Scheduler }).scheduler;
  if (scheduler && typeof scheduler.postTask === "function") {
    return scheduler
      .postTask(() => {}, { priority: "user-visible", signal })
      .then(
        () => undefined,
        // An aborted or unsupported-priority postTask rejects; the caller's own
        // signal check decides what that means, so swallow it here.
        () => undefined,
      );
  }

  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
