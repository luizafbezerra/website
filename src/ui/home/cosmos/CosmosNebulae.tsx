"use client";

import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { nebulaBakeFragmentShader, nebulaBakeVertexShader } from "./nebulaShader";

// Inverted sphere at radius 100 with a static painterly nebula.
//
// v4-perf: the FBM nebula is baked ONCE at mount to a 2D equirectangular
// texture via offscreen render, then displayed with a plain `MeshBasicMaterial`.
// The previous version ran the shader full-screen every frame — at native DPR
// that's a 3D simplex × 8 octaves per pixel × 60fps. Baking lifts the entire
// per-frame nebula cost off the GPU; the visual is identical because the noise
// has no time uniform.
//
// Enables layer 1 in addition to the default layer 0 so `<CosmosEnvProbe>` can
// bake it into the brass armillary's reflection cube map.
export function CosmosNebulae() {
  const gl = useThree((s) => s.gl);

  const texture = useMemo(() => bakeNebulaTexture(gl), [gl]);

  // Dispose the baked texture on unmount so the GPU memory isn't held forever.
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const setLayers = useCallback((m: THREE.Mesh | null) => {
    if (m) m.layers.enable(1);
  }, []);

  return (
    <mesh ref={setLayers} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry
        args={[Cosmos.nebulae.radius, Cosmos.nebulae.sphereSegments, Cosmos.nebulae.sphereRings]}
      />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

// Bakes the nebula FBM shader to a 2D equirectangular texture. Runs the
// shader exactly once over a full-screen quad in an offscreen render target,
// then returns that target's texture for use on any geometry with
// equirectangular UVs (three.js's default sphere geometry qualifies).
//
// 2048×1024 was the size of the v3 painted dome plate — same resolution gets
// us comparable fidelity without the cylindrical pole-distortion of a real
// photographic equirectangular, because the noise is low-frequency by design
// and pole stretching is hidden by mipmap filtering.
function bakeNebulaTexture(gl: THREE.WebGLRenderer): THREE.Texture {
  const width = 2048;
  const height = 1024;

  const target = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    colorSpace: THREE.SRGBColorSpace,
  });

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();
  const material = new THREE.ShaderMaterial({
    vertexShader: nebulaBakeVertexShader,
    fragmentShader: nebulaBakeFragmentShader,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  // Render to target, restoring the renderer's previous state.
  const prevTarget = gl.getRenderTarget();
  const prevAutoClear = gl.autoClear;
  gl.autoClear = true;
  gl.setRenderTarget(target);
  gl.render(scene, camera);
  gl.setRenderTarget(prevTarget);
  gl.autoClear = prevAutoClear;

  // The quad + material were single-use; release their CPU/GPU resources.
  // The render target's texture is kept and returned.
  geometry.dispose();
  material.dispose();

  return target.texture;
}
