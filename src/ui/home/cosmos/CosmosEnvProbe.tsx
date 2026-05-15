"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { CosmosEnvContext } from "./CosmosEnvContext";

type Props = {
  children: React.ReactNode;
  mobile?: boolean;
};

// Bakes the surrounding universe (nebula shader + deep field + galaxy band)
// once into a cube render target so the brass armillary can sample it as its
// `envMap`. Only layer 1 is rendered into the cube, which excludes every
// foreground object (armillary rings, sun, foreground star shell, comets) —
// no self-reflection.
//
// The universe is static (no time uniform on the shader, stars don't move) so
// a single bake at mount is enough. Re-bakes on window resize as a cheap
// safety net in case the renderer drops the texture.
//
// Mobile drops the cube resolution from 128 → 64. Brass roughness ~0.32 blurs
// the reflection anyway, so the visual loss is invisible.
export function CosmosEnvProbe({ children, mobile = false }: Props) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  const resolution = mobile ? 64 : 128;

  const cubeRenderTarget = useMemo(
    () =>
      new THREE.WebGLCubeRenderTarget(resolution, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        type: THREE.HalfFloatType,
      }),
    [resolution],
  );

  const cubeCamera = useMemo(() => {
    const cam = new THREE.CubeCamera(0.5, 200, cubeRenderTarget);
    // Restrict to layer 1 only — foregrounds on layer 0 are excluded.
    cam.layers.set(1);
    return cam;
  }, [cubeRenderTarget]);

  const [envMap, setEnvMap] = useState<THREE.CubeTexture | null>(null);

  useEffect(() => {
    let raf = 0;
    let alive = true;

    const bake = () => {
      if (!alive) return;
      // Position at the scene origin where the armillary sits.
      cubeCamera.position.set(0, 0, 0);
      cubeCamera.update(gl, scene);
      setEnvMap(cubeRenderTarget.texture);
    };

    // Defer one frame so child meshes (nebulae, deep field, galaxy band) have
    // a chance to mount + register on layer 1 before the first capture.
    raf = requestAnimationFrame(bake);

    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(bake);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [gl, scene, cubeCamera, cubeRenderTarget]);

  useEffect(() => {
    return () => {
      cubeRenderTarget.dispose();
    };
  }, [cubeRenderTarget]);

  return <CosmosEnvContext.Provider value={envMap}>{children}</CosmosEnvContext.Provider>;
}
