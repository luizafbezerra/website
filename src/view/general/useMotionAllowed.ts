"use client";

import { useEffect, useState } from "react";

/**
 * Whether this visitor has *not* asked the system to reduce motion.
 *
 * It reports `false` until the media query has actually been read, which is
 * deliberate and is why the hook is phrased as a permission rather than as a
 * preference: the server cannot know, so the first render must be the still
 * version. Animation is then switched on for the visitors who allow it.
 *
 * Starting from `true` would invert the risk onto exactly the people who asked
 * not to be moved — they would receive one frame of the animated layout before
 * the correction, which is the moment the preference exists to prevent. It also
 * keeps the pre-hydration HTML the complete, readable one, which is what the
 * machine audience and a no-JS reader get.
 */
export function useMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAllowed(!query.matches);

    const onChange = (event: MediaQueryListEvent) => setAllowed(!event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return allowed;
}
