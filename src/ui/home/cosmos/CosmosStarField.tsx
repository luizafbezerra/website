"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { getStarSprite } from "./spriteTextures";

type Props = {
  mobile?: boolean;
};

// Three parallax layers of painted ink-dot sprites. Painted texture variants
// would normally drive variety here; until they ship, every star uses a small
// `<pointsMaterial>` with vertexColors so each individual star has its own ink
// brightness. The three layers differ in Z, density, and parallax response.
export function CosmosStarField({ mobile = false }: Props) {
  return (
    <group>
      <StarLayer layerId="far" />
      <StarLayer layerId="mid" />
      {!mobile ? <StarLayer layerId="near" /> : null}
    </group>
  );
}

function StarLayer({ layerId }: { layerId: Cosmos.StarLayer["id"] }) {
  const layer = Cosmos.starLayers.find((l) => l.id === layerId);
  if (!layer) return null;
  const stars = Cosmos.starLayerStars[layerId];

  const materialRef = useRef<THREE.PointsMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const sprite = useMemo(() => getStarSprite(), []);

  const { positions, colors, phases, baseAlpha } = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    const phases = new Float32Array(stars.length);
    // Warm ink with a hint of cobalt — keeps stars from reading neutral grey.
    const ink = new THREE.Color("#2f2536");
    stars.forEach((s, i) => {
      positions[i * 3 + 0] = s.x;
      positions[i * 3 + 1] = s.y;
      positions[i * 3 + 2] = layer.z;
      const c = ink.clone().multiplyScalar(0.4 + s.brightness * 0.95);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      phases[i] = s.phase;
    });
    // Near layer is darkest and most opaque; far layer fades into the ground.
    const baseAlpha = layer.id === "near" ? 0.95 : layer.id === "mid" ? 0.78 : 0.6;
    return { positions, colors, phases, baseAlpha };
  }, [layer, stars]);

  // Point size in *world units* (sizeAttenuation: true) so far stars look small
  // and near stars look bigger as the camera moves through them.
  const pointSize = layer.id === "near" ? 0.07 : layer.id === "mid" ? 0.05 : 0.038;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Aggregate twinkle: one slow sine modulates the whole layer's opacity ~0.5Hz.
    // Per-star phases are baked into per-vertex colors; modulating a single uniform
    // alpha keeps this cheap.
    if (materialRef.current) {
      const twinkle = 0.9 + 0.1 * Math.sin(t * 0.55 + (layer.id === "far" ? 1.2 : 0));
      materialRef.current.opacity = baseAlpha * twinkle;
    }
    if (groupRef.current) {
      // A very faint, layer-specific drift so the field isn't dead-static.
      const drift = layer.id === "near" ? 0.02 : layer.id === "mid" ? 0.012 : 0.006;
      groupRef.current.position.x = Math.sin(t * 0.04) * drift;
      groupRef.current.position.y = Math.cos(t * 0.05) * drift;
    }
  });

  // Discard `phases` from runtime use after seeding colours — TS would warn on
  // unused destructuring otherwise; reference it once so the bundler keeps it
  // and a future shader-based twinkle has the data ready.
  void phases;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          // The procedural sprite gives each point a soft circular falloff so
          // stars read as little painted dots instead of square pixels. Warm
          // ink colour comes from the per-vertex `vertexColors` attribute and
          // multiplies the sprite. `alphaTest` discards corners so points
          // composite correctly against neighbours.
          map={sprite ?? undefined}
          size={pointSize}
          sizeAttenuation
          vertexColors
          transparent
          alphaTest={0.02}
          opacity={baseAlpha}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
