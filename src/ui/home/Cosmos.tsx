"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cosmos as Data } from "@/core";
import { cn } from "@/lib";
import type { SigilScreenPosition } from "./CosmosCanvas";
import { CosmosMarginalia } from "./CosmosMarginalia";
import { CosmosSigilOverlay } from "./cosmos/CosmosSigilOverlay";

const CosmosCanvas = dynamic(() => import("./CosmosCanvas").then((m) => m.CosmosCanvas), {
  ssr: false,
  loading: () => null,
});

const SIGIL_COUNT = 12;

const initialSigilPositions = (): SigilScreenPosition[] =>
  Array.from({ length: SIGIL_COUNT }, () => ({ x: 0.5, y: 0.5, visible: false }));

export function Cosmos() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const sigilScreenPositionsRef = useRef<SigilScreenPosition[]>(initialSigilPositions());

  const [mountCanvas, setMountCanvas] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeSigil, setActiveSigil] = useState<Data.SigilId | null>(null);
  // Drives `<Canvas frameloop>` so per-frame WebGL work pauses when the
  // section is scrolled completely off the viewport.
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Reduced motion preference.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mobile detection (mirrors the CSS breakpoint at 767px).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // IntersectionObserver gate. Two concerns wired through the same observer:
  //   * `mountCanvas` is set once the first time the section gets within
  //     ~30vh of the viewport. Never unset — once mounted, the canvas + env
  //     probe + nebula bake stay alive in memory.
  //   * `isVisible` tracks current intersection. Drives the Canvas's
  //     `frameloop` so per-frame WebGL work pauses when the user scrolls
  //     completely past the section.
  // Reduced-motion never mounts the canvas.
  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setMountCanvas(true);
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: "30% 0px 30% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  // Scroll progress → progressRef (consumed by CosmosCameraRig inside the
  // canvas) + CSS vars (consumed by the sigil overlay for its fade envelope).
  // Mobile skips this — no pin, the scene runs autonomously with a fixed cam.
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    let rafId = 0;
    let pending = false;

    const apply = () => {
      pending = false;
      const pinned = pinnedRef.current;
      const root = sectionRef.current;
      if (!pinned || !root) return;
      const rect = pinned.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.max(0, Math.min(1, -rect.top / range)) : 1;
      progressRef.current = p;
      root.style.setProperty("--cosmos-progress", p.toFixed(3));
      root.style.setProperty("--cosmos-overlay-opacity", Data.sigilOverlayOpacity(p).toFixed(3));
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, isMobile]);

  const focusSigil = useCallback((id: Data.SigilId) => setActiveSigil(id), []);
  const blurSigil = useCallback(() => setActiveSigil(null), []);

  const showLiveCanvas = mountCanvas && !reducedMotion;

  return (
    <section
      ref={sectionRef}
      id={Data.sectionAnchorId}
      aria-label={Data.sectionAriaLabel}
      className={cn(
        "cosmos-section relative",
        reducedMotion && "cosmos-reduced",
        isMobile && "cosmos-mobile",
      )}
    >
      <header className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:px-10 sm:pt-28 sm:pb-14">
        <p className="tracked mb-5 text-center sm:text-left">{Data.sectionEyebrow}</p>
        <h2 className="display text-foreground text-balance text-[clamp(1.95rem,3.8vw,2.75rem)] leading-[1.13] tracking-[-0.008em]">
          {Data.sectionTitle}
        </h2>
        <p className="body-italic text-ink-soft mt-7 max-w-[58ch] text-[1.06rem] leading-[1.7]">
          {Data.sectionDek}
        </p>
      </header>

      <div ref={pinnedRef} className="cosmos-pinned">
        <div className="cosmos-sticky">
          <div className="cosmos-canvas-layer" aria-hidden="true">
            {showLiveCanvas ? (
              <CosmosCanvas
                progressRef={progressRef}
                sigilScreenPositionsRef={sigilScreenPositionsRef}
                activeSigilId={activeSigil}
                mobile={isMobile}
                visible={isVisible}
              />
            ) : (
              <PosterFallback />
            )}
          </div>

          {showLiveCanvas ? (
            <CosmosSigilOverlay
              sigilScreenPositionsRef={sigilScreenPositionsRef}
              activeSigilId={activeSigil}
              onActivate={focusSigil}
              onDeactivate={blurSigil}
            />
          ) : (
            <StaticSigilWheel
              activeSigil={activeSigil}
              onActivate={focusSigil}
              onDeactivate={blurSigil}
            />
          )}

          {/* The gutter marginalia is only used in the static-wheel fallback.
              In live mode, the floating popover inside CosmosSigilOverlay
              renders the active sigil's marginalia near the sigil itself. */}
          {!showLiveCanvas ? (
            <div className="cosmos-marginalia-frame">
              <CosmosMarginalia activeSigilId={activeSigil} />
            </div>
          ) : null}
        </div>
      </div>

      <footer className="mx-auto max-w-3xl px-6 pt-12 pb-24 sm:px-10 sm:pt-16 sm:pb-28">
        <p className="marginalia text-center sm:text-left">
          <span aria-hidden="true" className="text-terracotta mr-2">
            ·
          </span>
          {Data.sectionDisclaimer}
        </p>
      </footer>

      {/* No-JS / hidden fallback: a flat list of the twelve sigils with their
          marginalia. Lives in the DOM regardless of script state; visually
          hidden when JS is available so the live overlay carries the UI. */}
      <noscript>
        <ul className="cosmos-noscript-list">
          {Data.sigils.map((s) => (
            <li key={s.id}>
              <span aria-hidden="true" className="text-terracotta mr-2">
                {s.glyph}
              </span>
              <strong>{s.name}</strong>
              <span className="marginalia ml-2">— {s.marginalia}</span>
            </li>
          ))}
        </ul>
      </noscript>
    </section>
  );
}

