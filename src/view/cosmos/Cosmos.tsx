"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cosmos as Data } from "@/domain/cosmos/Cosmos";
import type { CosmosSky } from "@/domain/cosmos/proceduralSky";
import { useCosmosShow } from "@/view/cosmos/hooks/useCosmosShow";
import { useAfterPageSettled } from "@/view/general/useAfterPageSettled";
import { cn } from "@/view/styling/cn";
import type { SigilScreenPosition } from "./CosmosCanvas";
import { CosmosMarginalia } from "./CosmosMarginalia";
import { CosmosSigilOverlay } from "./scene/CosmosSigilOverlay";

// Keep the `import()` literal and inline inside `dynamic()`. Hoisting it into a
// shared helper reads better but breaks the lazy boundary: the bundler stops
// recognising the call as a code-split point and emits the chunk as a preload in
// the document head, so three.js downloads during the initial page load — the
// exact cost this section is arranged to avoid.
//
// The warm below re-states the same specifier for the same reason. Two literals
// resolving one chunk, deliberately.
const CosmosCanvas = dynamic(() => import("./CosmosCanvas").then((m) => m.CosmosCanvas), {
  ssr: false,
  loading: () => null,
});

const SIGIL_COUNT = 12;

/**
 * Whether the in-cosmos "Continuar a leitura ↓" button is rendered.
 *
 * Off by choice, not because the affordance stopped working: the whole wiring
 * below it — `dismiss`, the scroll-position snapshot, the footer's restore
 * control — is untouched and still correct. Flip this to `true` to bring the
 * button back; nothing else needs changing.
 *
 * Deliberately a constant rather than a CMS field. It is a decision about the
 * page's composition, not copy she should be asked to maintain, and a field
 * nobody edits is a field that reads as an unanswered question in the admin.
 *
 * The cost, worth knowing before flipping it back: with the button gone the
 * only way past the cinema is to scroll its 375vh pin, roughly four screens.
 * That is a bounded chore rather than a trap, and it applies to desktop
 * pointer users alone — the pin collapses under `prefers-reduced-motion` and
 * does not exist at all below 767px.
 */
const SHOW_SKIP_AFFORDANCE = false;

const initialSigilPositions = (): SigilScreenPosition[] =>
  Array.from({ length: SIGIL_COUNT }, () => ({ x: 0.5, y: 0.5, visible: false }));

/**
 * Pulls everything the scene needs into memory, without mounting or drawing
 * anything: the canvas chunk (three.js + fiber + the scene modules, ~585 KB
 * encoded) and the painted-prelude plates plus the brushed-brass roughness map.
 *
 * Idempotent and module-scoped, because two independent triggers race for it —
 * the page going idle and the reader approaching the section — and whichever
 * arrives first should make the second free. `import()` is already idempotent;
 * `warmTextures` funnels through the texture cache, which is too.
 *
 * Evaluating three.js costs a task. Spending it here is the whole point: the
 * alternative is spending it mid-scroll, which is what the reader feels.
 *
 * The 12 sigils stay out of this — they are popover-only, and a reader who
 * never hovers a sigil should never pay their 433 KB.
 */
function warmCosmosAssets(): void {
  void import("./CosmosCanvas");
  // Reached dynamically, never statically: `useOptionalTexture` imports three,
  // so a top-level import of it here would drag three.js into this module's
  // graph — and this module is in the page's eager bundle. That mistake is
  // invisible in the source and obvious in the network panel, where three_core
  // turns up as an async <script> in the initial document.
  void import("./scene/useOptionalTexture").then((m) => m.warmTextures(Data.warmupTextureUrls));
}

// Gate. Renders nothing when the visitor has opted out via the in-cosmos
// "Continuar a leitura" button or the footer toggle. Wrapping the heavy
// body in its own component lets it mount/unmount cleanly when the
// preference flips — IntersectionObservers and scroll listeners inside the
// body get torn down + reattached to the fresh section element instead of
// leaking onto a detached node.
//
// On the true → false transition, after the body unmounts, we scroll the
// visitor to wherever the cinema began — a document Y captured before the
// unmount — so they land on whatever section now follows it (the order is
// CMS-driven) instead of being left at the top of the page or sent past
// content. Capturing a position rather than a hardcoded anchor keeps this
// correct no matter how sections are ordered or which optional ones are present.
export type CosmosProps = {
  /**
   * The sky to draw. Omitted, the scene builds its own procedural universe; a
   * supplied field is what "O céu desta noite" will hand it (REQ-009).
   */
  sky?: CosmosSky;
};

