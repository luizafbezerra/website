"use client";

import { useEffect, useState } from "react";

/** Mirrors the breakpoint the Cosmos itself uses to decide it is not on a phone. */
const WIDE_VIEWPORT_QUERY = "(min-width: 768px)";

/**
 * Whether there is room for a set-piece that needs a wide viewport.
 *
 * `false` until measured, for the same reason `useMotionAllowed` starts closed:
 * the server has no viewport, so the first render has to be the version that is
 * correct for the narrower, more constrained visitor — and on this site that
 * version is also the one made of real content rather than of a canvas.
 */
export function useWideViewport(): boolean {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(WIDE_VIEWPORT_QUERY);
    setWide(query.matches);

    const onChange = (event: MediaQueryListEvent) => setWide(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return wide;
}
