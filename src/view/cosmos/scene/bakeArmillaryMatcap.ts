"use client";

import * as THREE from "three";

// One-shot offscreen bake that fuses the env-probe + matcap-render passes the
// armillary previously paid every frame. The result is a 256² matcap texture
// that encodes the brass-against-universe response in view-space — applied
// with `MeshMatcapMaterial`, every ring fragment becomes a single texel fetch
// instead of the full Standard BRDF + cubemap-LOD sample.
//
// Two passes, run back-to-back:
//   1. Render the universe (layer 1: nebula + deep field + galaxy band) into
//      a 64×6 cube target via a `CubeCamera` positioned at the armillary's
//      center, matching what `<CosmosEnvProbe>` used to do.
//   2. Render a unit sphere filling an ortho frustum with a one-off
//      `MeshStandardMaterial` (same metalness / roughness / brass tint as the
//      live rings used) sampling that cube map as its `envMap`. The
//      orthographic projection of a sphere is exactly a matcap.
//
// Renderer state (target, autoClear) is saved + restored. All temporary
// resources (cube target, sphere geo + material) are disposed before we
// return; only the ortho render target's `.texture` is retained.
export async function bakeArmillaryMatcap(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  center: [number, number, number],
  roughnessMap: THREE.Texture | null,
): Promise<THREE.Texture> {
  // Defer one frame so child meshes (nebulae, deep field, galaxy band) have
  // a chance to mount + register on layer 1 before the first capture —
  // mirrors the original `<CosmosEnvProbe>` defer pattern.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  // Roughness data is linear, not colour. `useOptionalTexture` defaults to
  // `SRGBColorSpace`; flip it back before sampling so the brushed pattern
  // renders with correct contrast. Mutating the shared texture is safe here
  // because the roughness map has no other consumer.
  if (roughnessMap && roughnessMap.colorSpace !== THREE.NoColorSpace) {
    roughnessMap.colorSpace = THREE.NoColorSpace;
    roughnessMap.needsUpdate = true;
  }

  // --- Pass 1: cube map of the universe at the armillary's center. ---
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(64, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
  });
  const cubeCamera = new THREE.CubeCamera(0.5, 200, cubeRenderTarget);
  cubeCamera.layers.set(1);
  cubeCamera.position.set(center[0], center[1], center[2]);
  cubeCamera.update(gl, scene);

  // --- Pass 2: bake a 256² matcap from a sphere lit only by that cube map. ---
  const target = new THREE.WebGLRenderTarget(256, 256, {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    colorSpace: THREE.SRGBColorSpace,
  });

  // Ortho frustum [-1,1] in both axes, looking down -Z. A unit-radius sphere
  // at the origin fills the frustum exactly; its projection IS the matcap.
  const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  orthoCamera.position.set(0, 0, 2);
  orthoCamera.lookAt(0, 0, 0);

  const bakeScene = new THREE.Scene();
  bakeScene.background = null;

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "#b08850",
    metalness: 0.92,
    roughness: 0.32,
    roughnessMap: roughnessMap ?? undefined,
    envMap: cubeRenderTarget.texture,
    envMapIntensity: 1.8,
  });
  const sphere = new THREE.Mesh(geometry, material);
  bakeScene.add(sphere);

  const prevTarget = gl.getRenderTarget();
  const prevAutoClear = gl.autoClear;
  gl.autoClear = true;
  gl.setRenderTarget(target);
  gl.render(bakeScene, orthoCamera);
  gl.setRenderTarget(prevTarget);
  gl.autoClear = prevAutoClear;

  // Cube target + sphere were single-use. The ortho target's texture is what
  // we keep; the matcap reads from it for the rest of the section's life.
  geometry.dispose();
  material.dispose();
  cubeRenderTarget.dispose();

  return target.texture;
}
