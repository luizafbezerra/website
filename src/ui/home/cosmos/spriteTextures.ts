"use client";

import * as THREE from "three";

// Procedurally-generated sprite textures for stars + comet head/tail. These
// are pure radial / linear gradients drawn to an offscreen canvas — parametric
// ornament inside the Cosmos carve-out, *not* AI imagery. They keep the scene
// from rendering as flat-square `<points>` and solid-color comet shapes while
// the painted hand-finished sprites are still being prepared.

let _starSprite: THREE.Texture | null = null;
let _cometHead: THREE.Texture | null = null;
let _cometTail: THREE.Texture | null = null;

function makeTexture(canvas: HTMLCanvasElement): THREE.Texture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.premultiplyAlpha = false;
  tex.needsUpdate = true;
  return tex;
}

function radialDisc(size: number, stops: ReadonlyArray<[number, string]>): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return makeTexture(c);
  const r = size / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  for (const [stop, color] of stops) g.addColorStop(stop, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return makeTexture(c);
}

// Warm ink dot — soft round star sprite. White-warm core with a quick falloff
// so the points read as little painted dots rather than square pixels.
export function getStarSprite(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  if (_starSprite) return _starSprite;
  _starSprite = radialDisc(64, [
    [0.0, "rgba(255, 248, 232, 1)"],
    [0.35, "rgba(255, 240, 214, 0.65)"],
    [0.7, "rgba(245, 224, 188, 0.16)"],
    [1.0, "rgba(245, 224, 188, 0)"],
  ]);
  return _starSprite;
}

// Gilt-warm comet head — bright hot center, ochre falloff, transparent edges.
// 256² so the head still reads as a soft painted disc at the closest orbit
// distance instead of as a low-res sprite.
export function getCometHeadSprite(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  if (_cometHead) return _cometHead;
  _cometHead = radialDisc(256, [
    [0.0, "rgba(255, 248, 220, 1)"],
    [0.18, "rgba(255, 226, 168, 0.9)"],
    [0.5, "rgba(220, 162, 88, 0.35)"],
    [0.85, "rgba(160, 110, 60, 0.06)"],
    [1.0, "rgba(160, 110, 60, 0)"],
  ]);
  return _cometHead;
}

// Tapered ochre/gilt streak. Bright in the middle, fading at BOTH ends so it
// blends into the head where it meets and dissolves toward the tail's far
// end. v4-perf: 512×128 for resolution; the head end is no longer fully
// opaque, so meeting the head sprite reads as a continuous glow instead of
// the previous abrupt bright cutoff.
export function getCometTailSprite(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  if (_cometTail) return _cometTail;
  const w = 512;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return makeTexture(c);

  // Length gradient: transparent at far end (u=0), peaks around u=0.85,
  // softens back at the head end (u=1) so the sprite blends into the head.
  const len = ctx.createLinearGradient(0, 0, w, 0);
  len.addColorStop(0.0, "rgba(140, 90, 50, 0)");
  len.addColorStop(0.45, "rgba(200, 140, 80, 0.35)");
  len.addColorStop(0.78, "rgba(245, 210, 140, 0.78)");
  len.addColorStop(0.92, "rgba(255, 230, 178, 0.55)");
  len.addColorStop(1.0, "rgba(255, 238, 192, 0)");
  ctx.fillStyle = len;
  ctx.fillRect(0, 0, w, h);

  // Vertical mask: feather the top and bottom so the streak isn't a hard rect.
  // Wider centre band + softer shoulders than v3 so the streak reads as a
  // painted brush stroke rather than a thin geometric bar.
  const mask = ctx.createLinearGradient(0, 0, 0, h);
  mask.addColorStop(0.0, "rgba(0, 0, 0, 0)");
  mask.addColorStop(0.25, "rgba(0, 0, 0, 0.55)");
  mask.addColorStop(0.5, "rgba(0, 0, 0, 1)");
  mask.addColorStop(0.75, "rgba(0, 0, 0, 0.55)");
  mask.addColorStop(1.0, "rgba(0, 0, 0, 0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  _cometTail = makeTexture(c);
  return _cometTail;
}
