"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { Cosmos } from "@/core";
import { CosmosArmillary } from "./cosmos/CosmosArmillary";
import { CosmosCameraRig } from "./cosmos/CosmosCameraRig";
import { CosmosComets } from "./cosmos/CosmosComets";
import { CosmosConstellationLines } from "./cosmos/CosmosConstellationLines";
import { CosmosDeepField } from "./cosmos/CosmosDeepField";
import { CosmosEnvProbe } from "./cosmos/CosmosEnvProbe";
import { CosmosGalaxyBand } from "./cosmos/CosmosGalaxyBand";
import { CosmosNebulae } from "./cosmos/CosmosNebulae";
import { CosmosPrelude } from "./cosmos/CosmosPrelude";
import { CosmosStarField } from "./cosmos/CosmosStarField";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

type Props = {
  progressRef: MutableRefObject<number>;
  sigilScreenPositionsRef: MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
  mobile?: boolean;
  // `false` switches the Canvas frameloop to "never" so the WebGL renderer
  // stops doing per-frame work when the section is scrolled offscreen. The
  // env-probe + nebula bake still run on mount, and the scene stays alive
  // in memory; only the per-frame tick pauses.
  visible?: boolean;
};

// Scene root. Composes the prelude → simulated universe:
//   * Painted prelude (foreground, layer 0 — only meaningful while
//     p ∈ [0.00, 0.30]; faded out elsewhere by per-prop opacity):
//       - `<CosmosPrelude>` — a sparse arrangement of discrete cut-out props
//         (clouds, land strip, trees, rocks, bush, single figure) positioned
//         in 3D between the camera and the universe. Each prop fades as the
//         camera passes its Z. The 3D nebula + deep field + comets ARE the
//         sky behind them — no painted sky layer.
//   * Background (layer 0 + layer 1 — baked into the brass armillary's
//     reflection cube map by `<CosmosEnvProbe>`):
//       - `<CosmosNebulae>` — baked FBM nebula on a textured inverted sphere.
//       - `<CosmosDeepField>` — ~4000 stars at radii 30–80, warm distribution.
//       - `<CosmosGalaxyBand>` — ~1200 stars along an inclined great-circle.
//   * Foreground (default layer 0 only — excluded from the env probe so the
//     brass doesn't reflect itself or the constellation network):
//       - `<CosmosStarField>` — preserved v3 sphere shell at radii 4–8.
//       - `<CosmosConstellationLines>` — gilt strokes + bright vertex stars
//         for ~20 real-RA/Dec constellations at radius 12; fades in mid-orbit.
//       - `<CosmosArmillary>` — PBR brass rings + emissive gilt sun.
//         Receives `progressRef` so its materials gate on
//         `armillaryOpacity(p)`: invisible through the prelude, materializing
//         across p ∈ [0.20, 0.30].
//       - `<CosmosComets>` — occasional arcing comets, dimmed during descent.
//
// v4-perf: dropped the `<pointLight>` at the sun position. The PBR rings now
// take their illumination entirely from the env-probe cube map (which already
// includes the warm nebula + galaxy band), with `envMapIntensity` bumped to
// compensate. Removes per-fragment direct-light math from every brass pixel.
//
// `mobile` swaps in a simpler scene: no scroll-driven camera, no comets, the
// foreground shell halves its count, and the env probe drops its cube
// resolution from 128 → 64. The painted prelude is also skipped on mobile —
// the static `composite-mobile.webp` above the canvas (rendered by
// `<Cosmos>`) replaces it. `visible` pauses the frame loop when offscreen.
export function CosmosCanvas({
  progressRef,
  sigilScreenPositionsRef,
  activeSigilId,
  mobile = false,
  visible = true,
}: Props) {
  return (
    <Canvas
      // Start at KEY_FAR_IN's prelude position so the first rendered frame
      // already reads as "view from the ground". The camera rig glides to
      // `cameraKeyAtProgress(p)` each frame; matching this initial position
      // eliminates the first-frame glide pop.
      camera={{ position: [0, 1.4, 25], fov: 38, near: 0.1, far: 200 }}
      // Cap DPR at 1.5 on Retina/4K so the brass + star sprites don't pay full
      // pixel-density cost. The vignette mask hides edge sharpness anyway.
      dpr={[1, 1.5]}
      // Paused when offscreen — saves the per-frame cost of the rotating
      // armillary, twinkle, comet, camera rig, and sigil projection.
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {!mobile ? <CosmosCameraRig progressRef={progressRef} /> : null}

      <CosmosEnvProbe center={[0, Cosmos.UNIVERSE_Y_OFFSET, 0]}>
        {/* Universe content — translated up to `UNIVERSE_Y_OFFSET` so the
            armillary lives in the sky rather than on the painted ground.
            The painted prelude stays at world origin; the camera rises up
            through the prelude clouds and arrives at the elevated universe. */}
        <group position={[0, Cosmos.UNIVERSE_Y_OFFSET, 0]}>
          {/* Background — layer 1 enabled so the env probe captures it. */}
          <CosmosNebulae />
          <CosmosDeepField mobile={mobile} />
          <CosmosGalaxyBand mobile={mobile} />

          {/* Foreground — layer 0 only; excluded from the env reflection. */}
          <CosmosStarField mobile={mobile} />

          {/* Constellation strokes sit between the foreground star shell
              (radii 4–8) and the deep-field stars (30–80) so they read as
              the "near sky" without being baked into the brass reflection. */}
          {!mobile ? <CosmosConstellationLines progressRef={progressRef} /> : null}

          <CosmosArmillary
            sigilScreenPositionsRef={sigilScreenPositionsRef}
            activeSigilId={activeSigilId}
            progressRef={progressRef}
          />

          {!mobile ? <CosmosComets progressRef={progressRef} /> : null}
        </group>

        {/* Painted prelude — discrete cut-out props (clouds, land, trees,
            rocks, bush, single figure) at world origin. Not translated:
            the painted ground stays at world y=0 so the camera physically
            rises up through it during the approach. */}
        {!mobile ? <CosmosPrelude progressRef={progressRef} /> : null}
      </CosmosEnvProbe>
    </Canvas>
  );
}
