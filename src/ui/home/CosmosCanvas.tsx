"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { Cosmos } from "@/core";
import { CosmosArmillary } from "./cosmos/CosmosArmillary";
import { CosmosCameraRig } from "./cosmos/CosmosCameraRig";
import { CosmosComets } from "./cosmos/CosmosComets";
import { CosmosMilkyWay } from "./cosmos/CosmosMilkyWay";
import { CosmosNebulae } from "./cosmos/CosmosNebulae";
import { CosmosStarField } from "./cosmos/CosmosStarField";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

type Props = {
  progressRef: MutableRefObject<number>;
  sigilScreenPositionsRef: MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
  mobile?: boolean;
};

// Scene root. Owns the WebGL canvas, the perspective camera, and composes the
// painted cosmos: armillary at centre, parallax star field, sparse atmosphere.
//
// `mobile` swaps in a simpler scene: no scroll-driven camera, no comets, no
// nebulae, no near-layer stars — keeping the same brass armillary + Milky Way
// + mid/far stars + sigil overlay (handled outside the canvas).
export function CosmosCanvas({
  progressRef,
  sigilScreenPositionsRef,
  activeSigilId,
  mobile = false,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 7.6], fov: 38, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
        // Premultiplied alpha keeps additive blending honest against the
        // transparent canvas, so nebulae and comet tails don't dirty the
        // parchment ground when they pass over.
        premultipliedAlpha: true,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {!mobile ? <CosmosCameraRig progressRef={progressRef} /> : null}

      <CosmosMilkyWay />
      <CosmosStarField mobile={mobile} />
      {!mobile ? <CosmosNebulae /> : null}

      <CosmosArmillary
        sigilScreenPositionsRef={sigilScreenPositionsRef}
        activeSigilId={activeSigilId}
      />

      {!mobile ? <CosmosComets /> : null}
    </Canvas>
  );
}
