"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cosmos as Data } from "@/core";
import { cn, useCosmosShow } from "@/lib";
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

// Gate. Renders nothing when the visitor has opted out via the in-cosmos
// "Continuar a leitura" button or the footer toggle. Wrapping the heavy
// body in its own component lets it mount/unmount cleanly when the
// preference flips — IntersectionObservers and scroll listeners inside the
// body get torn down + reattached to the fresh section element instead of
// leaking onto a detached node.
//
// On the true → false transition, after the body unmounts, we scroll the
// visitor to Symbols — the section that follows Cosmos in DOM order — so
// they land at the next section instead of being left at the top of the
// page or sent backwards through content they already read.
export function Cosmos() {
  const [show, setShow] = useCosmosShow();
  const prevShowRef = useRef<boolean>(show);

  useEffect(() => {
    if (prevShowRef.current && !show) {
      document.getElementById("simbolos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevShowRef.current = show;
  }, [show]);

  if (!show) return null;
  return <CosmosBody onDismissForever={() => setShow(false)} />;
}

function CosmosBody({ onDismissForever }: { onDismissForever: () => void }) {
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
      // Drives the bottom-left epigraph's fade in tandem with the FBM
      // cloud planes inside the canvas. Same envelope, same window: both
      // appear during the final descent beat (p ∈ [0.85, 0.95]).
      root.style.setProperty("--cosmos-descent-opacity", Data.descentBeatOpacity(p).toFixed(3));
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

  const showLiveCanvas = mountCanvas && !reducedMotion && !isMobile;

  // Mobile + reduced-motion both flow through the flat layout that
  // `.cosmos-reduced` styles supply; the canvas never mounts in either case.
  const isFlatFlow = reducedMotion || isMobile;

  return (
    <section
      ref={sectionRef}
      id={Data.sectionAnchorId}
      aria-label={Data.sectionAriaLabel}
      className={cn(
        "cosmos-section relative",
        isFlatFlow && "cosmos-reduced",
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

      {/* Painted prelude flattened to a single image for mobile + reduced-
          motion paths (where the 3D scroll cinema is skipped). Decorative —
          the sigil wheel and live marginalia below carry the section's
          interactive content. */}
      {isMobile || reducedMotion ? <PreludeStatic /> : null}

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
              isVisible={isVisible}
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

          {/* Epigraph for the descent beat. Hidden through the orbit phase,
              fades in alongside the FBM cloud planes inside the canvas
              (same --cosmos-descent-opacity window). Bottom-left of the
              sticky frame; closes the section with a single Jungian line
              under the dense constellation network. Copy is a placeholder
              for Luiza's review before publish. */}
          {showLiveCanvas ? (
            <aside className="cosmos-epigraph" aria-hidden="true">
              <p className="cosmos-epigraph-line">{Data.descentEpigraph.line}</p>
              <p className="cosmos-epigraph-attribution">
                <span aria-hidden="true" className="text-terracotta mr-2">
                  ·
                </span>
                {Data.descentEpigraph.attribution}
              </p>
            </aside>
          ) : null}

          {/* Skip affordance. Mirrors the epigraph at bottom-right but lives
              outside the descent-beat opacity envelope so it stays available
              from the moment the scene mounts. Click unmounts cosmos for the
              rest of this visit; the footer toggle brings it back. */}
          <div className="cosmos-skip">
            <button type="button" className="cosmos-skip-cta" onClick={onDismissForever}>
              <span aria-hidden="true" className="cosmos-skip-dot">
                ·
              </span>
              Continuar a leitura ↓
            </button>
          </div>
        </div>
      </div>

      <footer className="mx-auto max-w-3xl px-6 pt-12 pb-24 sm:px-10 sm:pt-16 sm:pb-28">
        <p className="marginalia text-center sm:text-left">
          <span aria-hidden="true" className="text-terracotta mr-2">
            ·
          </span>
          {Data.sectionDisclaimer}
        </p>
        <p className="marginalia mt-3 text-center sm:text-left">
          <a
            href="/simbolos"
            className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
          >
            Para a mandala completa, com as vinte e sete nakshatras
          </a>{" "}
          <span aria-hidden="true" className="text-terracotta/70">
            →
          </span>
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

// Painted still shown when the live canvas isn't mounted yet (or WebGL is
// unavailable). Renders the same flattened prelude composite the mobile path
// uses, so the section degrades to a painted plate — never a blank dark void.
// The `.cosmos-canvas-layer` radial mask feathers its edges into the parchment.
function PosterFallback() {
  return (
    <div className="cosmos-poster-fallback" role="presentation" aria-hidden="true">
      <Image
        src={Data.preludeCompositeMobile}
        alt=""
        fill
        sizes="100vw"
        className="h-full w-full object-cover object-[center_60%]"
      />
    </div>
  );
}

// Static prelude composite for mobile + reduced-motion. The 3D prop scene is
// pre-flattened to one image by `scripts/cosmos-textures.ts` so these paths
// pay one decode instead of mounting the live canvas.
function PreludeStatic() {
  return (
    <div className="cosmos-prelude-static" aria-hidden="true">
      <Image
        src={Data.preludeCompositeMobile}
        alt=""
        width={1024}
        height={512}
        sizes="(max-width: 767px) 100vw, 90vw"
        className="cosmos-prelude-static-img"
      />
    </div>
  );
}
