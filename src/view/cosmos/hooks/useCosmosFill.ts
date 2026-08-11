"use client";

import { useMemo } from "react";
import { CosmosFill } from "@/domain/cosmos/fillProfile";

/**
 * Reads the fill profile from `?cosmos-fill=lean|sparse`.
 *
 * A switch rather than a tuned constant because the thing being tuned can only
 * be judged by eye on real hardware: how much fill the sky can give up before it
 * stops looking painted. Two builds are not comparable across a rebuild; two
 * URLs in adjacent tabs are.
 *
 * Read once at mount, deliberately: the profile decides star buffers and material
 * settings, so re-reading it mid-scene would mean rebuilding the scene under the
 * reader. Anything absent or unrecognised resolves to the shipped scene, so the
 * default path is exactly what it was.
 *
 * Nothing about this is measured or stored — it reads a query parameter and
 * forgets it.
 */
export function useCosmosFill(): CosmosFill.Profile {
  return useMemo(() => {
    if (typeof window === "undefined") return CosmosFill.profile(CosmosFill.DEFAULT_PROFILE);
    return CosmosFill.profile(new URLSearchParams(window.location.search).get("cosmos-fill"));
  }, []);
}

/** The raw name, for the count-scaling path that needs it before the sky is built. */
export function useCosmosFillName(): CosmosFill.ProfileName {
  return useMemo(() => {
    if (typeof window === "undefined") return CosmosFill.DEFAULT_PROFILE;
    const raw = new URLSearchParams(window.location.search).get("cosmos-fill");
    return CosmosFill.isProfileName(raw) ? raw : CosmosFill.DEFAULT_PROFILE;
  }, []);
}
