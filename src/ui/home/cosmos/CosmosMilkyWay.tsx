"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { useOptionalTexture } from "./useOptionalTexture";

// A single painted band on a diagonal plane at deep Z. When the painted band
// texture is present it carries the soft ochre→gilt→cobalt gradient; without
// it the plane reads as a tinted solid wash. A slow opacity breath gives the
// band a barely-conscious sense of life.
export function CosmosMilkyWay() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const mwTex = useOptionalTexture(Cosmos.textures.milkyWay);

  useFrame((state) => {
    if (matRef.current) {
      const t = state.clock.getElapsedTime();
      matRef.current.opacity = Cosmos.milkyWay.opacity * Cosmos.milkyWayBreath(t);
    }
  });

  // Same multiply-blend trick as the nebulae: the texture's pale paper
  // background becomes invisible against the parchment ground; only the
  // engraving's darker ink "shadows" the page. The slow opacity breath only
  // applies in the colour-only fallback (multiply is unaffected by opacity).
  return (
    <mesh
      position={Cosmos.milkyWay.position as [number, number, number]}
      rotation={[
        Cosmos.deg2rad(Cosmos.milkyWay.eulerDeg[0]),
        Cosmos.deg2rad(Cosmos.milkyWay.eulerDeg[1]),
        Cosmos.deg2rad(Cosmos.milkyWay.eulerDeg[2]),
      ]}
    >
      <planeGeometry args={[Cosmos.milkyWay.width, Cosmos.milkyWay.height]} />
      <meshBasicMaterial
        ref={matRef}
        map={mwTex ?? undefined}
        color={mwTex ? "#ffffff" : Cosmos.milkyWay.color}
        transparent
        opacity={mwTex ? 1 : Cosmos.milkyWay.opacity}
        blending={mwTex ? THREE.MultiplyBlending : THREE.NormalBlending}
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
