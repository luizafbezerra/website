"use client";

import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { CosmosEnvContext } from "./CosmosEnvContext";
import { useOptionalTexture } from "./useOptionalTexture";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

type Props = {
  sigilScreenPositionsRef: React.MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
};

const SIGIL_COUNT = 12;
const RING_TEXTURE_REPEATS = 8; // times the brushed-roughness map tiles around each circumference

// Five concentric brass rings + a central gilt sun. The group rotates slowly
// around Y and wobbles ±3° around Z on an ~8s cycle (precession feel). The
// twelve zodiac sigils ride the ecliptic ring as *invisible 3D anchors* —
// only their world positions are projected into the screen-space ref the DOM
// sigil overlay consumes. The visible glyph + popover (with painted Bayer
// engraving) live in the DOM, where focus / tab order / a11y are native.
//
// v4: rings are real PBR metal (`MeshStandardMaterial`, metalness ≈ 0.92,
// roughness ≈ 0.32) that reflect the procedural universe via the env-probe's
// cube map. The brass photo is sampled as a roughness micro-variation map
// (brushed-striation character), NOT as a base colour map — base colour is a
// flat warm brass. The sun stays emissive (`MeshBasicMaterial`).
//
// v4-perf: no direct light. The env-probe cube map already includes the warm
// nebula + galaxy band, so the brass picks up colour and direction from the
// reflection alone. `envMapIntensity` is raised to keep the rings reading
// bright enough without per-fragment light math.
export function CosmosArmillary({ sigilScreenPositionsRef, activeSigilId }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const sigilAnchorRefs = useRef<Array<THREE.Object3D | null>>(Array(SIGIL_COUNT).fill(null));

  // Reusable temporaries — `useFrame` runs every animation tick, so we avoid
  // allocating Vector3 / Quaternion instances per frame.
  const tmpWorld = useMemo(() => new THREE.Vector3(), []);
  const tmpProj = useMemo(() => new THREE.Vector3(), []);

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

  // Texture loading.
  //   - `ringRoughnessMap`: brushed-brass photo desaturated to a roughness
  //     micro-variation map. Drives per-pixel roughness on the PBR rings.
  //   - `sunTex`: gilt sun — still consumed as a basic-material colour map.
  const ringRoughnessMap = useOptionalTexture(Cosmos.textures.ringBrushedRoughness);
  const sunTex = useOptionalTexture(Cosmos.textures.sunGilt);
  const envCubeMap = useContext(CosmosEnvContext);

  // Tile the roughness map around each ring's major circumference so a single
  // sample reads as a continuous brushed band rather than one stretched plate.
  // Roughness maps are linear data, not colour — switch off sRGB decoding.
  useEffect(() => {
    if (!ringRoughnessMap) return;
    ringRoughnessMap.colorSpace = THREE.NoColorSpace;
    ringRoughnessMap.wrapS = THREE.RepeatWrapping;
    ringRoughnessMap.wrapT = THREE.RepeatWrapping;
    ringRoughnessMap.repeat.set(RING_TEXTURE_REPEATS, 1);
    ringRoughnessMap.needsUpdate = true;
  }, [ringRoughnessMap]);

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
    }

    const camera = state.camera;
    for (let i = 0; i < SIGIL_COUNT; i++) {
      const anchor = sigilAnchorRefs.current[i];
      if (!anchor) continue;
      anchor.getWorldPosition(tmpWorld);

      // Front-side visibility: anchor is on the same hemisphere as the camera
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

  // `activeSigilId` is forwarded so the rig can opt-in to in-scene effects
  // later (e.g. a soft sigil-position spotlight). Currently the active-state
  // visual treatment lives entirely in the DOM overlay's popover; reference
  // the prop so the type stays meaningful while the in-scene branch is dark.
  void activeSigilId;

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
          <meshStandardMaterial
            color="#b08850"
            metalness={0.92}
            roughness={0.32}
            roughnessMap={ringRoughnessMap ?? undefined}
            envMap={envCubeMap ?? undefined}
            // Bumped from 1.4 → 1.8 to compensate for the dropped pointLight:
            // the brass now takes all of its illumination from the env probe.
            envMapIntensity={1.8}
          />
        </mesh>
      ))}

      {/* Central gilt sun — emissive `MeshBasicMaterial`, unaffected by the
          scene lighting. Its diffuse contribution to the rings is provided by
          the `pointLight` placed at the same position in the scene root. */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[Cosmos.armillary.sunRadius, 32, 24]} />
        <meshBasicMaterial map={sunTex ?? undefined} color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Invisible 3D anchors for the sigil overlay. No mesh — just an Object3D
          positioned on the ecliptic so its world position can be projected. */}
      {sigilPositions.map((pos, i) => (
        <object3D
          key={Cosmos.sigils[i].id}
          ref={(el) => {
            sigilAnchorRefs.current[i] = el;
          }}
          position={pos as [number, number, number]}
        />
      ))}
    </group>
  );
}
