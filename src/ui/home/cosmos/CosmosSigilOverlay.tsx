"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Cosmos } from "@/core";
import { cn } from "@/lib";
import type { SigilScreenPosition } from "../CosmosCanvas";

type Props = {
  sigilScreenPositionsRef: MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
  onActivate: (id: Cosmos.SigilId) => void;
  onDeactivate: () => void;
};

const SIGIL_COUNT = 12;
const POPOVER_FADE_MS = 280;
// On mouseLeave, wait this long before deactivating. Lets the visitor move
// the cursor from sigil → popover (or sigil → another sigil) without the
// popover blinking out underneath them. Matched to common hover-intent
// timings (~150–200ms).
const HOVER_INTENT_MS = 180;
const SIGIL_RADIUS = 20; // approx half-size of a sigil button, in px
const POPOVER_MARGIN = 14; // gap between sigil and popover edge

// DOM-projected sigil layer + a floating marginalia popover that follows the
// active sigil. The buttons set `--cosmos-x` / `--cosmos-y` in pixels via rAF
// (transform-only updates, GPU-composited). The popover does the same plus
// edge-collision avoidance so it never spills off the canvas viewport.
//
// Keeping the buttons in the DOM (rather than inside Three.js) is what lets
// tab order, focus styling, screen reader semantics, and hover state stay in
// the platform — no Three.js raycaster required.
export function CosmosSigilOverlay({
  sigilScreenPositionsRef,
  activeSigilId,
  onActivate,
  onDeactivate,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(Array(SIGIL_COUNT).fill(null));
  const popoverRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  // Active id mirrored into a ref so the rAF tick reads the latest value
  // without re-binding the effect on each prop change.
  const activeSigilIdRef = useRef<Cosmos.SigilId | null>(activeSigilId);
  useEffect(() => {
    activeSigilIdRef.current = activeSigilId;
  }, [activeSigilId]);

  // Hover-intent: mouseLeave doesn't deactivate immediately; instead it queues
  // a short timer. mouseEnter on any sigil or on the popover cancels the
  // pending timer, so the visitor can move from sigil → popover or sigil →
  // sigil without the popover disappearing under their cursor.
  const intentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelIntent = () => {
    if (intentTimerRef.current) {
      clearTimeout(intentTimerRef.current);
      intentTimerRef.current = null;
    }
  };
  const scheduleDeactivate = () => {
    cancelIntent();
    intentTimerRef.current = setTimeout(() => {
      intentTimerRef.current = null;
      onDeactivate();
    }, HOVER_INTENT_MS);
  };
  const activateNow = (id: Cosmos.SigilId) => {
    cancelIntent();
    onActivate(id);
  };
  useEffect(() => {
    return () => cancelIntent();
  }, []);

  // `displayedSigilId` is the sigil whose content is currently rendered in
  // the popover. On activate it follows immediately; on deactivate it lingers
  // for the fade-out duration so the popover doesn't blank mid-transition.
  const [displayedSigilId, setDisplayedSigilId] = useState<Cosmos.SigilId | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (activeSigilId !== null) {
      setDisplayedSigilId(activeSigilId);
      return;
    }
    fadeTimerRef.current = setTimeout(() => {
      setDisplayedSigilId(null);
    }, POPOVER_FADE_MS);
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [activeSigilId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    let raf = 0;

    const tick = () => {
      if (!alive) return;
      const positions = sigilScreenPositionsRef.current;
      const { w, h } = sizeRef.current;

      // 1) Position every sigil button.
      for (let i = 0; i < SIGIL_COUNT; i++) {
        const btn = buttonRefs.current[i];
        const pos = positions[i];
        if (!btn || !pos) continue;
        if (pos.visible && w > 0 && h > 0) {
          btn.style.setProperty("--cosmos-x", `${pos.x * w}px`);
          btn.style.setProperty("--cosmos-y", `${pos.y * h}px`);
          if (btn.dataset.visible !== "1") btn.dataset.visible = "1";
        } else if (btn.dataset.visible !== "0") {
          btn.dataset.visible = "0";
        }
      }

      // 2) Position the marginalia popover near the active sigil, with edge
      //    collision avoidance so it never spills off the canvas.
      const popover = popoverRef.current;
      const activeId = activeSigilIdRef.current;
      if (popover && activeId && w > 0 && h > 0) {
        const idx = Cosmos.sigils.findIndex((s) => s.id === activeId);
        const pos = idx >= 0 ? positions[idx] : null;
        if (pos?.visible) {
          const px = pos.x * w;
          const py = pos.y * h;
          const popW = popover.offsetWidth || 240;
          const popH = popover.offsetHeight || 80;
          const pad = 10;
          // Default: place below-right of the sigil.
          let x = px + SIGIL_RADIUS + POPOVER_MARGIN;
          let y = py + SIGIL_RADIUS + POPOVER_MARGIN;
          // Flip horizontally if it would overflow the right edge.
          if (x + popW + pad > w) {
            x = px - SIGIL_RADIUS - POPOVER_MARGIN - popW;
          }
          // Flip vertically if it would overflow the bottom edge.
          if (y + popH + pad > h) {
            y = py - SIGIL_RADIUS - POPOVER_MARGIN - popH;
          }
          // Final clamp inside the viewport.
          x = Math.max(pad, Math.min(x, w - popW - pad));
          y = Math.max(pad, Math.min(y, h - popH - pad));
          popover.style.setProperty("--cosmos-x", `${x}px`);
          popover.style.setProperty("--cosmos-y", `${y}px`);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [sigilScreenPositionsRef]);

  const displayedSigil =
    displayedSigilId !== null
      ? (Cosmos.sigils.find((s) => s.id === displayedSigilId) ?? null)
      : null;

  return (
    <div ref={containerRef} className="cosmos-sigil-overlay" aria-label="Constelações zodiacais">
      {Cosmos.sigils.map((sigil, i) => {
        const isActive = activeSigilId === sigil.id;
        const isDim = activeSigilId !== null && !isActive;
        return (
          <button
            key={sigil.id}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            type="button"
            aria-label={Cosmos.sigilAriaLabel(sigil.name)}
            aria-pressed={isActive}
            data-visible="0"
            className={cn(
              "cosmos-sigil-button display-italic",
              isActive && "cosmos-sigil-active",
              isDim && "cosmos-sigil-dim",
            )}
            onMouseEnter={() => activateNow(sigil.id)}
            onMouseLeave={scheduleDeactivate}
            onFocus={() => activateNow(sigil.id)}
            onBlur={scheduleDeactivate}
          >
            <span aria-hidden="true" className="cosmos-sigil-glyph">
              {sigil.glyph}
            </span>
          </button>
        );
      })}

      <div
        ref={popoverRef}
        className={cn(
          "cosmos-sigil-popover",
          activeSigilId !== null && "cosmos-sigil-popover-visible",
        )}
        aria-live="polite"
        aria-atomic="true"
        role="status"
        // Moving the cursor onto the popover cancels the pending deactivate,
        // so the popover stays open while the visitor reads. Leaving the
        // popover re-queues the deactivation timer.
        onMouseEnter={cancelIntent}
        onMouseLeave={scheduleDeactivate}
      >
        {displayedSigil ? (
          <>
            {/* The painted Bayer engraving for this sigil. Reward-for-engagement
                — only loaded into view when a popover opens. `loading="lazy"`
                keeps the 12 cartouches out of the initial paint. */}
            <picture className="cosmos-popover-picture">
              <source srcSet={Cosmos.textures.sigil(displayedSigil.id)} type="image/webp" />
              <img
                src={Cosmos.textures.sigil(displayedSigil.id)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={240}
                height={240}
              />
            </picture>
            <p className="cosmos-popover-title">
              <span aria-hidden="true" className="cosmos-popover-glyph">
                {displayedSigil.glyph}
              </span>
              <span>{displayedSigil.name}</span>
            </p>
            <p className="cosmos-popover-body">{displayedSigil.marginalia}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
