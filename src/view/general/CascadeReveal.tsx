"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/view/styling/cn";

/**
 * A list whose rows are written in from the margin, one after the other, the
 * first time it comes into view.
 *
 * The list element itself is the trigger, not its section, so the cascade
 * fires on the list being meaningfully on screen rather than on the section
 * first peeking over the fold. Rows start a little to the left at zero opacity
 * and settle to rest one by one, `--list-i` × `--list-step`.
 *
 * **One-shot, and time-based on purpose.** An earlier cut scrubbed this to the
 * scroll with `animation-timeline`, which ran the reveal backwards when you
 * scrolled up and finished it inside the sliver below the fold. A record
 * un-writing itself is the wrong idea for the one list whose job is
 * verification, so the observer unobserves on first intersection: written
 * once, written for good.
 *
 * A list already past the trigger line at mount plays at once instead of
 * waiting for an intersection that has already happened — reloading with the
 * record on screen should still show it being written.
 *
 * **Nothing may strand a hidden row.** Arming happens from JS, so no JS and
 * `prefers-reduced-motion` both render the list plainly. The two remaining
 * ways a row could stay hidden are both closed below: a list already scrolled
 * past at mount is never armed, and a list skipped over afterwards (an anchor
 * jump, scroll restoration, any instant `scrollTo`) is caught by the expanded
 * top root margin — without it the element crosses the viewport between two
 * observer samples, no threshold is ever crossed, and the rows stay invisible
 * forever.
 */

/** Where the trigger line sits, as a fraction up from the viewport bottom. */
const DEFAULT_TRIGGER_INSET = 0.15;

/**
 * Extends the observer root far above the viewport so anything that ends up
 * overhead still counts as intersecting. Large enough to cover any real
 * document, and it costs nothing: the bottom inset is what decides when a list
 * scrolled *into* view fires.
 */
const ABOVE_VIEWPORT_REACH = "200000px";

type CascadeRevealProps = {
  /** The list element to render — the rows are its direct children. */
  as: "ul" | "ol" | "dl";
  /**
   * How deep into the screen the list must come before the cascade starts, as
   * a fraction up from the viewport bottom. Raise it for a list that should
   * hold until the reader is properly looking at it.
   */
  trigger?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function CascadeReveal({
  as,
  trigger = DEFAULT_TRIGGER_INSET,
  className,
  style,
  children,
}: CascadeRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already scrolled past — the entrance is spent. Leave it plainly visible
    // rather than arming a cascade above the reader's head.
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= 0) return;

    el.setAttribute("data-armed", "true");

    // Past the trigger line already, so there is no intersection left to wait
    // for. The two nested frames matter: the armed (hidden) state has to commit
    // a paint before `data-in` flips, or the browser coalesces both into one
    // style update and the transition never runs.
    if (rect.top < window.innerHeight * (1 - trigger)) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => el.setAttribute("data-in", "true"));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "true");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.01,
        rootMargin: `${ABOVE_VIEWPORT_REACH} 0px -${trigger * 100}% 0px`,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger]);

  return createElement(as, { ref, className: cn("cascade-reveal", className), style }, children);
}
