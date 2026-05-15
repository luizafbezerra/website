"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/core";
import { getCometHeadSprite, getCometTailSprite } from "./spriteTextures";

type CometPhase = "idle" | "active";

type CometState = {
  phase: CometPhase;
  startTime: number;
  duration: number;
  trajectoryIdx: number;
};

// Autonomous one-comet-at-a-time system. Spawns from a hand-tuned trajectory
// every 30–60 seconds, traverses a curving path over ~17–20s, despawns. The
// state machine lives in a ref to avoid React re-renders inside the rAF loop.
//
// The trajectories live off-screen on both ends; visibility is gated by the
// per-frame fade applied to head + tail opacity at the ends of the curve.
export function CosmosComets() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Sprite>(null);
  const tailGroupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  // Procedurally-generated sprite textures: warm radial-glow head + tapered
  // ochre streak tail. Painted hand-finished sprites can replace these later
  // by dropping files at `Cosmos.textures.cometHead` / `cometTail` and
  // wiring the optional-texture hook.
  const headSprite = useMemo(() => getCometHeadSprite(), []);
  const tailSprite = useMemo(() => getCometTailSprite(), []);

  // First spawn delay: 2s after entering the section, then idle/active cadence.
  const stateRef = useRef<CometState>({
    phase: "idle",
    startTime: 0,
    duration: 2.0,
    trajectoryIdx: 0,
  });

  useFrame((tickState) => {
    const now = tickState.clock.getElapsedTime();
    const s = stateRef.current;
    const elapsed = now - s.startTime;

    if (elapsed >= s.duration) {
      if (s.phase === "idle") {
        // Spawn: random trajectory, mark active.
        const nextIdx = Math.floor(Math.random() * Cosmos.cometTrajectories.length);
        const traj = Cosmos.cometTrajectories[nextIdx];
        stateRef.current = {
          phase: "active",
          startTime: now,
          duration: traj.durationSec,
          trajectoryIdx: nextIdx,
        };
      } else {
        // Finish: cool down for cometCooldownRange seconds.
        const wait = Cosmos.lerp(
          Cosmos.cometCooldownRange[0],
          Cosmos.cometCooldownRange[1],
          Math.random(),
        );
        stateRef.current = {
          phase: "idle",
          startTime: now,
          duration: wait,
          trajectoryIdx: s.trajectoryIdx,
        };
        if (groupRef.current) groupRef.current.visible = false;
        return;
      }
    }

    const current = stateRef.current;
    if (current.phase === "idle") {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    const traj = Cosmos.cometTrajectories[current.trajectoryIdx];
    const u = Math.min(1, (now - current.startTime) / current.duration);
    const pos = Cosmos.cubicBezier3(u, traj.start, traj.c1, traj.c2, traj.end);
    const tan = Cosmos.cubicBezier3Tangent(u, traj.start, traj.c1, traj.c2, traj.end);

    if (groupRef.current) {
      groupRef.current.visible = true;
      groupRef.current.position.set(pos[0], pos[1], pos[2]);
    }
    if (tailGroupRef.current) {
      // Align the tail's +X axis with the motion tangent (XY plane only — z
      // varies little along the trajectories, so this reads correctly).
      tailGroupRef.current.rotation.z = Math.atan2(tan[1], tan[0]);
    }

    const fade = Cosmos.smoothstep(u, 0, 0.08) * (1 - Cosmos.smoothstep(u, 0.92, 1.0));
    const headMat = headRef.current?.material as THREE.SpriteMaterial | undefined;
    const tailMat = tailRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (headMat) headMat.opacity = 0.95 * fade;
    if (tailMat) tailMat.opacity = 0.7 * fade;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Head: a sprite (always camera-facing) with a warm radial-glow texture.
          Additive blending so the head reads as light, not as an opaque dot. */}
      <sprite ref={headRef} scale={[0.45, 0.45, 1]}>
        <spriteMaterial
          map={headSprite ?? undefined}
          color="#fff0c8"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      {/* Tail: a textured plane rotated each frame so its +X axis aligns with
          the motion tangent (left of the head, trailing back along the arc).
          The tapered texture fades to transparent at the far end. */}
      <group ref={tailGroupRef}>
        <mesh ref={tailRef} position={[-0.55, 0, 0]}>
          <planeGeometry args={[1.4, 0.22]} />
          <meshBasicMaterial
            map={tailSprite ?? undefined}
            color="#ffd9a0"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
