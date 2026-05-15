"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { Cosmos } from "@/core";
import { CosmosArmillary } from "./cosmos/CosmosArmillary";
import { CosmosCameraRig } from "./cosmos/CosmosCameraRig";
import { CosmosComets } from "./cosmos/CosmosComets";
import { CosmosDeepField } from "./cosmos/CosmosDeepField";
import { CosmosEnvProbe } from "./cosmos/CosmosEnvProbe";
import { CosmosGalaxyBand } from "./cosmos/CosmosGalaxyBand";
import { CosmosNebulae } from "./cosmos/CosmosNebulae";
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

// Scene root. Composes the v4 simulated universe:
//   * Background (layer 0 + layer 1 — baked into the brass armillary's
//     reflection cube map by `<CosmosEnvProbe>`):
//       - `<CosmosNebulae>` — baked FBM nebula on a textured inverted sphere.
//       - `<CosmosDeepField>` — ~4000 stars at radii 30–80, warm distribution.
//       - `<CosmosGalaxyBand>` — ~1200 stars along an inclined great-circle.
//   * Foreground (default layer 0 only — excluded from the env probe so the
//     brass doesn't reflect itself):
//       - `<CosmosStarField>` — preserved v3 sphere shell at radii 4–8.
//       - `<CosmosArmillary>` — PBR brass rings + emissive gilt sun.
//       - `<CosmosComets>` — occasional arcing comets.
//
// v4-perf: dropped the `<pointLight>` at the sun position. The PBR rings now
// take their illumination entirely from the env-probe cube map (which already
// includes the warm nebula + galaxy band), with `envMapIntensity` bumped to
// compensate. Removes per-fragment direct-light math from every brass pixel.
//
// `mobile` swaps in a simpler scene: no scroll-driven camera, no comets, the
// foreground shell halves its count, and the env probe drops its cube
// resolution from 128 → 64. `visible` pauses the frame loop when the section
// is offscreen.
export function CosmosCanvas({
  progressRef,
  sigilScreenPositionsRef,
  activeSigilId,
  mobile = false,
  visible = true,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 8.4], fov: 38, near: 0.1, far: 200 }}
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

      <CosmosEnvProbe mobile={mobile}>
        {/* Background — layer 1 enabled so the env probe captures it. */}
        <CosmosNebulae />
        <CosmosDeepField mobile={mobile} />
        <CosmosGalaxyBand mobile={mobile} />

        {/* Foreground — layer 0 only; excluded from the env reflection. */}
        <CosmosStarField mobile={mobile} />

        <CosmosArmillary
          sigilScreenPositionsRef={sigilScreenPositionsRef}
          activeSigilId={activeSigilId}
        />

        {!mobile ? <CosmosComets /> : null}
      </CosmosEnvProbe>
    </Canvas>
  );
}
