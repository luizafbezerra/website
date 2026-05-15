"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";

type Props = {
  progressRef: MutableRefObject<number>;
};

// Reads the orchestrator's scroll-progress ref each frame and steers the
// camera toward the 5-phase target from `core/cosmos`. An exponential damp
// glides the camera toward the target each frame so jerky scroll input
// (notched wheels, trackpad flicks) reads as smooth motion. The damp is
// framerate-independent — `delta` is the time since the previous frame.
export function CosmosCameraRig({ progressRef }: Props) {
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  // Convergence rate (1/s). Higher = follows scroll more tightly. Lower = more
  // glide. 7–10 is the sweet spot: smooth but not laggy.
  const DAMP_RATE = 8.5;

  useFrame(({ camera }, delta) => {
    const p = Cosmos.clamp01(progressRef.current);
    const key = Cosmos.cameraKeyAtProgress(p);

    // alpha = 1 - exp(-delta * rate). At 60fps with rate 8.5, alpha ≈ 0.13.
    const alpha = 1 - Math.exp(-Math.max(delta, 0.001) * DAMP_RATE);

    targetPos.set(key.pos[0], key.pos[1], key.pos[2]);
    camera.position.lerp(targetPos, alpha);

    targetLook.set(key.look[0], key.look[1], key.look[2]);
    currentLook.lerp(targetLook, alpha);
    camera.lookAt(currentLook);
  });

  return null;
}
