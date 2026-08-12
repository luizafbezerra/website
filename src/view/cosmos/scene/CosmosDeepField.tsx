"use client";

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/domain/cosmos/Cosmos";
import type { StarField } from "@/domain/cosmos/StarField";
import { getStarSprite } from "./spriteTextures";
import { useCosmosFill } from "@/view/cosmos/hooks/useCosmosFill";

// The textured sky: stars on a thick spherical shell at radii 30–80, drawn from
// a warm distribution (mostly cream + gilt, rare terracotta and cool blue-white).
// Renders on the default layer 0 + the env-probe's layer 1.
//
// The field itself arrives as data (TASK-034) — this component draws whatever
// sky it is handed. `proceduralSky` supplies the default; "O céu desta noite"
// will supply the real one without touching this file.
export function CosmosDeepField({ field }: { field: StarField }) {
  const sprite = useMemo(() => getStarSprite(), []);
  const fill = useCosmosFill();

  const setLayers = useCallback((points: THREE.Points | null) => {
    if (points) points.layers.enable(1);
  }, []);

  return (
    <points ref={setLayers} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[field.positions, 3]}
          count={field.count}
        />
        <bufferAttribute attach="attributes-color" args={[field.colors, 3]} count={field.count} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite ?? undefined}
        size={Cosmos.deepField.size}
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={fill.alphaTest}
        opacity={0.95}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
