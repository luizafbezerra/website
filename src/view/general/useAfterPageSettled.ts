"use client";

import { useEffect, useState } from "react";

/**
 * Flips to `true` once the page has genuinely finished its own load, then gone
 * idle — the moment after which speculative work costs a visitor nothing.
 *
 * `requestIdleCallback` alone is not that moment. It fires as soon as the main
 * thread goes quiet, which on any decent machine is a few hundred milliseconds
 * after hydration — while the hero's portrait and the Instagram tiles are still
 * in flight, competing for the same bandwidth. Its `timeout` option does not
 * postpone the callback either; it only caps how long the browser may delay it.
 *
 * So the gate is both conditions in order: the `load` event (every subresource
 * the document asked for has settled), and only then an idle slice.
 *
 * Safari has no `requestIdleCallback`, so it takes a short timer instead —
 * later than an idle callback would fire, which is the safe direction to err.
 */

const IDLE_FALLBACK_MS = 800;
const IDLE_TIMEOUT_MS = 3000;

export function useAfterPageSettled(): boolean {
  const [settled, setSettled] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const onIdle = () => {
      if (!cancelled) setSettled(true);
    };

    const waitForIdle = () => {
      if (cancelled) return;
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        idleId = ric(onIdle, { timeout: IDLE_TIMEOUT_MS });
        return;
      }
      timerId = setTimeout(onIdle, IDLE_FALLBACK_MS);
    };

    if (document.readyState === "complete") {
      waitForIdle();
    } else {
      window.addEventListener("load", waitForIdle, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", waitForIdle);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, []);

  return settled;
}
