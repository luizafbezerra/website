"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { useOptionalTextures } from "./useOptionalTexture";

// 3–5 painted cloud washes at deep Z. Each nebula has a `textureIdx` that
// indexes into the loaded texture array; with a texture, the plane reads as
// the painted wash, without it, as the palette-tint fallback.
export function CosmosNebulae() {
  const urls = useMemo(() => [...Cosmos.textures.nebula], []);
  const textures = useOptionalTextures(urls);

  return (
    <group>
      {Cosmos.nebulae.map((neb) => (
        <NebulaSprite key={neb.id} nebula={neb} texture={textures[neb.textureIdx] ?? null} />
      ))}
    </group>
  );
}

function NebulaSprite({
  nebula,
  texture,
}: {
  nebula: Cosmos.Nebula;
  texture: THREE.Texture | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const phase = (t * Math.PI * 2) / nebula.driftPeriodSec + nebula.driftPhase;
      groupRef.current.position.x = nebula.position[0] + Math.sin(phase) * nebula.driftAmp;
      groupRef.current.position.y =
        nebula.position[1] + Math.cos(phase * 0.7) * nebula.driftAmp * 0.6;
      groupRef.current.position.z = nebula.position[2];
    }
    if (matRef.current) {
      const breath = 0.85 + 0.15 * Math.sin(t * 0.13 + nebula.driftPhase);
      matRef.current.opacity = nebula.opacity * breath;
    }
  });

  // MultiplyBlending makes the texture's white paper background vanish into
  // the parchment ground (source * destination = destination when source ≈
  // white), and only the engraved/painted ink darkens through. That removes
  // the visible plane-rectangles the user was seeing when 4 nebulae overlapped
  // each other. Without a texture we fall back to a soft tint at low opacity.
  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[nebula.size, nebula.size * 0.78]} />
        <meshBasicMaterial
          ref={matRef}
          map={texture ?? undefined}
          color={texture ? "#ffffff" : nebula.color}
          transparent
          opacity={texture ? 1 : nebula.opacity}
          blending={texture ? THREE.MultiplyBlending : THREE.NormalBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
