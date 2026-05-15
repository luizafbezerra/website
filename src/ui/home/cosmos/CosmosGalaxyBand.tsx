"use client";

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { getStarSprite } from "./spriteTextures";

type Props = {
  mobile?: boolean;
};

// ~1200 stars concentrated along an inclined great-circle plane (≈15° to the
// y-axis). Drawn from a warmer-skewed palette than the deep field so the
// galaxy band reads as a "warm river" sweeping across the cosmos. Sampled by
// rejection: take uniform-on-sphere points, keep only those within ±12° of
// the chosen plane.
export function CosmosGalaxyBand({ mobile = false }: Props) {
  const { positions, colors, count } = useMemo(() => {
    const total = Math.floor(Cosmos.galaxyBand.count * (mobile ? 0.5 : 1));
    const pos = new Float32Array(total * 3);
    const col = new Float32Array(total * 3);
    const rng = Cosmos.mulberry32(0xba9ad);

    const normalUnnorm = Cosmos.galaxyBand.planeNormal;
    const nLen = Math.hypot(normalUnnorm[0], normalUnnorm[1], normalUnnorm[2]);
    const n: [number, number, number] = [
      normalUnnorm[0] / nLen,
      normalUnnorm[1] / nLen,
      normalUnnorm[2] / nLen,
    ];
    const halfWidth = Math.sin((Cosmos.galaxyBand.halfWidthDeg * Math.PI) / 180);

    const palette = Cosmos.galaxyBand.palette;
    const stops: Array<readonly [number, readonly [number, number, number]]> = [];
    let acc = 0;
    for (const k of ["cream", "gilt", "terracotta"] as const) {
      acc += palette[k].weight;
      stops.push([acc, palette[k].rgb]);
    }

    let filled = 0;
    let attempts = 0;
    while (filled < total && attempts < total * 50) {
      attempts++;
      const radius = Cosmos.lerp(Cosmos.galaxyBand.radiusMin, Cosmos.galaxyBand.radiusMax, rng());
      const p = Cosmos.sampleOnSphere(rng, radius);
      // Distance from the plane through origin with normal n, divided by
      // radius → equivalent to sin(latitude relative to that plane).
      const dotN = Math.abs(p[0] * n[0] + p[1] * n[1] + p[2] * n[2]) / radius;
      if (dotN > halfWidth) continue;

      pos[filled * 3 + 0] = p[0];
      pos[filled * 3 + 1] = p[1];
      pos[filled * 3 + 2] = p[2];

      const r = rng();
      let rgb = stops[stops.length - 1][1];
      for (const [stop, val] of stops) {
        if (r < stop) {
          rgb = val;
          break;
        }
      }
      const j = 0.75 + rng() * 0.3;
      col[filled * 3 + 0] = rgb[0] * j;
      col[filled * 3 + 1] = rgb[1] * j;
      col[filled * 3 + 2] = rgb[2] * j;
      filled++;
    }

    return { positions: pos, colors: col, count: filled };
  }, [mobile]);

  const sprite = useMemo(() => getStarSprite(), []);

  const setLayers = useCallback((p: THREE.Points | null) => {
    if (p) p.layers.enable(1);
  }, []);

  return (
    <points ref={setLayers} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite ?? undefined}
        size={Cosmos.galaxyBand.size}
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={0.02}
        opacity={1.0}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
