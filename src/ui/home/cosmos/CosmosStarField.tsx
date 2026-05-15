"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { getStarSprite } from "./spriteTextures";

type Props = {
  mobile?: boolean;
};

// A single spherical shell of small, crisp painted dots distributed uniformly
// around the camera at radii 4–8 world units — in front of the dome at ~90.
// Replaces v2's three Z-plane parallax layers (which left the back hemisphere
// blank when the camera rotated). About 10% of the points are larger gilt
// accents; the rest are cream-warm ink. A slow per-material opacity sine
// gives the field a quiet twinkle without paying per-vertex shader cost.
export function CosmosStarField({ mobile = false }: Props) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const accentMaterialRef = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sprite = useMemo(() => getStarSprite(), []);

  // Split the deterministic shell into two buffer geometries: cream-warm ink
  // (common) and gilt accents (rare, slightly larger). Each uses its own
  // `pointsMaterial` with a distinct base size so the rare accents are
  // visibly different without per-vertex size shaders.
  const { commonPositions, commonSizesAvg, accentPositions, accentSizesAvg } = useMemo(() => {
    const all = Cosmos.starShellPoints;
    // On mobile, halve the shell density for fillrate. Take every other point.
    const used = mobile ? all.filter((_, i) => i % 2 === 0) : all;

    const common = used.filter((p) => !p.accent);
    const accent = used.filter((p) => p.accent);

    const flatten = (pts: ReadonlyArray<Cosmos.StarShellPoint>): Float32Array => {
      const arr = new Float32Array(pts.length * 3);
      for (let i = 0; i < pts.length; i++) {
        arr[i * 3 + 0] = pts[i].pos[0];
        arr[i * 3 + 1] = pts[i].pos[1];
        arr[i * 3 + 2] = pts[i].pos[2];
      }
      return arr;
    };

    const avgSize = (pts: ReadonlyArray<Cosmos.StarShellPoint>): number =>
      pts.length === 0 ? 0.05 : pts.reduce((s, p) => s + p.size, 0) / pts.length;

    return {
      commonPositions: flatten(common),
      commonSizesAvg: avgSize(common),
      accentPositions: flatten(accent),
      accentSizesAvg: avgSize(accent) * 1.35, // accents read clearly larger
    };
  }, [mobile]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Slow twinkle on the whole shell — one sine for common stars, a
    // phase-shifted sine for accents so the gilt dots don't pulse in lockstep
    // with the cream ones.
    if (materialRef.current) {
      materialRef.current.opacity = 0.88 + 0.1 * Math.sin(t * 0.55);
    }
    if (accentMaterialRef.current) {
      accentMaterialRef.current.opacity = 0.92 + 0.08 * Math.sin(t * 0.55 + 1.7);
    }
    if (groupRef.current) {
      // A very faint drift so the field isn't dead-static — well below the
      // threshold of conscious perception but enough to feel alive.
      groupRef.current.position.x = Math.sin(t * 0.04) * 0.01;
      groupRef.current.position.y = Math.cos(t * 0.05) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[commonPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          map={sprite ?? undefined}
          // Cream-warm ink dot — bright core, quick falloff. The sprite's own
          // rgba supplies the warmth; this base colour just modulates value.
          color="#fff0dc"
          size={commonSizesAvg}
          sizeAttenuation
          transparent
          alphaTest={0.02}
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      {accentPositions.length > 0 ? (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[accentPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={accentMaterialRef}
            map={sprite ?? undefined}
            // Gilt accent — slightly more saturated warm.
            color="#f5d782"
            size={accentSizesAvg}
            sizeAttenuation
            transparent
            alphaTest={0.02}
            opacity={0.95}
            depthWrite={false}
          />
        </points>
      ) : null}
    </group>
  );
}