export function Cosmos({ sky }: CosmosProps = {}) {
  const [show, setShow] = useCosmosShow();
  const prevShowRef = useRef<boolean>(show);
  const dismissYRef = useRef<number | null>(null);

  // Snapshot the cinema's document position the moment the reader dismisses it,
  // before React unmounts the section on the next render.
  const dismiss = useCallback(() => {
    const el = document.getElementById(Data.sectionAnchorId);
    dismissYRef.current = el ? el.getBoundingClientRect().top + window.scrollY : null;
    setShow(false);
  }, [setShow]);

  useEffect(() => {
    if (prevShowRef.current && !show && dismissYRef.current != null) {
      const padTop = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.max(0, dismissYRef.current - padTop),
        behavior: reduced ? "auto" : "smooth",
      });
      dismissYRef.current = null;
    }
    prevShowRef.current = show;
  }, [show]);

  if (!show) return null;
  return <CosmosBody onDismissForever={dismiss} sky={sky} />;
}

function CosmosBody({ onDismissForever, sky }: CosmosProps & { onDismissForever: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const sigilScreenPositionsRef = useRef<SigilScreenPosition[]>(initialSigilPositions());

  const [mountCanvas, setMountCanvas] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeSigil, setActiveSigil] = useState<Data.SigilId | null>(null);
  // Tracks the section's current intersection with the 30%-expanded viewport.
  // Combined with `isPrimed` it forms the reveal trigger AND drives the Canvas
  // frameloop (per-frame WebGL work pauses once the section is scrolled past).
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Set once the off-screen warm-up (shader compile + first warm frame +
  // texture uploads) reports back via `handlePrimed` — or the fallback timeout
  // fires. Until then the painted poster holds the screen; the reveal
  // cross-fade waits for both this and `isVisible`.
  const [isPrimed, setIsPrimed] = useState<boolean>(false);
  // True once the document's own load has settled and the thread has gone idle —
  // the earliest point at which warming the cosmos costs the reader nothing.
  const pageSettled = useAfterPageSettled();

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

  // Three IntersectionObservers, staging the approach so no single moment pays
  // for the whole scene:
  //
  //   * PREFETCH (250% above): pulls the canvas chunk and the painted plates
  //     into memory about three screens out. Network and module evaluation
  //     only — nothing mounts, nothing draws.
  //   * MOUNT (60%): sets `mountCanvas`, so the canvas mounts hidden at
  //     opacity:0 behind the poster and stages its bakes + shader compile.
  //     Never unset — once warmed, the scene stays alive in memory. This used
  //     to sit at 120% because it had a download to hide; with the chunk and
  //     textures already resident it no longer does.
  //   * REVEAL (30%): tracks current intersection into `isVisible`. Combined
  //     with `isPrimed` this triggers the cross-fade AND drives the Canvas
  //     frameloop (per-frame work pauses once scrolled fully past).
  //
  // None run for reduced-motion / mobile — those paths keep the static
  // composite + StaticSigilWheel and never mount the canvas.
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const el = sectionRef.current;
    if (!el) return;

    const prefetch = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        prefetch.disconnect();
        warmCosmosAssets();
      },
      // Bottom side only — `rootMargin` is top/right/bottom/left, and the
      // section is below the reader on the way down, so it is the bottom edge
      // that has to reach for it. A reader arriving from above needs no reach:
      // they are already at the section and the mount observer fires anyway.
      { rootMargin: "0px 0px 250% 0px", threshold: 0 },
    );
    const mount = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setMountCanvas(true);
      },
      { rootMargin: "60% 0px 60% 0px", threshold: 0 },
    );
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "30% 0px 30% 0px", threshold: 0 },
    );
    prefetch.observe(el);
    mount.observe(el);
    reveal.observe(el);
    return () => {
      prefetch.disconnect();
      mount.disconnect();
      reveal.disconnect();
    };
  }, [reducedMotion, isMobile]);

  // Speculative warm, once the page has finished its own load and gone quiet.
  //
  // This used to be a bare `requestIdleCallback`, which fired a few hundred
  // milliseconds after hydration and put a megabyte of painted prelude on the
  // wire while the hero portrait and the Instagram tiles were still arriving —
  // for a section six thousand pixels down the page. `useAfterPageSettled`
  // waits for `load` first, so the cosmos never competes with what the visitor
  // is actually looking at.
  //
  // A reader who scrolls faster than the page settles is covered by the
  // prefetch observer above; whichever fires first wins and the other is a
  // no-op, because both funnel through the same idempotent warm.
  useEffect(() => {
    if (reducedMotion || isMobile || !pageSettled) return;
    warmCosmosAssets();
  }, [reducedMotion, isMobile, pageSettled]);

  // Fallback prime. If the off-screen warm-up never reports back — a device
  // without KHR_parallel_shader_compile where `compileAsync` stalls, a
  // backgrounded tab throttling rAF, a thrown compile — prime anyway a few
  // seconds after the canvas mounts so the reveal gate never hangs. The warm
  // work has had ample time by then.
  //
  // Five seconds rather than three and a half: the scene now builds across
  // several yielded stages, and on a slow device that staging must be allowed
  // to finish rather than be cut off mid-way by the backstop.
  useEffect(() => {
    if (reducedMotion || isMobile || !mountCanvas || isPrimed) return;
    const timer = setTimeout(() => setIsPrimed(true), 5000);
    return () => clearTimeout(timer);
  }, [reducedMotion, isMobile, mountCanvas, isPrimed]);

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
  const handlePrimed = useCallback(() => setIsPrimed(true), []);

  // Mobile + reduced-motion both flow through the flat layout that
  // `.cosmos-reduced` styles supply; the canvas never mounts in either case.
  const isFlatFlow = reducedMotion || isMobile;

  // Warm: the canvas is mounted (hidden behind the poster) and priming.
  const warmCanvas = mountCanvas && !isFlatFlow;
  // Reveal: the section is on-screen AND the warm-up has primed the GPU.
  // Drives the cross-fade (poster out, canvas in), the live-overlay swap, and
  // the Canvas frameloop ("always" only here).
  const revealed = warmCanvas && isVisible && isPrimed;

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
      {/* Padding outside the measure, like PageSection — with the px inside
          `max-w-3xl` this column sat 40px right of every other section's
          reading edge, the one place the page's funnel of widths wobbled. */}
      <header className="px-6 pt-24 pb-10 sm:px-10 sm:pt-28 sm:pb-14">
        <div className="mx-auto w-full max-w-3xl">
          <p className="tracked mb-5 text-center sm:text-left">{Data.sectionEyebrow}</p>
          <h2 className="display text-foreground text-balance text-[clamp(1.95rem,3.8vw,2.75rem)] leading-[1.13] tracking-[-0.008em]">
            {Data.sectionTitle}
          </h2>
          <p className="body-italic text-ink-soft mt-7 max-w-[58ch] text-[1.06rem] leading-[1.7]">
            {Data.sectionDek}
          </p>
        </div>
      </header>

      {/* Painted prelude flattened to a single image for mobile + reduced-
          motion paths (where the 3D scroll cinema is skipped). Decorative —
          the sigil wheel and live marginalia below carry the section's
          interactive content. */}
      {isMobile || reducedMotion ? <PreludeStatic /> : null}

      <div ref={pinnedRef} className="cosmos-pinned">
        <div className="cosmos-sticky">
          <div
            className={cn("cosmos-canvas-layer", revealed && "cosmos-revealed")}
            aria-hidden="true"
          >
            {/* Live canvas — mounted ~1 viewport early at opacity:0 behind the
                poster so its bakes + shader compile + texture uploads run
                off-screen. The `.cosmos-revealed` cross-fade brings it in once
                primed + visible; until then it stays hidden but at real layout
                size (a 0×0 / display:none canvas would break the bakes). */}
            {warmCanvas ? (
              <div className="cosmos-canvas-live">
                <CosmosCanvas
                  progressRef={progressRef}
                  sigilScreenPositionsRef={sigilScreenPositionsRef}
                  activeSigilId={activeSigil}
                  mobile={isMobile}
                  active={revealed}
                  sky={sky}
                  onPrimed={handlePrimed}
                />
              </div>
            ) : null}

            {/* Painted plate. Holds the screen through the warm-up, cross-fades
                out on reveal, and stays the standing fallback if the canvas
                never mounts (or never primes). */}
            <PosterFallback />
          </div>

          {revealed ? (
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
          {!revealed ? (
            <div className="cosmos-marginalia-frame">
              <CosmosMarginalia activeSigilId={activeSigil} />
            </div>
          ) : null}

          {/* Epigraph for the descent beat. Hidden through the orbit phase,
              fades in alongside the FBM cloud planes inside the canvas
              (same --cosmos-descent-opacity window). Bottom-left of the
              sticky frame; closes the section with a single analytical-psychology line
              under the dense constellation network. Copy is a placeholder
              for Luiza's review before publish. */}
          {revealed ? (
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

          {/* Skip affordance, behind `SHOW_SKIP_AFFORDANCE`. Mirrors the epigraph
              at bottom-right but lives outside the descent-beat opacity envelope
              so it stays available from the moment the scene mounts. Click
              unmounts cosmos for the rest of this visit; the footer toggle
              brings it back. */}
          {SHOW_SKIP_AFFORDANCE && (
            <div className="cosmos-skip">
              <button type="button" className="cosmos-skip-cta" onClick={onDismissForever}>
                <span aria-hidden="true" className="cosmos-skip-dot">
                  ·
                </span>
                Continuar a leitura ↓
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="px-6 pt-12 pb-24 sm:px-10 sm:pt-16 sm:pb-28">
        <p className="marginalia mx-auto w-full max-w-3xl text-center sm:text-left">
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
