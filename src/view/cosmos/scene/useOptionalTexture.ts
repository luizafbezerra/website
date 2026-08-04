"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

// Shared TextureLoader — the browser HTTP cache handles repeat fetches of the
// same URL, and `dispose()` in cleanup releases GPU memory.
const loader = new THREE.TextureLoader();

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
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    let owned: THREE.Texture | null = null;

    loader.load(
      url,
      (t) => {
        if (!alive) {
          t.dispose();
          return;
        }
        configure(t);
        owned = t;
        setTexture(t);
      },
      undefined,
      () => {
        // 404 or network error — leave as null; placeholder color remains.
      },
    );

    return () => {
      alive = false;
      setTexture(null);
      owned?.dispose();
    };
  }, [url]);

  return texture;
}

// Batch loader — same semantics, but for a stable array of URLs. The returned
// array has the same length as `urls`; each entry is independently null or a
// THREE.Texture once that index has loaded. The caller is expected to memoize
// `urls` so the effect doesn't rebind on every render.
export function useOptionalTextures(urls: ReadonlyArray<string>): Array<THREE.Texture | null> {
  const [textures, setTextures] = useState<Array<THREE.Texture | null>>(() => urls.map(() => null));

  useEffect(() => {
    let alive = true;
    const owned: Array<THREE.Texture | null> = urls.map(() => null);

    urls.forEach((url, i) => {
      loader.load(
        url,
        (t) => {
          if (!alive) {
            t.dispose();
            return;
          }
          configure(t);
          owned[i] = t;
          setTextures([...owned]);
        },
        undefined,
        () => {
          // Leave this slot null; others may still load.
        },
      );
    });

    return () => {
      alive = false;
      for (const t of owned) t?.dispose();
      setTextures(urls.map(() => null));
    };
  }, [urls]);

  return textures;
}
