"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Cosmos } from "@/domain/cosmos/Cosmos";
import { getCometHeadSprite, getCometTailSprite } from "./spriteTextures";

type Props = {
  progressRef: MutableRefObject<number>;
};

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
// Head and tail are both `<sprite>` — always camera-facing. The tail sprite is
// stretched along its X axis and rotated via `material.rotation` (in screen
// space) so the trail always points opposite the comet's motion direction,
// regardless of camera angle. v3's flat-plane tail was foreshortened to a
// thin slice at certain orbit angles; sprites avoid that entirely.
export function CosmosComets({ progressRef }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Sprite>(null);
  const tailRef = useRef<THREE.Sprite>(null);

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

  // Reusable temporary vectors so useFrame doesn't allocate per tick.
  const tmpTan = useMemo(() => new THREE.Vector3(), []);

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

    // Tail orientation. The tail sprite is camera-facing, but to point the
    // streak opposite the motion direction we rotate the sprite material by
    // the motion direction's *screen-space* angle. To get that, transform the
    // world-space tangent into the camera's view space (rotation only — the
    // tangent is a direction, not a point) and take atan2 of its 2D
    // components. Sprite rotation is around its centre, clockwise around the
    // view axis; the negation aligns "tail trails behind" with the texture's
    // u-axis (bright end at u=1 → ahead, far end at u=0 → behind).
    const tailMat = tailRef.current?.material as THREE.SpriteMaterial | undefined;
    if (tailMat) {
      tmpTan.set(tan[0], tan[1], tan[2]);
      tmpTan.transformDirection(tickState.camera.matrixWorldInverse);
      tailMat.rotation = Math.atan2(tmpTan.y, tmpTan.x);
    }

    const fade = Cosmos.smoothstep(u, 0, 0.08) * (1 - Cosmos.smoothstep(u, 0.92, 1.0));
    // Multiply by the descent dimming envelope so comets recede during the
    // final beat — they're foreground motion that would compete with the
    // constellation network in the sky-dominant framing.
    const descentDim = Cosmos.cometDescentDimming(Cosmos.clamp01(progressRef.current));
    const headMat = headRef.current?.material as THREE.SpriteMaterial | undefined;
    if (headMat) headMat.opacity = 0.95 * fade * descentDim;
    if (tailMat) tailMat.opacity = 0.7 * fade * descentDim;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Tail FIRST so its renderOrder puts it underneath the head sprite at
          the overlap. Both use additive blending; the head ends up dominant
          at its centre while the tail's gradient blends seamlessly into it. */}
      <sprite
        ref={tailRef}
        // Stretched along sprite X (length 1.6, height 0.36). Sprite center
        // sits behind the head by half its length, so the bright (u≈1) end
        // overlaps the head's centre and the faded (u=0) end trails behind.
        scale={[1.6, 0.36, 1]}
        position={[0, 0, 0]}
        center={[1, 0.5]}
      >
        <spriteMaterial
          map={tailSprite ?? undefined}
          color="#ffd9a0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
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
    </group>
  );
}
