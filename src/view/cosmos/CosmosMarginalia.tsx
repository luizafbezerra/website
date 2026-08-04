"use client";

import { useEffect, useRef, useState } from "react";
import { Cosmos } from "@/domain/cosmos/Cosmos";
import { cn } from "@/view/styling/cn";

type Props = {
  activeSigilId: Cosmos.SigilId | null;
  className?: string;
};

// Marginalia gutter: the italic quill text that names whatever the visitor is
// pointing at. Holds the last-seen sigil during the leave fade so the strip
// never goes blank mid-transition.
export function CosmosMarginalia({ activeSigilId, className }: Props) {
  const [displayed, setDisplayed] = useState<Cosmos.SigilId | null>(activeSigilId);
  const [visible, setVisible] = useState<boolean>(activeSigilId !== null);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (swapTimer.current) clearTimeout(swapTimer.current);
    if (activeSigilId === null) {
      setVisible(false);
      return;
    }
    if (activeSigilId === displayed) {
      setVisible(true);
      return;
    }
    setVisible(false);
    swapTimer.current = setTimeout(() => {
      setDisplayed(activeSigilId);
      setVisible(true);
    }, 160);
    return () => {
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, [activeSigilId, displayed]);

  const sigil = displayed ? (Cosmos.sigils.find((s) => s.id === displayed) ?? null) : null;

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "pointer-events-none select-none text-balance",
        "transition-opacity duration-300 ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {sigil ? (
        <>
          <p className="tracked-ink mb-2">
            <span aria-hidden="true" className="text-terracotta mr-2">
              {sigil.glyph}
            </span>
            {sigil.name}
          </p>
          <p className="marginalia text-[0.96rem] leading-[1.55]">
            <span className="display-italic text-terracotta-deep mr-1">·</span>
            {sigil.marginalia}
          </p>
        </>
      ) : (
        <p className="marginalia text-[0.96rem] leading-[1.55] italic">
          {/* invisible placeholder keeps the gutter from collapsing on first paint */}
          &nbsp;
        </p>
      )}
    </aside>
  );
}
