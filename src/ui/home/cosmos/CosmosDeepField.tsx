"use client";

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { getStarSprite } from "./spriteTextures";

type Props = {
  mobile?: boolean;
};

// ~4000 procedural stars distributed on a thick spherical shell at radii
// 30–80. Per-vertex colour sampled from a warm distribution (mostly cream +
// gilt, rare terracotta and cool blue-white) so the field reads as the v4
// "real universe" replacement for v3's painted dome. Renders on the default
// layer 0 + the env-probe's layer 1.
//
// Mobile halves the count for fillrate.
export function CosmosDeepField({ mobile = false }: Props) {
  const { positions, colors, count } = useMemo(() => {
    const total = Math.floor(Cosmos.deepField.count * (mobile ? 0.5 : 1));
    const pos = new Float32Array(total * 3);
    const col = new Float32Array(total * 3);
    const rng = Cosmos.mulberry32(0xdeefe1d);

    // Cumulative-weight palette pick. Each entry's `weight` is a slice of the
    // [0, 1] interval; whichever the RNG lands in supplies the per-vertex RGB.
    const palette = Cosmos.deepField.palette;
    const stops: Array<readonly [number, readonly [number, number, number]]> = [];
    let acc = 0;
    for (const k of ["cream", "gilt", "terracotta", "coolBlue"] as const) {
      acc += palette[k].weight;
      stops.push([acc, palette[k].rgb]);
    }

    for (let i = 0; i < total; i++) {
      const radius = Cosmos.lerp(Cosmos.deepField.radiusMin, Cosmos.deepField.radiusMax, rng());
      const p = Cosmos.sampleOnSphere(rng, radius);
      pos[i * 3 + 0] = p[0];
      pos[i * 3 + 1] = p[1];
      pos[i * 3 + 2] = p[2];

      const r = rng();
      let rgb = stops[stops.length - 1][1];
      for (const [stop, val] of stops) {
        if (r < stop) {
          rgb = val;
          break;
        }
      }
      // Per-star brightness jitter so the field doesn't read as uniform value.
      const j = 0.7 + rng() * 0.3;
      col[i * 3 + 0] = rgb[0] * j;
      col[i * 3 + 1] = rgb[1] * j;
      col[i * 3 + 2] = rgb[2] * j;
    }

    return { positions: pos, colors: col, count: total };
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
        size={Cosmos.deepField.size}
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={0.02}
        opacity={0.95}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
