"use client";

import { Canvas, type RootState } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cosmos } from "@/domain/cosmos/Cosmos";
import { type CosmosSky, proceduralSky } from "@/domain/cosmos/proceduralSky";
import { yieldToBrowser } from "@/view/general/yieldToBrowser";
import { CosmosArmillary } from "./scene/CosmosArmillary";
import { CosmosCameraRig } from "./scene/CosmosCameraRig";
import { CosmosComets } from "./scene/CosmosComets";
import { CosmosConstellationLines } from "./scene/CosmosConstellationLines";
import { CosmosDeepField } from "./scene/CosmosDeepField";
import { CosmosGalaxyBand } from "./scene/CosmosGalaxyBand";
import { CosmosNebulae } from "./scene/CosmosNebulae";
import { CosmosPrelude } from "./scene/CosmosPrelude";
import { CosmosStarField } from "./scene/CosmosStarField";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

/**
 * How many yielded steps the scene is built over. The grouping is by cost, and
 * the order is a real dependency: the armillary's one-shot matcap bake walks the
 * background through a CubeCamera, so the nebula shell, deep field and galaxy
 * band all have to be in the graph before it mounts.
 *
 *   1  camera rig, deep field, galaxy band — plain point positions, cheap
 *   2  star field — 4,000 sprites
 *   3  nebula shell — the FBM equirect bake
 *   4  armillary — rings plus the CubeCamera matcap bake
 *   5  constellation lines, comets, painted prelude
 */
const BUILD_STAGES = 5;

type Props = {
  progressRef: MutableRefObject<number>;
  sigilScreenPositionsRef: MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
  mobile?: boolean;
  // `true` once the section is both on-screen (the parent's 30% observer) AND
  // the warm-up has primed the GPU. Drives the Canvas frameloop: "always"
  // when active, "demand" otherwise.
  //
  // During warm (mounted but not yet active) the canvas sits in "demand": it
  // renders its initial frame plus a re-render as each baked texture / shader
  // arrives (uploading them), with no continuous rAF cost — so the warm work
  // lands while the canvas is still hidden behind the poster, not on the
  // visible reveal frame. After reveal, scrolling fully past flips this back
  // to "demand" so the per-frame WebGL work (rotation, twinkle, comets,
  // camera rig, sigil projection) pauses again. The nebula + matcap bakes run
  // imperatively on mount regardless; only the per-frame tick is gated.
  active?: boolean;
  // The star fields to draw. Omitted, the scene builds the procedural sky it
  // has always drawn; supplied, it draws that one instead — the seam "O céu
  // desta noite" plugs into without a rewrite (REQ-009).
  sky?: CosmosSky;
  // Fired once, after the off-screen warm-up has pre-linked the shader
  // programs (`compileAsync`) and rendered a real warm frame. The parent
  // flips `isPrimed`; combined with the 30% visibility observer that drives
  // the reveal cross-fade.
  onPrimed?: () => void;
};

