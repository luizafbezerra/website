"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

// Shared TextureLoader — the browser HTTP cache handles repeat fetches of the
// same URL, and `dispose()` in cleanup releases GPU memory.
const loader = new THREE.TextureLoader();

function configure(t: THREE.Texture): void {
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
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
