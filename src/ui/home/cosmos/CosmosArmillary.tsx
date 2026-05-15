"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { useOptionalTexture, useOptionalTextures } from "./useOptionalTexture";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

type Props = {
  sigilScreenPositionsRef: React.MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
};

const SIGIL_COUNT = 12;
const RING_TEXTURE_REPEATS = 8; // times the brass tiles around each major circumference

// Five concentric brass-toned rings + a central gilt sun, the twelve zodiac
// cartouches riding the ecliptic. The group rotates slowly around Y and wobbles
// ±3° around Z on an ~8s cycle (precession feel). Each frame, the sigil
// cartouches billboard to the camera and their world positions are projected
// into the screen-space ref read by the DOM sigil overlay.
//
// Materials use loaded WebP textures when available, falling back to solid
// palette colors when a file isn't present yet. The texture-loading hook
// returns null on missing files so the scene stays functional throughout the
// asset pipeline.
export function CosmosArmillary({ sigilScreenPositionsRef, activeSigilId }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const sigilGroupRefs = useRef<Array<THREE.Object3D | null>>(Array(SIGIL_COUNT).fill(null));

  // Reusable temporaries — `useFrame` runs every animation tick, so we avoid
  // allocating Vector3 / Quaternion instances per frame.
  const tmpWorld = useMemo(() => new THREE.Vector3(), []);
  const tmpProj = useMemo(() => new THREE.Vector3(), []);
  const tmpParentQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpInvParentQuat = useMemo(() => new THREE.Quaternion(), []);

  const sigilPositions = useMemo(() => Cosmos.sigils.map((_, i) => Cosmos.sigilPosition3D(i)), []);

  const rings = useMemo(
    () =>
      Cosmos.armillary.rings.map((ring) => ({
        id: ring.id,
        radius: ring.radius,
        tube: ring.tube,
        eulerRad: [
          Cosmos.deg2rad(ring.eulerDeg[0]),
          Cosmos.deg2rad(ring.eulerDeg[1]),
          Cosmos.deg2rad(ring.eulerDeg[2]),
        ] as [number, number, number],
        offset: (ring.offset ?? [0, 0, 0]) as [number, number, number],
      })),
    [],
  );

  // Texture loading — single brass texture shared across all 5 rings, single
  // sun texture, 12 distinct sigil cartouches.
  const ringTex = useOptionalTexture(Cosmos.textures.ringBrass);
  const sunTex = useOptionalTexture(Cosmos.textures.sunGilt);
  const sigilUrls = useMemo(() => Cosmos.sigils.map((s) => Cosmos.textures.sigil(s.id)), []);
  const sigilTextures = useOptionalTextures(sigilUrls);

  // Once the brass texture is loaded, tile it around each ring's major
  // circumference so a non-tileable engraving still reads as a continuous
  // metal band rather than one giant stretched plate.
  useEffect(() => {
    if (!ringTex) return;
    ringTex.wrapS = THREE.RepeatWrapping;
    ringTex.wrapT = THREE.RepeatWrapping;
    ringTex.repeat.set(RING_TEXTURE_REPEATS, 1);
    ringTex.needsUpdate = true;
  }, [ringTex]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = groupRef.current;
    if (g) {
      const rotSpeed = (Cosmos.armillary.rotationRpm * Math.PI * 2) / 60;
      const wobble =
        Cosmos.deg2rad(Cosmos.armillary.wobbleAmpDeg) *
        Math.sin((t * Math.PI * 2) / Cosmos.armillary.wobblePeriodSec);
      g.rotation.y = t * rotSpeed;
      g.rotation.z = wobble;
      g.getWorldQuaternion(tmpParentQuat);
      tmpInvParentQuat.copy(tmpParentQuat).invert();
    }

    const camera = state.camera;
    for (let i = 0; i < SIGIL_COUNT; i++) {
      const mesh = sigilGroupRefs.current[i];
      if (!mesh) continue;
      // Billboard: set local quaternion so the mesh's world quaternion matches
      // the camera's. Cancels out the parent's rotation.
      mesh.quaternion.copy(tmpInvParentQuat).multiply(camera.quaternion);

      // World position for the DOM overlay projection.
      mesh.getWorldPosition(tmpWorld);

      // Front-side visibility: sigil is on the same hemisphere as the camera
      // relative to the armillary centre (origin). Dot product > 0 = front.
      const sameSide =
        tmpWorld.x * camera.position.x +
          tmpWorld.y * camera.position.y +
          tmpWorld.z * camera.position.z >
        0;

      tmpProj.copy(tmpWorld).project(camera);
      const inFrame =
        tmpProj.z >= -1 &&
        tmpProj.z <= 1 &&
        tmpProj.x >= -1.05 &&
        tmpProj.x <= 1.05 &&
        tmpProj.y >= -1.05 &&
        tmpProj.y <= 1.05;

      sigilScreenPositionsRef.current[i] = {
        x: (tmpProj.x + 1) / 2,
        y: 1 - (tmpProj.y + 1) / 2,
        visible: sameSide && inFrame,
      };
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring) => (
        <mesh key={ring.id} rotation={ring.eulerRad} position={ring.offset}>
          <torusGeometry
            args={[
              ring.radius,
              ring.tube,
              Cosmos.armillary.tubularSegments,
              Cosmos.armillary.ringSegments,
            ]}
          />
          <meshBasicMaterial
            map={ringTex ?? undefined}
            // Multiply the brass tint over the texture so the (mostly pale)
            // Cellarius engraving reads as a warm brass band instead of as
            // bright white paper. With no texture the same colour falls back
            // to a flat brass fill.
            color={Cosmos.armillary.ringColor}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Central gilt sun. */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[Cosmos.armillary.sunRadius, 32, 24]} />
        <meshBasicMaterial
          map={sunTex ?? undefined}
          color={Cosmos.armillary.sunColor}
          toneMapped={false}
        />
      </mesh>

      {sigilPositions.map((pos, i) => {
        const sigil = Cosmos.sigils[i];
        const sigilTex = sigilTextures[i] ?? null;
        const isActive = activeSigilId === sigil.id;
        // Textured cartouches read as paper cards on the ring; without a
        // texture we fall back to the small terracotta dot used during the
        // stub phase.
        const planeSize = sigilTex ? 0.18 : 0.07;
        const planeAspect = sigilTex ? 0.85 : 1.0;
        return (
          <group
            key={sigil.id}
            ref={(el) => {
              sigilGroupRefs.current[i] = el;
            }}
            position={pos as [number, number, number]}
          >
            <mesh>
              <planeGeometry args={[planeSize, planeSize * planeAspect]} />
              <meshBasicMaterial
                map={sigilTex ?? undefined}
                color={sigilTex ? "#ffffff" : "#7d3a25"}
                transparent
                opacity={sigilTex ? 1 : 0.55}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
            {/* Gilt halo when the sigil is active. */}
            {isActive ? (
              <mesh>
                <torusGeometry args={[planeSize * 0.65, 0.0075, 12, 48]} />
                <meshBasicMaterial
                  color="#d8a04a"
                  transparent
                  opacity={0.9}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}
