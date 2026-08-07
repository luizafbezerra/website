"use client";

import { useEffect } from "react";

/**
 * Releases the section's text lines (`.ceu-reveal`) the first time each one is
 * *fully* in view — the trigger for the slow slide-in the CSS owns.
 *
 * Time-fired rather than scroll-scrubbed, deliberately: the lines should take
 * the same unhurried pace at any scroll speed, and they should not begin while
 * still half-hidden at the viewport's edge. So this observer waits for
 * `threshold: 1` and then stamps `data-ceu-inview`; the transition itself,
 * its duration, and its reduced-motion gate all live in globals.css.
 *
 * The markup is server-rendered visible. Arming (hiding) happens here, after
 * hydration, and only for lines still entirely below the viewport — a line
 * the visitor can already see never blinks out to be re-revealed, a no-JS
 * reader gets the finished section, and a reduced-motion reader is untouched
 * because the armed state only exists inside the no-preference media query.
 */
export function CeuRevealTrigger() {
  useEffect(() => {
    const lines = Array.from(document.querySelectorAll(".ceu-reveal"));
    if (lines.length === 0) return;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-ceu-inview", "");
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 1 },
    );

    for (const line of lines) {
      if (line.getBoundingClientRect().top >= window.innerHeight) {
        line.setAttribute("data-ceu-armed", "");
        reveal.observe(line);
      }
    }

    return () => reveal.disconnect();
  }, []);

  return null;
}
