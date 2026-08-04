"use client";

import { useEffect } from "react";

// Next.js Link (and the browser's native hash navigation) no-ops when the
// clicked link's hash matches the current URL hash — the URL doesn't change,
// so no scroll fires. That breaks the obvious user expectation of "click the
// anchor, jump to that section" on the second click. A document-level
// capture-phase listener takes over for same-page hash links and always
// calls scrollIntoView. The CSS scroll-behavior decides smooth vs. instant
// (see globals.css — `html:has(.cosmos-section)` forces instant so anchor
// navigation doesn't fast-forward through the 375vh cosmos pin).
export function HashAnchorScroll() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      if (a.target && a.target !== "_self") return;

      const href = a.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      if (url.pathname !== location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ block: "start" });
      if (location.hash !== url.hash) {
        history.pushState(null, "", url.hash);
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
