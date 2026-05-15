"use client";

import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { nebulaFragmentShader, nebulaVertexShader } from "./nebulaShader";

// Inverted sphere at radius 100 with a procedural FBM nebula shader. Sits
// behind every other background layer (renderOrder = -2, depthTest = off) so
// it never occludes the deep field or galaxy band, and never gets occluded by
// a near star at radius 30. Enables layer 1 in addition to the default layer
// 0 so `<CosmosEnvProbe>` can bake it into the armillary's reflection cube map
// while still being visible to the main camera.
export function CosmosNebulae() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVertexShader,
        fragmentShader: nebulaFragmentShader,
        side: THREE.BackSide,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const setLayers = useCallback((m: THREE.Mesh | null) => {
    if (m) m.layers.enable(1);
  }, []);

  return (
    <mesh ref={setLayers} renderOrder={-2} frustumCulled={false} material={material}>
      <sphereGeometry
        args={[Cosmos.nebulae.radius, Cosmos.nebulae.sphereSegments, Cosmos.nebulae.sphereRings]}
      />
    </mesh>
  );
}
