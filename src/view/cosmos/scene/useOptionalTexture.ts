"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

const loader = new THREE.TextureLoader();

// Shared texture cache, keyed by URL.
//
// The HTTP cache is not enough on its own. `TextureLoader` builds its own
// `Image` per call, so warming a URL with `new Image()` beforehand bought a
// cache hit on the network and then paid the WebP decode a second time — about
// a megabyte of painted prelude decoded twice. Caching the promise means the
// warm pass and the consuming hook share one fetch, one decode, and one
// `THREE.Texture`, whichever of them asks first.
//
// Consequently textures are owned here, not by the consumer, and are never
// disposed: the section is the last on the page, the same ten plates are the
// only entries, and a consumer that disposed a shared texture would black out
// the others. ~1 MB of GPU memory held for the page's life, deliberately.
const cache = new Map<string, Promise<THREE.Texture>>();

// Synchronous view of the entries that have already resolved, so a hook mounting
// after the warm pass can seed its initial state with the real texture instead of
// rendering null once and rebuilding its meshes on the next tick.
const resolved = new Map<string, THREE.Texture>();

function peek(url: string): THREE.Texture | null {
  return resolved.get(url) ?? null;
}

function load(url: string): Promise<THREE.Texture> {
  const cached = cache.get(url);
  if (cached) return cached;

  const pending = new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      (t) => {
        configure(t);
        resolved.set(url, t);
        resolve(t);
      },
      undefined,
      reject,
    );
  });

  // A failed load must not be cached as a permanent rejection, or a transient
  // network blip would leave the plate missing for the rest of the visit.
  pending.catch(() => cache.delete(url));

  cache.set(url, pending);
  return pending;
}

/**
 * Fetches, decodes and configures textures ahead of the consumer that needs
 * them, populating the shared cache. Fire-and-forget: rejections are swallowed
 * because a missing plate is already a handled state downstream (null texture →
 * placeholder colour).
 */
export function warmTextures(urls: ReadonlyArray<string>): void {
  for (const url of urls) void load(url).catch(() => {});
}

// Cache the renderer's max anisotropy once. Set on first configure().
let maxAniso = 0;
function readMaxAniso(): number {
  if (maxAniso > 0) return maxAniso;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) return (maxAniso = 1);
  const ext =
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  maxAniso = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
  return maxAniso;
}

function configure(t: THREE.Texture): void {
  t.colorSpace = THREE.SRGBColorSpace;
  // Trilinear with auto-generated mipmaps. Without this, every minified
  // sample of a large texture (clouds, land, brushed-brass roughness) is
  // a full-resolution texel fetch, which produces shimmering AND becomes
  // a fragment-shader bottleneck as soon as several textured surfaces
  // overlap. WebGL2 (which three.js targets in modern browsers) handles
  // NPOT mipmaps fine, so we don't need power-of-two dimensions.
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = Math.min(8, readMaxAniso());
  t.needsUpdate = true;
}

// Optional texture: returns null while loading and on 404 / network error, so
// the consumer can fall back to a placeholder color cleanly. Components stay
// fully functional when texture files don't exist yet — useful while assets
// are being hand-finished one at a time.
export function useOptionalTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => peek(url));

  useEffect(() => {
    let alive = true;

    load(url).then(
      (t) => {
        if (alive) setTexture(t);
      },
      () => {
        // 404 or network error — leave as null; placeholder color remains.
      },
    );

    return () => {
      alive = false;
    };
  }, [url]);

  return texture;
}

// Batch loader — same semantics, but for a stable array of URLs. The returned
// array has the same length as `urls`; each entry is independently null or a
// THREE.Texture. The caller is expected to memoize `urls` so the effect doesn't
// rebind on every render.
//
// Resolves as one settle rather than one state update per arrival. The old
// per-arrival `setTextures` re-rendered the consumer once per plate — nine
// renders of the painted prelude, each rebuilding its sprite meshes, all inside
// the mount the reveal is waiting on. Warmed plates arrive synchronously via
// `peek`, so the common path is now zero extra renders.
export function useOptionalTextures(urls: ReadonlyArray<string>): Array<THREE.Texture | null> {
  const [textures, setTextures] = useState<Array<THREE.Texture | null>>(() => urls.map(peek));

  useEffect(() => {
    let alive = true;

    Promise.all(urls.map((url) => load(url).catch(() => null))).then((next) => {
      // Every slot resolved the same way it would have individually — a failed
      // one stays null and leaves its placeholder colour in place.
      if (alive) setTextures(next);
    });

    return () => {
      alive = false;
    };
  }, [urls]);

  return textures;
}
