"use client";

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/domain/cosmos/Cosmos";
import type { StarField } from "@/domain/cosmos/StarField";
import { getStarSprite } from "./spriteTextures";
import { useCosmosFill } from "@/view/cosmos/hooks/useCosmosFill";

// The warm river across the sky: stars concentrated along an inclined
// great-circle plane, drawn from a warmer-skewed palette than the deep field.
//
// Like the deep field, the stars arrive as data (TASK-034); where they come
// from is `src/domain/cosmos/`'s business, not this component's.
export function CosmosGalaxyBand({ field }: { field: StarField }) {
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
        size={Cosmos.galaxyBand.size}
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={fill.alphaTest}
        opacity={1.0}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
