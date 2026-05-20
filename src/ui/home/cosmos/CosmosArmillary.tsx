"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { bakeArmillaryMatcap } from "./bakeArmillaryMatcap";
import { getSunGlowSprite } from "./spriteTextures";
import { useOptionalTexture } from "./useOptionalTexture";

export type SigilScreenPosition = { x: number; y: number; visible: boolean };

type Props = {
  sigilScreenPositionsRef: React.MutableRefObject<SigilScreenPosition[]>;
  activeSigilId: Cosmos.SigilId | null;
  // Scroll progress (0..1), read each frame to compute `armillaryOpacity` so
  // the rings + sun materialize between p=0.20 and p=0.30 — the same window
  // the last painted-prelude layers (sky, clouds) fade out across. When
  // omitted (e.g. a detached preview surface), the armillary stays at full
  // opacity.
  progressRef?: MutableRefObject<number>;
};

const SIGIL_COUNT = 12;

// Five concentric brass rings + a central gilt sun. The group rotates slowly
// around Y and wobbles ±3° around Z on an ~8s cycle (precession feel). The
// twelve zodiac sigils ride the ecliptic ring as *invisible 3D anchors* —
// only their world positions are projected into the screen-space ref the DOM
// sigil overlay consumes. The visible glyph + popover (with painted Bayer
// engraving) live in the DOM, where focus / tab order / a11y are native.
//
// v5-perf: rings render with `MeshMatcapMaterial` driven by a matcap baked
// once at mount from the same `MeshStandardMaterial` setup (metalness 0.92,
// roughness 0.32, env-mapped against the procedural universe). The brass
// response is identical from any single camera angle; the view-space matcap
// trades the rotating world-space cube reflection for a single texel fetch
// per fragment. See `bakeArmillaryMatcap.ts`.
export function CosmosArmillary({ sigilScreenPositionsRef, activeSigilId, progressRef }: Props) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const groupRef = useRef<THREE.Group>(null);
  const sigilAnchorRefs = useRef<Array<THREE.Object3D | null>>(Array(SIGIL_COUNT).fill(null));
  // Material refs for the per-frame opacity envelope. The rings share the
  // armillary fade; the sun sprite gets the same opacity multiplier so the
  // entire object resolves as one unit rather than the rings appearing
  // before the sun (or vice versa).
  const ringMaterialRefs = useRef<Array<THREE.MeshMatcapMaterial | THREE.MeshBasicMaterial | null>>(
    [],
  );
  const sunMaterialRef = useRef<THREE.SpriteMaterial | null>(null);

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

  // Brushed-brass roughness map is sampled only during the one-shot bake to
  // imprint its micro-variation into the matcap. Once the matcap exists,
  // ring fragments don't sample it any more.
  const ringRoughnessMap = useOptionalTexture(Cosmos.textures.ringBrushedRoughness);
  const sunGlowSprite = useMemo(() => getSunGlowSprite(), []);

  const [matcap, setMatcap] = useState<THREE.Texture | null>(null);
  // Guards against re-baking if the roughness texture re-emits (it normally
  // doesn't, but `useOptionalTexture` could in principle replace its value
  // on a URL change). One bake per armillary mount is sufficient.
  const bakedRef = useRef<boolean>(false);

  // Bake the matcap once. Waits for the brushed-roughness texture to load so
  // its micro-variation imprints into the matcap; falls back to a roughness-
  // free bake after `MATCAP_BAKE_FALLBACK_MS` if the texture never arrives
  // (404 or slow network) — the matcap is still dominated by the cube map,
  // so a roughness-free brass is acceptable degradation.
  useEffect(() => {
    if (bakedRef.current) return;
    let alive = true;
    let bakedTexture: THREE.Texture | null = null;

    const fire = (roughness: THREE.Texture | null) => {
      if (bakedRef.current || !alive) return;
      bakedRef.current = true;
      bakeArmillaryMatcap(gl, scene, [0, Cosmos.UNIVERSE_Y_OFFSET, 0], roughness).then((t) => {
        if (!alive) {
          t.dispose();
          return;
        }
        bakedTexture = t;
        setMatcap(t);
      });
    };

    if (ringRoughnessMap) {
      fire(ringRoughnessMap);
    } else {
      // 500ms fallback — long enough for the WebP roughness to decode on a
      // cold cache, short enough that a 404'd asset doesn't leave the rings
      // in their solid-brass fallback for the whole scroll.
      const timer = setTimeout(() => fire(null), 500);
      return () => {
        alive = false;
        clearTimeout(timer);
        bakedTexture?.dispose();
      };
    }

    return () => {
      alive = false;
      bakedTexture?.dispose();
    };
  }, [gl, scene, ringRoughnessMap]);

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

    // Armillary fade envelope. The painted prelude owns the screen through
    // p < 0.20; the brass + sun materialize across p ∈ [0.20, 0.30] as the
    // last painted layers dissolve. Skipping the multiply when no progress
    // ref is provided leaves the materials at 1.0 — useful for any future
    // detached preview surface.
    const op = progressRef ? Cosmos.armillaryOpacity(Cosmos.clamp01(progressRef.current)) : 1;
    if (progressRef) {
      for (const m of ringMaterialRefs.current) {
        if (m) m.opacity = op;
      }
      if (sunMaterialRef.current) sunMaterialRef.current.opacity = op;
    }

    // Skip the 12 × `getWorldPosition` + `project` work while the rings are
    // invisible — there's nothing for the DOM overlay to align to during the
    // prelude window. The overlay reads `visible: false` from the previous
    // frame's writes until the rings emerge.
    if (op <= 0) return;

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
      {rings.map((ring, index) => (
        <mesh key={ring.id} rotation={ring.eulerRad} position={ring.offset}>
          <torusGeometry
            args={[
              ring.radius,
              ring.tube,
              Cosmos.armillary.tubularSegments,
              Cosmos.armillary.ringSegments,
            ]}
          />
          {matcap ? (
            <meshMatcapMaterial
              ref={(m) => {
                ringMaterialRefs.current[index] = m;
              }}
              matcap={matcap}
              color="#b08850"
              transparent
            />
          ) : (
            // Pre-bake fallback (~16ms window). Solid warm brass keeps the
            // rings legible during the bake instead of flashing black or
            // showing a single-frame default-grey.
            <meshBasicMaterial
              ref={(m) => {
                ringMaterialRefs.current[index] = m;
              }}
              color="#8a6a3e"
              transparent
            />
          )}
        </mesh>
      ))}

      {/* Central sun — additive gilt-warm glow sprite. Always camera-facing,
          so the sun reads as a discrete light source from every orbit angle.
          The previous textured sphere was so small at orbit distance that its
          engraving detail couldn't resolve and it read as a flat white dot. */}
      <sprite position={[0, 0, 0]} scale={[0.42, 0.42, 1]}>
        <spriteMaterial
          ref={(m) => {
            sunMaterialRef.current = m;
          }}
          map={sunGlowSprite ?? undefined}
          color="#ffffff"
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

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