// Static wheel fallback for reduced-motion (no canvas mounted). The painted
// poster + projected sigil JSON would normally go here once §9 of the design
// brief ships. Until then we lay the twelve sigils out on the same 78vh wheel
// the v1 scaffold used so the section degrades gracefully.
function StaticSigilWheel({
  activeSigil,
  onActivate,
  onDeactivate,
}: {
  activeSigil: Data.SigilId | null;
  onActivate: (id: Data.SigilId) => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="cosmos-stage-frame">
      <div className="cosmos-stage">
        <span aria-hidden="true" className="cosmos-hub display-italic text-terracotta">
          ✦
        </span>
        {Data.sigils.map((sigil, i) => {
          const poster = Data.posterSigilPositions[i];
          const wheel = Data.sigilPosition(i);
          const left = poster ? `${poster.x * 100}%` : `calc(50% + ${wheel.x * 50}%)`;
          const top = poster ? `${poster.y * 100}%` : `calc(50% + ${wheel.y * 50}%)`;
          const isActive = activeSigil === sigil.id;
          const isDim = activeSigil !== null && !isActive;
          return (
            <button
              key={sigil.id}
              type="button"
              aria-label={Data.sigilAriaLabel(sigil.name)}
              aria-pressed={isActive}
              className={cn(
                "cosmos-sigil display-italic",
                isActive && "cosmos-sigil-active",
                isDim && "cosmos-sigil-dim",
              )}
              style={{ left, top }}
              onMouseEnter={() => onActivate(sigil.id)}
              onMouseLeave={onDeactivate}
              onFocus={() => onActivate(sigil.id)}
              onBlur={onDeactivate}
            >
              {sigil.glyph}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Painted-poster fallback. The rasterized keyframe + 12 projected sigil
// positions (Section 9 of the design brief) are not yet wired; until they
// ship, this is a transparent layer so the page parchment shows through.
function PosterFallback() {
  return <div className="cosmos-poster-fallback" role="presentation" aria-hidden="true" />;
}
