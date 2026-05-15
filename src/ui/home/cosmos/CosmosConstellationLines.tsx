"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { buildLineEndpoints, buildStarVertices } from "@/core/cosmos/constellations";
import { getStarSprite } from "./spriteTextures";

type Props = {
  progressRef: MutableRefObject<number>;
};

// Constellation line networks + bright vertex stars. Eleven hand-curated
// constellations (Pleiades, Orion's Belt, Cassiopeia, Cygnus, Ursa Major,
// Lyra, Aquila, Leo, Scorpius, Corona Borealis, Crux) — ~58 named stars
// connected by ~37 line segments. The references' visual signature lives
// here: a dense gilt line network laid over a starry sky.
//
// Two draw calls total: one `<lineSegments>` for the network, one `<points>`
// for the bright vertex stars. The vertex stars use the same painted sprite
// as the foreground star shell but at a larger size and warmer gilt tint so
// they read as "the named stars of a constellation" against the diffuse
// background star field.
//
// Layer: default 0 only — excluded from the env-probe cube map so the
// brass armillary doesn't reflect the strokes (which would read as a
// tangle of bright threads in the metal). Opacity is driven each frame
// from scroll progress via `Cosmos.constellationLineOpacity(p)` for the
// strokes; the vertex stars share that envelope but are slightly more
// visible at all times so the constellations have presence even before
// the line network finishes fading in.
export function CosmosConstellationLines({ progressRef }: Props) {
  // ---- Line network ---------------------------------------------------------
  const lineGeometry = useMemo(() => {
    const positions = buildLineEndpoints();
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  // ---- Vertex stars ---------------------------------------------------------
  const starPositions = useMemo(() => {
    const verts = buildStarVertices();
    const arr = new Float32Array(verts.length * 3);
    for (let i = 0; i < verts.length; i++) {
      arr[i * 3 + 0] = verts[i].pos[0];
      arr[i * 3 + 1] = verts[i].pos[1];
      arr[i * 3 + 2] = verts[i].pos[2];
    }
    return arr;
  }, []);
  const starGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    return g;
  }, [starPositions]);
  const starSprite = useMemo(() => getStarSprite(), []);
  const starMaterialRef = useRef<THREE.PointsMaterial>(null);

  // Release the buffer geometries on unmount so GPU memory isn't held.
  useEffect(
    () => () => {
      lineGeometry.dispose();
      starGeometry.dispose();
    },
    [lineGeometry, starGeometry],
  );

  useFrame((state) => {
    const p = Cosmos.clamp01(progressRef.current);
    const lineFade = Cosmos.constellationLineOpacity(p);
    // Vertex stars fade in a touch earlier and harder than the strokes so
    // the visitor sees the "named star" pattern before the lines connect.
    const starFade = Cosmos.constellationStarOpacity(p);
    const t = state.clock.getElapsedTime();

    if (lineMaterialRef.current) {
      // 0.78 ceiling so the gilt strokes register against the warm nebula
      // background — at the original 0.5 they blended into the cream/gilt
      // tones of the painted FBM and were nearly invisible.
      lineMaterialRef.current.opacity = lineFade * 0.78;
    }
    if (starMaterialRef.current) {
      // Gentle twinkle on the named stars — one global sine offset by phase
      // per render frame is enough to give the network a slow heartbeat
      // without per-vertex shader cost.
      const twinkle = 0.92 + 0.08 * Math.sin(t * 0.7);
      starMaterialRef.current.opacity = starFade * twinkle;
    }
  });

  return (
    <group>
      <lineSegments geometry={lineGeometry} renderOrder={1} frustumCulled={false}>
        <lineBasicMaterial
          ref={lineMaterialRef}
          // Bright pale-gilt — punches against the warm nebula background.
          // Earlier #d6a85a sat too close to the nebula's own gilt tones
          // and blended into illegibility.
          color="#ffe680"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <points geometry={starGeometry} renderOrder={2} frustumCulled={false}>
        <pointsMaterial
          ref={starMaterialRef}
          map={starSprite ?? undefined}
          // Pure-white centre so vertex stars read as the brightest objects
          // in the scene (after the gilt sun). The sprite's own warm rgba
          // adds the cream halo around the bright core.
          color="#ffffff"
          // ~6× the background star size so the named stars clearly
          // dominate the diffuse foreground shell.
          size={0.34}
          sizeAttenuation
          transparent
          alphaTest={0.02}
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
