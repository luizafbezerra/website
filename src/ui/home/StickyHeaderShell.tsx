"use client";

import { useEffect, useRef } from "react";

const COSMOS_SELECTOR = ".cosmos-section";

type Props = {
  children: React.ReactNode;
};

export function StickyHeaderShell({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cosmosEl = document.querySelector(COSMOS_SELECTOR);
    if (!cosmosEl) return;

    // The header is always solid and always visible — except while cosmos
    // fills most of the viewport, in which case it slides off so the scene
    // can run unframed. `rootMargin: 0 0 -60% 0` means cosmos has to cross
    // above the top 40% of the viewport before intersection fires.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          root.dataset.hidden = entry.isIntersecting ? "true" : "false";
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );
    io.observe(cosmosEl);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="sticky-header" data-hidden="false">
      {children}
    </div>
  );
}