// Scene root. Composes the prelude → simulated universe:
//   * Painted prelude (foreground, layer 0 — only meaningful while
//     p ∈ [0.00, 0.30]; faded out elsewhere by per-prop opacity):
//       - `<CosmosPrelude>` — a sparse arrangement of discrete cut-out props
//         (clouds, land strip, trees, rocks, bush, single figure) positioned
//         in 3D between the camera and the universe. Each prop fades as the
//         camera passes its Z. The 3D nebula + deep field + comets ARE the
//         sky behind them — no painted sky layer.
//   * Background (layer 0 + layer 1 — captured once by the armillary's
//     one-shot matcap bake, see `bakeArmillaryMatcap.ts`):
//       - `<CosmosNebulae>` — baked FBM nebula on a textured inverted sphere.
//       - `<CosmosDeepField>` — ~4000 stars at radii 30–80, warm distribution.
//       - `<CosmosGalaxyBand>` — ~1200 stars along an inclined great-circle.
//   * Foreground (default layer 0 only — excluded from the matcap bake so the
//     brass doesn't reflect itself or the constellation network):
//       - `<CosmosStarField>` — preserved v3 sphere shell at radii 4–8.
//       - `<CosmosConstellationLines>` — gilt strokes + bright vertex stars
//         for ~20 real-RA/Dec constellations at radius 12; fades in mid-orbit.
//       - `<CosmosArmillary>` — brass rings (matcap) + emissive gilt sun.
//         Receives `progressRef` so its materials gate on
//         `armillaryOpacity(p)`: invisible through the prelude, materializing
//         across p ∈ [0.20, 0.30].
//       - `<CosmosComets>` — occasional arcing comets, dimmed during descent.
//
// v5-perf: rings switched from `MeshStandardMaterial` + cube-map envMap to
// `MeshMatcapMaterial` driven by a 256² matcap baked once at mount from the
// same brass-against-universe setup. Each ring fragment is now a single texel
// fetch instead of the full Standard BRDF + cubemap-LOD sample.
//
// `mobile` swaps in a simpler scene: no scroll-driven camera, no comets, the
// foreground shell halves its count. The painted prelude is also skipped on
// mobile — the static `composite-mobile.webp` above the canvas (rendered by
// `<Cosmos>`) replaces it. `visible` pauses the frame loop when offscreen.
export function CosmosCanvas({
  progressRef,
  sigilScreenPositionsRef,
  activeSigilId,
  mobile = false,
  active = true,
  sky,
  onPrimed,
}: Props) {
  // Built here rather than in the leaf components so it only runs when the
  // canvas itself mounts, and so both fields come from one supplier.
  const drawnSky = useMemo(() => sky ?? proceduralSky({ mobile }), [sky, mobile]);

  // `onCreated` is captured once when the renderer is created, so it can't
  // close over a changing prop directly — read the latest `onPrimed` via ref.
  const onPrimedRef = useRef(onPrimed);
  useEffect(() => {
    onPrimedRef.current = onPrimed;
  }, [onPrimed]);

  // Tracks unmount so a deferred warm callback never touches a torn-down
  // renderer or sets state on an unmounted parent (the section can be
  // dismissed mid-warm via the "Continuar a leitura" button).
  const disposedRef = useRef(false);
  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
    };
  }, []);

  // How much of the scene has been committed. Building everything in one commit
  // cost a single ~685 ms main-thread task — 5,320 sprite positions, the FBM
  // nebula baked to an equirect texture, the armillary's CubeCamera matcap bake,
  // a dozen canvas-gradient sprites, then a compile over all of it. Mid-scroll
  // that block is a full second of unresponsive page.
  //
  // So the scene arrives in stages, yielding between each, and the total work is
  // unchanged while no single task is long enough to be felt. This is invisible:
  // the poster holds the screen until the parent's `isPrimed` lands, which now
  // waits for the last stage.
  const [stage, setStage] = useState<number>(0);
  // The renderer lives in state, not a ref, so the prime effect below re-runs
  // when it arrives. Whether `onCreated` fires before or after the last stage
  // commits is a race — with a ref, losing it meant the prime never ran and the
  // reveal fell through to the 5s backstop for no reason.
  const [renderer, setRenderer] = useState<RootState | null>(null);

  const handleCreated = useCallback((state: RootState) => {
    setRenderer(state);
  }, []);

  // Walk the stages, handing the thread back between each — and pre-link what
  // each stage just added before moving on.
  //
  // Compiling per stage rather than once at the end is what keeps the pre-link
  // from becoming its own long task. `compile()` walks the whole scene, but
  // three caches programs, so each call only does real work for the materials
  // that stage introduced; the sum is the same pre-link, split across the yields
  // the build was already taking. On a software rasteriser, where the pre-link
  // dominates everything else here, that is the difference between one ~480 ms
  // block and five short ones.
  useEffect(() => {
    if (stage >= BUILD_STAGES) return;
    const controller = new AbortController();
    yieldToBrowser(controller.signal).then(() => {
      if (controller.signal.aborted || disposedRef.current) return;
      if (renderer && stage > 0) renderer.gl.compile(renderer.scene, renderer.camera);
      if (controller.signal.aborted || disposedRef.current) return;
      setStage((s) => Math.min(BUILD_STAGES, s + 1));
    });
    return () => controller.abort();
  }, [stage, renderer]);

  // Prime once the graph is complete — not one frame after context creation, as
  // before, because the later stages' materials would not exist yet to compile.
  useEffect(() => {
    if (stage < BUILD_STAGES || !renderer) return;
    const state = renderer;

    let cancelled = false;

    // One more frame so the last stage's children have committed, then a final
    // pre-link pass to catch them and anything that arrived late — the armillary's
    // baked matcap, the prelude's textured props.
    //
    // Note what is deliberately *not* here: `compileAsync`. It is only truly
    // asynchronous where KHR_parallel_shader_compile exists, and where it does
    // not, three polls each material's program for readiness — reading
    // `material.program.isReady()` on materials that have none yet, which throws
    // inside its own timer. The promise then settles neither way and the reveal
    // hangs until the parent's backstop fires seconds later. (Reproduced on
    // SwiftShader, which reports the extension missing.) The synchronous
    // `compile()` has no such path, and by now most of the work is already done
    // stage by stage, so there is nothing left to win by going async.
    const raf = requestAnimationFrame(() => {
      if (cancelled || disposedRef.current) return;
      state.gl.compile(state.scene, state.camera);
      // Under frameloop="demand" during warm — invalidate once so the freshly
      // linked programs draw and the baked textures upload here, off the
      // (still-hidden) reveal frame.
      state.invalidate();
      onPrimedRef.current?.();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [stage, renderer]);

  return (
    <Canvas
      onCreated={handleCreated}
      // Start at KEY_FAR_IN's prelude position so the first rendered frame
      // already reads as "view from the ground". The camera rig glides to
      // `cameraKeyAtProgress(p)` each frame; matching this initial position
      // eliminates the first-frame glide pop.
      camera={{ position: [0, 1.4, 25], fov: 38, near: 0.1, far: 200 }}
      // DPR pinned to 1 — the scroll-cinema is fillrate-bound (thousands of
      // soft alpha-blended star sprites) and fill scales with DPR². At 1.25
      // every sprite covered ~1.56× more fragments; pinning to 1 removes that
      // overdraw on HiDPI/Retina. The vignette + matcap + soft sprites keep the
      // WebGL layer reading as painterly rather than soft (DOM text and sigils
      // are unaffected — they render at the device's native DPR).
      dpr={1}
      // "always" only once revealed; "demand" during warm (renders the initial
      // frame + texture/shader uploads with no continuous rAF) and again once
      // scrolled fully past (pauses the rotating armillary, twinkle, comets,
      // camera rig, and sigil projection).
      frameloop={active ? "always" : "demand"}
      gl={{
        // MSAA off — it resolves every fragment of every alpha-blended sprite
        // across multiple samples, multiplying the (already heavy) sprite
        // overdraw fill cost ~1.5–2×. The scene is soft sprites + matcap brass
        // with little hard geometric edge to alias, and the radial vignette
        // feathers the canvas edge — so this is the single biggest fill cut for
        // the scroll stutter at the smallest visual cost (slightly softer gilt
        // constellation lines + ring silhouettes).
        antialias: false,
        alpha: true,
        // "high-performance" so dual-GPU laptops bind the WebGL context to the
        // discrete GPU. The scroll-cinema is fillrate-bound (thousands of soft
        // alpha-blended star sprites), so "low-power" — which forces the weak
        // integrated GPU — was the worst case for it and a prime stutter cause.
        // The frameloop is "demand" when idle, so the dGPU only spins up during
        // the brief reveal/scroll window, not for the whole visit.
        powerPreference: "high-performance",
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {!mobile && stage >= 1 ? <CosmosCameraRig progressRef={progressRef} /> : null}

      {/* Universe content — translated up to `UNIVERSE_Y_OFFSET` so the
          armillary lives in the sky rather than on the painted ground.
          The painted prelude stays at world origin; the camera rises up
          through the prelude clouds and arrives at the elevated universe. */}
      <group position={[0, Cosmos.UNIVERSE_Y_OFFSET, 0]}>
        {/* Background — layer 1 enabled so the armillary's one-shot matcap
            bake captures it. Both of these precede the armillary's stage
            because that bake reads them. */}
        {stage >= 3 ? <CosmosNebulae /> : null}
        {stage >= 1 ? <CosmosDeepField field={drawnSky.deepField} /> : null}
        {stage >= 1 ? <CosmosGalaxyBand field={drawnSky.galaxyBand} /> : null}

        {/* Foreground — layer 0 only; excluded from the matcap bake. */}
        {stage >= 2 ? <CosmosStarField mobile={mobile} /> : null}

        {/* Constellation strokes sit between the foreground star shell
            (radii 4–8) and the deep-field stars (30–80) so they read as
            the "near sky" without being baked into the brass reflection. */}
        {!mobile && stage >= 5 ? <CosmosConstellationLines progressRef={progressRef} /> : null}

        {stage >= 4 ? (
          <CosmosArmillary
            sigilScreenPositionsRef={sigilScreenPositionsRef}
            activeSigilId={activeSigilId}
            progressRef={progressRef}
          />
        ) : null}

        {!mobile && stage >= 5 ? <CosmosComets progressRef={progressRef} /> : null}
      </group>

      {/* Painted prelude — discrete cut-out props (clouds, land, trees,
          rocks, bush, single figure) at world origin. Not translated:
          the painted ground stays at world y=0 so the camera physically
          rises up through it during the approach. */}
      {!mobile && stage >= 5 ? <CosmosPrelude progressRef={progressRef} /> : null}
    </Canvas>
  );
}
