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
};

// Scene root. Composes the v4 simulated universe:
//   * Background (layer 0 + layer 1 — baked into the brass armillary's
//     reflection cube map by `<CosmosEnvProbe>`):
//       - `<CosmosNebulae>` — shader-driven inverted sphere at radius 100.
//       - `<CosmosDeepField>` — ~4000 stars at radii 30–80, warm distribution.
//       - `<CosmosGalaxyBand>` — ~1200 stars along an inclined great-circle.
//   * Foreground (default layer 0 only — excluded from the env probe so the
//     brass doesn't reflect itself):
//       - `<CosmosStarField>` — preserved v3 sphere shell at radii 4–8.
//       - `<CosmosArmillary>` — PBR brass rings + emissive gilt sun.
//       - `<CosmosComets>` — occasional arcing comets.
//   * A real `<pointLight>` at the sun's position so the brass takes diffuse
//     + specular illumination from the centre (the emissive sun mesh is
//     unaffected; the light handles the rings' physical lighting).
//
// `mobile` swaps in a simpler scene: no scroll-driven camera, no comets, the
// foreground shell halves its count, and the env probe drops its cube
// resolution from 128 → 64.
export function CosmosCanvas({
  progressRef,
  sigilScreenPositionsRef,
  activeSigilId,
  mobile = false,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 8.4], fov: 38, near: 0.1, far: 200 }}
      dpr={[1, 2]}
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

        {/* Warm gilt point light at the sun position. Drives the rings'
            diffuse + specular response (the sun mesh itself is emissive). */}
        <pointLight position={[0, 0, 0]} color="#f5d782" intensity={3} distance={6} decay={2} />

        <CosmosArmillary
          sigilScreenPositionsRef={sigilScreenPositionsRef}
          activeSigilId={activeSigilId}
        />

        {!mobile ? <CosmosComets /> : null}
      </CosmosEnvProbe>
    </Canvas>
  );
}
