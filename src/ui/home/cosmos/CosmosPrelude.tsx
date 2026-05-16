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

  const sources = useMemo(() => props.map((p) => p.src), [props]);
  const textures = useOptionalTextures(sources);

  // Per-prop material refs — useFrame mutates `.opacity` on these each tick.
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);

  useFrame((state) => {
    const cameraZ = state.camera.position.z;
    const master = Cosmos.preludeMasterOpacity(Cosmos.clamp01(progressRef.current));
    for (let i = 0; i < props.length; i++) {
      const m = materialRefs.current[i];
      if (!m) continue;
      m.opacity = Cosmos.preludePropOpacity(cameraZ, props[i].position[2]) * master;
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
