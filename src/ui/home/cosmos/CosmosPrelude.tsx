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

  // Per-prop refs. Materials receive per-frame opacity writes; groups receive
  // per-frame transform writes (cloud drift on `position.x`). Tree sway is
  // implemented as a vertex-shader displacement (see `swayVertexInjection`
  // below) — only the canopy bends, the trunk base stays planted — so it
  // doesn't go through any per-frame transform on the mesh or group.
  // `swayShaders` holds the patched `THREE.Shader` for each tree material so
  // its `uTime` uniform can be advanced each frame.
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const groupRefs = useRef<Array<THREE.Group | null>>([]);
  const swayShaders = useRef<Array<THREE.WebGLProgramParametersWithUniforms | null>>([]);

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

  // Per-tree sway parameters. Driven into the material's vertex shader via
  // `onBeforeCompile`, where each vertex gets a horizontal displacement
  // weighted by a curve over its UV.y so the base of the sprite stays put
  // while the canopy bends. `amplitude` is in world units of canopy-top
  // displacement (≈ uv.y = 1). Bottom 25% has effectively zero displacement.
  const swayState = useMemo(
    () =>
      props.map((p, i) => {
        const isTree = p.asset === "tree-left" || p.asset === "tree-right";
        if (!isTree) return null;
        const seed = ((i * 37 + 11) % 100) / 100; // 0..1
        return {
          speed: 0.45 + seed * 0.35, // 0.45–0.80 rad/sec (period ~8–14s)
          phase: seed * Math.PI * 2,
          amplitude: 0.06 + seed * 0.06, // world units of canopy-top sway
        };
      }),
    [props],
  );

  // Vertex shader injection for tree sway. Two replacement snippets:
  //   1) After `void main() {`, declare the four custom uniforms.
  //   2) After `#include <begin_vertex>` (which defines `vec3 transformed =
  //      vec3(position);`), shear `transformed.x` by a sin oscillator weighted
  //      by `pow(uv.y, 2.2)`. uv.y = 0 at the sprite's bottom, 1 at the top,
  //      so the bottom rows barely move (pow(0, 2.2) = 0) and the canopy
  //      bends most. The 2.2 exponent keeps the lower trunk almost rigid —
  //      higher exponent = more aggressive bottom-flat curve.
  const swayUniformDecls = useMemo(
    () => `
      uniform float uSwayTime;
      uniform float uSwaySpeed;
      uniform float uSwayPhase;
      uniform float uSwayAmplitude;
      void main() {`,
    [],
  );
  const swayVertexInjection = useMemo(
    () => `
      #include <begin_vertex>
      float swayWeight = pow(clamp(uv.y, 0.0, 1.0), 2.2);
      transformed.x += sin(uSwayTime * uSwaySpeed + uSwayPhase) * uSwayAmplitude * swayWeight;`,
    [],
  );

  // One `onBeforeCompile` per tree material, memoised so the material instance
  // isn't rebuilt and re-compiled on every render. Captures that tree's
  // sway parameters as initial uniform values and stashes the patched shader
  // in `swayShaders` so the per-frame `useFrame` loop can advance `uSwayTime`.
  const swayCallbacks = useMemo(
    () =>
      swayState.map((sway, i) => {
        if (!sway) return undefined;
        return (shader: THREE.WebGLProgramParametersWithUniforms) => {
          shader.uniforms.uSwayTime = { value: 0 };
          shader.uniforms.uSwaySpeed = { value: sway.speed };
          shader.uniforms.uSwayPhase = { value: sway.phase };
          shader.uniforms.uSwayAmplitude = { value: sway.amplitude };
          shader.vertexShader = shader.vertexShader
            .replace("void main() {", swayUniformDecls)
            .replace("#include <begin_vertex>", swayVertexInjection);
          swayShaders.current[i] = shader;
        };
      }),
    [swayState, swayUniformDecls, swayVertexInjection],
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
        const group = groupRefs.current[i];
        if (group) {
          group.position.x =
            drift.baseX + Math.sin(t * drift.speed + drift.phase) * drift.amplitude;
        }
      }
      const swayShader = swayShaders.current[i];
      if (swayShader && swayShader.uniforms.uSwayTime) {
        swayShader.uniforms.uSwayTime.value = t;
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
        // The group's origin sits at the prop's world anchor point — its
        // base for bottom-anchored props, its center for center-anchored
        // props. The child mesh is offset upward by half its height so a
        // bottom-anchored prop's geometry extends UP from the group origin.
        const yOffset = prop.anchor === "bottom" ? prop.scale / 2 : 0;
        const swayCb = swayCallbacks[i];
        // Sway-capable props get a tessellated geometry (16 vertical rows)
        // so the per-vertex displacement curve renders as a smooth bend.
        // Without enough rows the trunk just shears as a parallelogram.
        // 1×16 = 17 verts × 2 rows = 34 verts / 32 tris — cheap, smooth.
        const heightSegments = swayCb ? 16 : 1;
        return (
          <group
            key={prop.id}
            ref={(g) => {
              groupRefs.current[i] = g;
            }}
            position={[prop.position[0], prop.position[1], prop.position[2]]}
          >
            <mesh position={[0, yOffset, 0]} frustumCulled={!swayCb}>
              <planeGeometry args={[width, height, 1, heightSegments]} />
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
                onBeforeCompile={swayCb}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
