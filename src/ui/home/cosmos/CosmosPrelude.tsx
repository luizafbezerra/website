"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { useOptionalTextures } from "./useOptionalTexture";

type Props = {
  progressRef: MutableRefObject<number>;
};

// Prop-based painted prelude. The 3D nebula + deep field + comets ARE the
// sky behind these props; the painted scene is a sparse arrangement of
// discrete cut-outs (clouds, land strip, trees, rocks, bush, single figure)
// positioned in 3D between camera (z=25) and the universe. Each prop is
// solid (its own PNG alpha), so the 3D sky shows through *between* props
// but never *through* them.
//
// As the camera dollies forward across p ∈ [0, 0.25] from z=25 → z=3.6,
// each prop fades out via `Cosmos.preludePropOpacity(cameraZ, propZ)` as
// the camera passes through its Z. Multiplied by the master scroll fade
// (`Cosmos.preludeMasterOpacity(p)`), the painted scene exits cleanly by
// p=0.20 so the universe (armillary + sigils, fading in at p=0.20→0.30)
// materializes against a clean canvas.
export function CosmosPrelude({ progressRef }: Props) {
  const props = Cosmos.preludeProps;

  const sources = useMemo(() => props.map((p) => Cosmos.preludeAssetPath(p.asset)), [props]);
  const textures = useOptionalTextures(sources);

  // Per-prop refs. Material refs receive per-frame opacity writes; mesh refs
  // receive per-frame position writes for cloud drift.
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  // Per-cloud drift parameters: a slow horizontal sin oscillation. Distinct
  // speed/phase/amplitude per cloud so the six instances don't move in
  // lockstep. Non-cloud props get `null` (no drift). Seed derived from
  // array index — deterministic, no random hashes needed.
  const driftState = useMemo(
    () =>
      props.map((p, i) => {
        const isCloud = p.asset === "cloud-soft" || p.asset === "cloud-dense";
        if (!isCloud) return null;
        // Two interleaved sequences so adjacent clouds in the array don't
        // get nearly-equal seeds (their drift parameters would look paired).
        const seed = ((i * 37 + 11) % 100) / 100; // 0..1
        return {
          baseX: p.position[0],
          // Slow ambient drift — peak velocity (amp × speed) is intentionally
          // tiny so clouds breathe rather than scroll. Speed range factor ~4
          // between slowest and fastest cloud so the variation reads.
          speed: 0.018 + seed * 0.052, // 0.018–0.070 rad/sec
          phase: seed * Math.PI * 2,
          amplitude: 0.35 + seed * 0.85, // 0.35–1.20 world units
        };
      }),
    [props],
  );

  // Per-cloud distance transparency: clouds at distance ≥ DIST_FAR are fully
  // opaque; as the camera approaches and the distance shrinks to DIST_NEAR,
  // the cloud's opacity coefficient drops to MIN_COEF, so the cloud reads
  // as softer / partially see-through "zoomed in." Below DIST_NEAR the
  // existing `preludePropOpacity` finishes the fade-out to 0.
  const cloudDistanceCoef = (cameraZ: number, propZ: number): number => {
    const DIST_FAR = 6;
    const DIST_NEAR = 2;
    const MIN_COEF = 0.55;
    const t = Cosmos.smootherstep(cameraZ - propZ, DIST_NEAR, DIST_FAR);
    return MIN_COEF + (1 - MIN_COEF) * t;
  };

  useFrame((state) => {
    const cameraZ = state.camera.position.z;
    const master = Cosmos.preludeMasterOpacity(Cosmos.clamp01(progressRef.current));
    const t = state.clock.elapsedTime;
    for (let i = 0; i < props.length; i++) {
      const propZ = props[i].position[2];
      const drift = driftState[i];
      const m = materialRefs.current[i];
      if (m) {
        let op = Cosmos.preludePropOpacity(cameraZ, propZ) * master;
        if (drift) op *= cloudDistanceCoef(cameraZ, propZ);
        m.opacity = op;
      }
      if (drift) {
        const mesh = meshRefs.current[i];
        if (mesh) {
          mesh.position.x = drift.baseX + Math.sin(t * drift.speed + drift.phase) * drift.amplitude;
        }
      }
    }
  });

  return (
    <group>
      {props.map((prop, i) => {
        const texture = textures[i];
        if (!texture) return null;
        // Mesh only mounts once its texture is loaded — width depends on
        // the texture's aspect ratio. Until then the slot stays empty so
        // the parchment / universe behind shows through cleanly.
        // `Texture.image` is typed as `{}` in current three.js types; the
        // runtime payload is an HTMLImageElement once the load resolves.
        const img = texture.image as { width?: number; height?: number } | undefined;
        if (!img || !img.width || !img.height) return null;
        const texAspect = img.width / img.height;
        const width = prop.scale * texAspect;
        const height = prop.scale;
        // Bottom-anchored props: lift the mesh by half its height so
        // `position.y` represents the prop's bottom edge — lets the call
        // site place a tree at y=0 ("on the ground") without height math.
        const yOffset = prop.anchor === "bottom" ? prop.scale / 2 : 0;
        return (
          <mesh
            key={prop.id}
            ref={(mesh) => {
              meshRefs.current[i] = mesh;
            }}
            position={[prop.position[0], prop.position[1] + yOffset, prop.position[2]]}
          >
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
              ref={(m) => {
                materialRefs.current[i] = m;
              }}
              map={texture}
              transparent
              opacity={0}
              alphaTest={0.02}
              depthWrite
              toneMapped={false}
              side={THREE.FrontSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
