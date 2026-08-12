/**
 * How much fill the scroll-cinema is allowed to spend.
 *
 * The scene is fillrate-bound, not CPU-bound: ~5,300 soft alpha-blended star
 * sprites, each one a quad whose colour is blended rather than written. The
 * levers that matter are how many sprites there are and how much of each quad
 * survives to the blend stage.
 *
 * `alphaTest` is the sharper of the two. The star sprite's alpha falls
 * 1.0 → 0.65 at 35% of its radius → 0.16 at 70% → 0 at the rim, so a threshold
 * of 0.02 keeps almost the entire quad: the band from 70% out is roughly half
 * the quad's *area* while carrying at most 0.16 alpha — nearly invisible, fully
 * paid for. Raising the threshold discards that band before blending. What it
 * costs is the faintest outer halo on every star, which tightens them slightly.
 *
 * Counts are the blunter lever and change the composition, so they move second
 * and only in the sparsest profile.
 *
 * These are aesthetic trade-offs, which is why they are named profiles rather
 * than a single tuned constant: the difference has to be looked at on real
 * hardware, and this file is what makes two builds comparable side by side.
 * `full` is the shipped scene, unchanged.
 */

export namespace CosmosFill {
  export type ProfileName = "full" | "lean" | "sparse";

  export type Profile = {
    /** Fragments below this alpha are discarded before blending. */
    readonly alphaTest: number;
    /** Multiplier on the deep-field and galaxy-band star counts. */
    readonly countScale: number;
  };

  const PROFILES: Readonly<Record<ProfileName, Profile>> = {
    // The scene as designed.
    full: { alphaTest: 0.02, countScale: 1 },
    // Same stars, same composition — only the invisible outer half of each
    // sprite's quad stops being blended.
    lean: { alphaTest: 0.1, countScale: 1 },
    // Tighter sprites and ~30% fewer of them. Changes how dense the sky reads.
    sparse: { alphaTest: 0.1, countScale: 0.7 },
  };

  export const DEFAULT_PROFILE: ProfileName = "full";

  export function isProfileName(value: string | null | undefined): value is ProfileName {
    return value === "full" || value === "lean" || value === "sparse";
  }

  /** Unknown or absent names resolve to the shipped scene rather than throwing. */
  export function profile(name: string | null | undefined): Profile {
    return PROFILES[isProfileName(name) ? name : DEFAULT_PROFILE];
  }

  export function scaleCount(count: number, name: string | null | undefined): number {
    return Math.max(0, Math.floor(count * profile(name).countScale));
  }
}
