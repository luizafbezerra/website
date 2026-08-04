export namespace Cosmos {
  export type SigilId =
    | "aries"
    | "taurus"
    | "gemini"
    | "cancer"
    | "leo"
    | "virgo"
    | "libra"
    | "scorpio"
    | "sagittarius"
    | "capricorn"
    | "aquarius"
    | "pisces";

  export type Sigil = {
    id: SigilId;
    glyph: string;
    name: string;
    marginalia: string;
  };

  // The `︎` suffix is the Unicode "text presentation selector" — it tells
  // the renderer to use the text glyph for the codepoint instead of the
  // platform's emoji font. Without it, Win/macOS render the zodiac as colored
  // emoji squares; with it, they render as a plain serif glyph.
  export const sigils: ReadonlyArray<Sigil> = [
    {
      id: "aries",
      glyph: "♈︎",
      name: "Áries",
      marginalia: "o princípio do impulso, do começar",
    },
    {
      id: "taurus",
      glyph: "♉︎",
      name: "Touro",
      marginalia: "o solo do corpo, do que dura",
    },
    {
      id: "gemini",
      glyph: "♊︎",
      name: "Gêmeos",
      marginalia: "o pareamento, a fala consigo",
    },
    {
      id: "cancer",
      glyph: "♋︎",
      name: "Câncer",
      marginalia: "a memória da casa, da água",
    },
    { id: "leo", glyph: "♌︎", name: "Leão", marginalia: "o brilho que se reconhece" },
    {
      id: "virgo",
      glyph: "♍︎",
      name: "Virgem",
      marginalia: "o cuidado do detalhe, da colheita",
    },
    {
      id: "libra",
      glyph: "♎︎",
      name: "Libra",
      marginalia: "o equilíbrio entre dois pesos",
    },
    {
      id: "scorpio",
      glyph: "♏︎",
      name: "Escorpião",
      marginalia: "o que se transforma no escuro",
    },
    {
      id: "sagittarius",
      glyph: "♐︎",
      name: "Sagitário",
      marginalia: "a flecha que busca o longe",
    },
    {
      id: "capricorn",
      glyph: "♑︎",
      name: "Capricórnio",
      marginalia: "o caminho que sobe lento",
    },
    {
      id: "aquarius",
      glyph: "♒︎",
      name: "Aquário",
      marginalia: "a água que se entrega ao todo",
    },
    {
      id: "pisces",
      glyph: "♓︎",
      name: "Peixes",
      marginalia: "o limite que dissolve, o sonho",
    },
  ];

  export type WheelPoint = { x: number; y: number; angleDeg: number };

  // Wheel positions: 12 evenly spaced, Aries at the top, clockwise.
  // Returns normalized coordinates in [-1..1] with screen-y (down positive).
  // Retained for the reduced-motion / no-canvas fallback only.
  export const sigilPosition = (index: number, radius = 0.78): WheelPoint => {
    const angleDeg = -90 + index * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
      angleDeg,
    };
  };

  // Deterministic RNG so star positions are stable across SSR/CSR and reloads.
  export const mulberry32 = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  export type Star = {
    x: number;
    y: number;
    z?: number;
    size: number;
    brightness: number;
    phase: number;
  };

  // v1 single-layer flat stars — preserved so any consumer that still references
  // `Cosmos.stars` keeps working (e.g. tests, the v1 fallback poster placeholder).
  const buildStars = (): Star[] => {
    const rng = mulberry32(0xc0de);
    const out: Star[] = [];
    const target = 86;
    let attempts = 0;
    while (out.length < target && attempts < 2000) {
      attempts++;
      const x = (rng() * 2 - 1) * 1.18;
      const y = (rng() * 2 - 1) * 0.86;
      const r = Math.hypot(x, y);
      if (r < 0.22) continue;
      out.push({
        x,
        y,
        size: 0.6 + rng() * 1.4,
        brightness: 0.4 + rng() * 0.6,
        phase: rng() * Math.PI * 2,
      });
    }
    return out;
  };

  export const stars: ReadonlyArray<Star> = buildStars();

  export type ConstellationPath = ReadonlyArray<number>;

  const buildConstellations = (): ConstellationPath[] => {
    const used = new Set<number>();
    const paths: number[][] = [];
    const seeds = [4, 19, 33, 51, 67];
    for (const seed of seeds) {
      if (used.has(seed) || seed >= stars.length) continue;
      const path: number[] = [seed];
      used.add(seed);
      let current = seed;
      const targetLen = 4 + (seed % 3);
      while (path.length < targetLen) {
        let best = -1;
        let bestD = Infinity;
        for (let j = 0; j < stars.length; j++) {
          if (used.has(j)) continue;
          const dx = stars[j].x - stars[current].x;
          const dy = stars[j].y - stars[current].y;
          const d = Math.hypot(dx, dy);
          if (d < bestD && d < 0.4) {
            bestD = d;
            best = j;
          }
        }
        if (best < 0) break;
        path.push(best);
        used.add(best);
        current = best;
      }
      if (path.length >= 3) paths.push(path);
    }
    return paths;
  };

  export const constellations: ReadonlyArray<ConstellationPath> = buildConstellations();

  // Section identity + copy. Drafts to be reviewed with Luiza before publish.
  export const sectionAnchorId = "ceu";
  export const sectionEyebrow = "Atlas celeste";
  export const sectionTitle = "Sob o céu interior";
  export const sectionDek =
    "Para Jung, o céu noturno é uma das formas mais antigas de a humanidade conversar consigo mesma: não como prescrição, mas como um vocabulário de padrões. Estas constelações não predizem; nomeiam.";
  export const sectionDisclaimer = "Não é uma análise astrológica; é uma evocação simbólica.";

  // Descent-beat epigraph. Anchored bottom-left of the cosmos sticky frame
  // during the final 15% of the scroll, fading in alongside the painted
  // horizon. Placeholder text for Luiza's review before publish — the
  // attribution to Jung for this quote is widely repeated but disputed
  // (not found verbatim in his published works); flag this when reviewing.
  export const descentEpigraph = {
    line: "Quem olha para fora, sonha. Quem olha para dentro, desperta.",
    attribution: "Carl Gustav Jung",
  } as const;
  export const sectionAriaLabel = "Atlas celeste — evocação simbólica, sem análise astrológica";
  export const sigilAriaLabel = (signName: string) => `Constelação de ${signName}`;

  // v1 scroll-cinema phase boundaries (preserved for backwards-compat with the
  // orchestrator's `--cosmos-sigil-opacity` CSS variable computation, which is
  // now used only by the reduced-motion / no-canvas branch).
  export const phases = {
    entry: [0, 0.1] as const,
    stars: [0.1, 0.35] as const,
    lines: [0.25, 0.55] as const,
    sigils: [0.45, 0.75] as const,
    idle: [0.75, 1.0] as const,
  };

  export const smoothstep = (x: number, a: number, b: number): number => {
    if (b <= a) return x >= b ? 1 : 0;
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  // Ken Perlin's smootherstep — 6t^5 - 15t^4 + 10t^3.
  // First AND second derivatives are zero at both ends, so adjacent
  // smootherstep segments stitch together with no visible velocity kink
  // at the boundary. Use this for camera path interpolation.
  export const smootherstep = (x: number, a: number, b: number): number => {
    if (b <= a) return x >= b ? 1 : 0;
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

  export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  // ============================================================================
  // v2 — Celestial Atlas v2: armillary in a painted cosmos
  // ============================================================================

  export type Vec3 = readonly [number, number, number];

  export const v3 = (x: number, y: number, z: number): Vec3 => [x, y, z];

  export const v3lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];

  const DEG = Math.PI / 180;
  export const deg2rad = (d: number): number => d * DEG;

  // Texture asset paths. v4 replaces the painted dome with a procedural
  // universe (shader-based nebulae + procedural starfields), but keeps the
  // dome.webp on disk for a future section. The brass photo is consumed as a
  // roughness micro-variation map by `MeshStandardMaterial`, not as base color.
  export const textures = {
    ringBrass: "/art/cosmos/ring-brass-v2.webp",
    ringBrushedRoughness: "/art/cosmos/ring-brushed-roughness.webp",
    sunGilt: "/art/cosmos/sun-gilt-v2.webp",
    cometHead: "/art/cosmos/comet-head.webp",
    cometTail: "/art/cosmos/comet-tail.webp",
    sigil: (id: SigilId): string => `/art/cosmos/sigils/${id}.webp`,
    poster: {
      avif: "/art/cosmos/poster.avif",
      webp: "/art/cosmos/poster.webp",
      jpg: "/art/cosmos/poster.jpg",
    },
    parchment: "/texture/parchment.webp",
  };

  // ---- Procedural universe (v4) --------------------------------------------
  // Deep-field stars: ~4000 points distributed uniformly on a thick spherical
  // shell at radii 30–80. Per-vertex colour sampled from a warm distribution
  // so the cosmos reads cream/gilt with rare warm reds and a few cool blues
  // that punctuate without clashing.
  export const deepField = {
    count: 4000,
    radiusMin: 30,
    radiusMax: 80,
    // 0.45 (down from 0.6) keeps the deep field reading as a textured sky
    // without paying as much fillrate for alpha-tested sprites at high DPR.
    size: 0.45,
    // Cumulative palette weights — sampled by `pickStarColor` below.
    // Cream-warm dominant; gilt accent; rare terracotta warm-reds; rare cool
    // blue-whites that lend "cosmic" punctuation without breaking the brief.
    palette: {
      cream: { weight: 0.7, rgb: [1.0, 0.96, 0.86] as const },
      gilt: { weight: 0.2, rgb: [0.98, 0.84, 0.5] as const },
      terracotta: { weight: 0.07, rgb: [0.85, 0.42, 0.28] as const },
      coolBlue: { weight: 0.03, rgb: [0.72, 0.84, 1.0] as const },
    },
  } as const;

  // Galaxy band — ~1200 stars concentrated along an inclined great-circle.
  // Skewed warmer than the deep field so the band reads as a "warm river".
  export const galaxyBand = {
    count: 1200,
    radiusMin: 30,
    radiusMax: 80,
    size: 0.42,
    // Normal to the great-circle plane (NOT normalized — consumer normalizes).
    planeNormal: [0.2, 1.0, 0.15] as const,
    halfWidthDeg: 12,
    palette: {
      cream: { weight: 0.78, rgb: [1.0, 0.96, 0.86] as const },
      gilt: { weight: 0.18, rgb: [0.98, 0.84, 0.5] as const },
      terracotta: { weight: 0.04, rgb: [0.85, 0.42, 0.28] as const },
    },
  } as const;

  // Nebulae shader — applied to an inverted sphere at radius 100.
  // No time uniform: static painterly wash.
  export const nebulae = {
    radius: 100,
    // 32×16 = 512 triangles. The nebula texture is a low-frequency painterly
    // wash so vertex density never matters; this is geometry-only savings.
    sphereSegments: 32,
    sphereRings: 16,
  } as const;

  // ---- Armillary sphere ------------------------------------------------------

  export type Ring = {
    id: string;
    radius: number;
    tube: number; // tube thickness
    // Euler XYZ angles in *degrees* applied to a torus that defaults to the XY plane
    // (the hole faces +Z). Consumer converts to radians for THREE.Euler.
    eulerDeg: readonly [number, number, number];
    // Optional positional offset (rare; polar circle uses it to sit near the top).
    offset?: Vec3;
  };

  export const armillary = {
    rings: [
      // Equator: lying horizontal (in XZ plane).
      { id: "equator", radius: 1.0, tube: 0.014, eulerDeg: [90, 0, 0] },
      // Ecliptic: equator tilted 23.5° east-west. Carries the zodiac sigils.
      { id: "ecliptic", radius: 1.0, tube: 0.016, eulerDeg: [90, 0, 23.5] },
      // Meridian: vertical great circle through the poles.
      { id: "meridian", radius: 1.0, tube: 0.014, eulerDeg: [0, 90, 0] },
      // Horizon: another oblique great circle for visual layering.
      { id: "horizon", radius: 1.06, tube: 0.018, eulerDeg: [60, 0, 35] },
      // Polar circle: small parallel near the top of the sphere.
      {
        id: "polar",
        radius: 0.32,
        tube: 0.01,
        eulerDeg: [90, 0, 0],
        offset: [0, 0.92, 0] as Vec3,
      },
    ] satisfies ReadonlyArray<Ring>,
    rotationRpm: 0.25, // ~1 full turn every 4 minutes about the Y axis.
    wobbleAmpDeg: 3, // ±3° secondary tilt.
    wobblePeriodSec: 8,
    sunRadius: 0.085,
    // 64 ring segments × 12 tubular = 768 triangles per ring. Below 64 the
    // rings start to read as faceted polygons; above that the silhouette is
    // visually identical. 12 tubular keeps the cross-section round enough at
    // tube radii ~0.014–0.018.
    ringSegments: 64,
    tubularSegments: 12,
  } as const;

  // 3D positions for the twelve sigils on the *ecliptic* ring.
  // i = 0 (Áries) is at the top, indices proceed clockwise as viewed from +Z.
  export const sigilPosition3D = (index: number, radius = 1.04): Vec3 => {
    const angle = index * (Math.PI / 6) - Math.PI / 2;
    // Position on the equator's plane (XZ), then tilt by ecliptic angle around X.
    const x0 = Math.cos(angle) * radius;
    const z0 = Math.sin(angle) * radius;
    const tilt = deg2rad(armillary.rings[1].eulerDeg[2]); // 23.5° around Z
    // Apply z-axis rotation: x' = x cosθ - y sinθ, y' = x sinθ + y cosθ
    const x = x0 * Math.cos(tilt);
    const y = x0 * Math.sin(tilt);
    return [x, y, z0];
  };

  // ---- Foreground star shell (v3) -------------------------------------------
  // A single spherical distribution of small painted dots around the camera.
  // Replaces v2's three parallel parallax planes (which left the back
  // hemisphere blank when the camera rotated). Uniform-on-sphere sampling
  // via inverse-CDF so density is even wherever the camera points.

  export type StarShellPoint = {
    pos: Vec3;
    size: number;
    accent: boolean; // gilt-warm (rare) vs cream-warm ink (common)
    phase: number;
  };

  export const starShell = {
    count: 120,
    radiusMin: 4.0,
    radiusMax: 8.0,
    // Sprite size in world units. Smaller and sharper than v2's blurred discs.
    sizeRange: [0.04, 0.06] as readonly [number, number],
    // ~10% of dots are slightly larger gilt accents; the rest cream-warm ink.
    accentRatio: 0.1,
  } as const;

  // Inverse-CDF uniform-sphere sample. z = 1 - 2u gives even latitude density.
  export const sampleOnSphere = (rng: () => number, radius: number): Vec3 => {
    const z = 1 - 2 * rng();
    const phi = rng() * Math.PI * 2;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    return [Math.cos(phi) * r * radius, z * radius, Math.sin(phi) * r * radius];
  };

  const buildStarShell = (): StarShellPoint[] => {
    const rng = mulberry32(0xc05f1e);
    const out: StarShellPoint[] = [];
    for (let i = 0; i < starShell.count; i++) {
      const radius = lerp(starShell.radiusMin, starShell.radiusMax, rng());
      out.push({
        pos: sampleOnSphere(rng, radius),
        size: lerp(starShell.sizeRange[0], starShell.sizeRange[1], rng()),
        accent: rng() < starShell.accentRatio,
        phase: rng() * Math.PI * 2,
      });
    }
    return out;
  };

  export const starShellPoints: ReadonlyArray<StarShellPoint> = buildStarShell();

  // ---- Comets ----------------------------------------------------------------

  export type CometTrajectory = {
    start: Vec3;
    c1: Vec3; // bezier control 1
    c2: Vec3; // bezier control 2
    end: Vec3;
    durationSec: number; // total traversal time
    size: number;
  };

  // 4 hand-tuned curves with strongly off-axis control points so the path
  // visibly arcs (rainbow-style) instead of reading as a straight diagonal.
  // The comet system picks one at random each spawn.
  export const cometTrajectories: ReadonlyArray<CometTrajectory> = [
    {
      // High arch left→right, vault over the armillary.
      start: [-12, 1.4, -3.0],
      c1: [-5.5, 8.0, -2.0],
      c2: [5.5, 7.5, -2.5],
      end: [12, 1.8, -3.0],
      durationSec: 16,
      size: 0.14,
    },
    {
      // Deep dip right→left, sweep under.
      start: [11.5, 3.0, -2.5],
      c1: [3.5, -5.5, -2.0],
      c2: [-3.5, -6.0, -2.5],
      end: [-11.5, 2.6, -3.5],
      durationSec: 18,
      size: 0.12,
    },
    {
      // Upper-left → lower-right with a clear downward bow.
      start: [-10.5, 5.0, -3.0],
      c1: [-2.0, -3.0, -2.5],
      c2: [4.0, -2.0, -3.0],
      end: [11.0, 4.4, -2.5],
      durationSec: 17,
      size: 0.13,
    },
    {
      // Lower-right → upper-left with a clear upward bow.
      start: [10.5, -4.0, -3.0],
      c1: [4.0, 6.0, -2.5],
      c2: [-4.0, 7.0, -2.0],
      end: [-11.0, -2.0, -3.0],
      durationSec: 19,
      size: 0.12,
    },
  ];

  export const cubicBezier3 = (t: number, p0: Vec3, c1: Vec3, c2: Vec3, p1: Vec3): Vec3 => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const ttt = tt * t;
    const uuu = uu * u;
    return [
      uuu * p0[0] + 3 * uu * t * c1[0] + 3 * u * tt * c2[0] + ttt * p1[0],
      uuu * p0[1] + 3 * uu * t * c1[1] + 3 * u * tt * c2[1] + ttt * p1[1],
      uuu * p0[2] + 3 * uu * t * c1[2] + 3 * u * tt * c2[2] + ttt * p1[2],
    ];
  };

  // Bezier derivative — used to orient the comet's tail along its motion.
  export const cubicBezier3Tangent = (t: number, p0: Vec3, c1: Vec3, c2: Vec3, p1: Vec3): Vec3 => {
    const u = 1 - t;
    const uu = u * u;
    const tt = t * t;
    return [
      3 * uu * (c1[0] - p0[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * tt * (p1[0] - c2[0]),
      3 * uu * (c1[1] - p0[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * tt * (p1[1] - c2[1]),
      3 * uu * (c1[2] - p0[2]) + 6 * u * t * (c2[2] - c1[2]) + 3 * tt * (p1[2] - c2[2]),
    ];
  };

  // Spawn cadence: after a traversal, wait this long before the next spawn.
  export const cometCooldownRange: readonly [number, number] = [30, 60];

  // ---- Camera cinema (v7 — painted prelude → orbit → descent) -------------
  // Three phases, identical scroll mapping to v5/v6: dolly approach,
  // continuous polar orbit, descent pull-back. The approach phase doubles
  // as the painted-scene prelude — five Z-staggered painted planes sit
  // between the start camera and the universe; they fade as the camera
  // passes through each, materializing into the simulated cosmos. The
  // orbit and descent phases are unchanged from v6.

  export type CameraKey = { pos: Vec3; look: Vec3 };

  // Orbit phase ends at 0.70 and the descent phase owns the final 30% of
  // the scroll. The earlier handoff lets the lookY ramp toward the descent
  // endpoint start sooner so the armillary slides out of frame smoothly
  // without a perceived velocity reversal at the boundary. Consumers
  // (CSS-var driven overlays) read these to gate their own envelopes.
  export const cameraPhases = {
    zoomIn: { range: [0.0, 0.25] as const },
    orbit: { range: [0.25, 0.7] as const },
    descent: { range: [0.7, 1.0] as const },
  };

  // Universe Y offset. The armillary, constellations, nebula sphere, deep
  // field, comets — everything except the painted prelude — is translated
  // up by this much in world space. The painted scene stays at world
  // y≈0; the universe lives at y≈OFFSET in the sky. The camera rises up
  // through the painted cloud layer during the approach and arrives at
  // the elevated universe naturally, looking horizontally forward — no
  // tilt-back-down.
  //
  // Consumers: `<CosmosCanvas>` wraps the universe content in
  // `<group position={[0, OFFSET, 0]}>`; `bakeArmillaryMatcap` positions its
  // cube camera at the same offset so the baked reflection matches.
  export const UNIVERSE_Y_OFFSET = 7.0;

  // Approach starts far back (z=25) at human-eye level (y=1.4) so the
  // painted-scene prelude reads as "view FROM the ground." KEY_MID is the
  // orbit-start position — elevated to UNIVERSE_Y_OFFSET so the camera
  // ends up at the universe's altitude rather than at its world-y=0.
  const KEY_FAR_IN: CameraKey = { pos: [0, 1.4, 25], look: [0, 1.4, 0] };
  // Camera ends at universe altitude, looking horizontally forward at the
  // armillary center. No vertical offset between cam-y and look-y, so the
  // approach can resolve to a flat horizontal gaze with no tilt-down.
  const KEY_MID: CameraKey = {
    pos: [0, UNIVERSE_Y_OFFSET, 3.6],
    look: [0, UNIVERSE_Y_OFFSET, 0],
  };
  // Descent endpoint: camera pulls back a bit and tilts the look WAY up so
  // the armillary slides out of the bottom of the frame and the visitor
  // ends the section looking at pure starscape / nebulae — the "focus on
  // the stars before scrolling out" beat.
  const KEY_DESCENT: CameraKey = {
    pos: [0, UNIVERSE_Y_OFFSET, 7.6],
    look: [0, UNIVERSE_Y_OFFSET + 7.0, 0],
  };

  // Orbit shape: just under one full turn so the visitor sees the full sphere
  // and a bit. Radius drifts in slightly during the orbit so the scene feels
  // alive. The camera's Y holds at UNIVERSE_Y_OFFSET and the lookAt holds
  // at KEY_MID.look — the orbit yaw alone provides motion, and the descent
  // phase owns the upward lookY ramp so the whole timeline reads as a
  // single monotonic lift with no mid-orbit bob or peak.
  const ORBIT_R_START = 3.6;
  const ORBIT_R_END = 3.2;
  const ORBIT_TURNS = 0.9;
  const ORBIT_A_START = Math.atan2(KEY_MID.pos[2], KEY_MID.pos[0]);
  const ORBIT_A_END_REL = Math.PI * 2 * ORBIT_TURNS;

  // Approach-phase camera arc. A front dwell, then two beats:
  //
  //   * p ∈ [0, APPROACH_HOLD] — dwell: the camera holds dead-still at
  //     KEY_FAR_IN so the painted ground composition can be read before any
  //     motion. The remaining [HOLD, 0.25] is linearly remapped back onto the
  //     full [0, 0.25] domain (see cameraKeyAtProgress) and fed into the two
  //     windows below unchanged — so the beats play out exactly as before,
  //     just compressed into the post-dwell scroll.
  //   * (remapped) [0, INTRO_END] — first tick: pure forward dolly. The
  //     visitor sits in the painted ground composition; nothing tilts.
  //   * (remapped) [INTRO_END, 0.25] — rise: camera y AND look-y both lerp
  //     monotonically toward `KEY_MID`. Crucially, look-y reaches its end
  //     value FASTER than camera-y (different easing windows) — so the
  //     look line stays ABOVE the camera throughout the rise, producing
  //     a sustained upward tilt that resolves to horizontal exactly at
  //     the orbit boundary. No look-y peak, no descent — the camera never
  //     tilts back down.
  const APPROACH_INTRO_END = 0.04;
  // Position y lerps across the full post-intro window.
  const APPROACH_Y_WINDOW = [APPROACH_INTRO_END, 0.25] as const;
  // Look-y reaches its end value earlier than position so the camera tilts
  // up during the rise. Once look reaches `KEY_MID.look[1]`, it plateaus
  // there — camera y then catches up, and the tilt drops to zero by the
  // orbit boundary without ever passing through "looking down."
  const APPROACH_LOOK_WINDOW = [APPROACH_INTRO_END, 0.14] as const;

  // Front-of-phase dwell. The section is pinned and fully fills the screen at
  // p=0; for the first APPROACH_HOLD of scroll the camera holds dead-still at
  // KEY_FAR_IN (no Z dolly, no Y rise, no look tilt) so the painted ground is
  // read before any motion. Because the post-dwell remap scales all three
  // easing windows proportionally, the look-leads-camera up-tilt is preserved
  // exactly (peak lookY − camY ≈ 3.68, same as before the dwell).
  //
  // 0.08 ≈ 22vh of motionless scroll (p × 275vh) — a slight dwell that keeps
  // the prelude envelopes in sync: the camera clears the last painted prop
  // (lowest propZ = 11, so camZ ≤ 9.5) at p ≈ 0.186, while preludeMasterOpacity
  // is still ≈ 0.23 into its 0.16 → 0.20 fade — per-prop and master fades stay
  // co-directional with healthy margin, so no prop snap-fades mid-frame. Do not
  // raise above ~0.10: at 0.12 the camera clears the last prop only after the
  // master fade has finished, snap-fading cloud-4.
  const APPROACH_HOLD = 0.08;

  export const cameraKeyAtProgress = (p: number): CameraKey => {
    // Zoom-in: a front dwell (camera still at KEY_FAR_IN), then a monotonic
    // rise where look-y leads camera-y so the camera always tilts UP (or
    // horizontal), never down. Resolves exactly to KEY_MID at p=0.25 (no orbit
    // kink).
    if (p <= cameraPhases.zoomIn.range[1]) {
      const zoomEnd = cameraPhases.zoomIn.range[1];
      // Dwell: for the first APPROACH_HOLD of scroll the camera is completely
      // still at KEY_FAR_IN — no Z dolly, no Y rise, no look tilt.
      if (p <= APPROACH_HOLD) {
        return {
          pos: [KEY_FAR_IN.pos[0], KEY_FAR_IN.pos[1], KEY_FAR_IN.pos[2]],
          look: [KEY_FAR_IN.look[0], KEY_FAR_IN.look[1], KEY_FAR_IN.look[2]],
        };
      }
      // Linearly remap [APPROACH_HOLD, zoomEnd] back onto [0, zoomEnd], then
      // feed that adjusted progress into the EXISTING smootherstep windows
      // unchanged. adj(zoomEnd) === zoomEnd, so the curve still resolves to
      // KEY_MID at p=0.25 with no orbit-boundary pop, and scaling all three
      // windows proportionally preserves the look-leads-camera up-tilt.
      // smootherstep's zero start-derivative means motion begins from rest, so
      // velocity stays continuous across the dwell boundary (no kink).
      const adj = ((p - APPROACH_HOLD) / (zoomEnd - APPROACH_HOLD)) * zoomEnd;
      const tZ = smootherstep(adj, cameraPhases.zoomIn.range[0], zoomEnd);
      // Y position waits for the (remapped) intro to finish, then rises slowly.
      const tY = smootherstep(adj, APPROACH_Y_WINDOW[0], APPROACH_Y_WINDOW[1]);
      // Look-y rises faster, plateauing well before camera-y catches up.
      const tLook = smootherstep(adj, APPROACH_LOOK_WINDOW[0], APPROACH_LOOK_WINDOW[1]);
      const camY = lerp(KEY_FAR_IN.pos[1], KEY_MID.pos[1], tY);
      const camZ = lerp(KEY_FAR_IN.pos[2], KEY_MID.pos[2], tZ);
      const lookY = lerp(KEY_FAR_IN.look[1], KEY_MID.look[1], tLook);
      return {
        pos: [0, camY, camZ],
        look: [0, lookY, 0],
      };
    }
    // Orbit: continuous polar yaw at the universe altitude. Radius pulls in
    // 3.6 → 3.2 across the phase; camera Y and lookY both hold flat so the
    // motion reads as a single horizontal sweep. The upward look ramp is
    // owned entirely by the descent phase below.
    if (p <= cameraPhases.orbit.range[1]) {
      const t = smootherstep(p, cameraPhases.orbit.range[0], cameraPhases.orbit.range[1]);
      const a = ORBIT_A_START + t * ORBIT_A_END_REL;
      const r = lerp(ORBIT_R_START, ORBIT_R_END, t);
      return {
        pos: [Math.cos(a) * r, KEY_MID.pos[1], Math.sin(a) * r],
        look: [0, KEY_MID.look[1], 0],
      };
    }
    // Descent: continues the orbit's horizontal sweep with a monotonic
    // upward lookY ramp from KEY_MID.look (7.0) to KEY_DESCENT.look (14.0),
    // so the armillary slides out the bottom of the frame as the camera
    // pulls back. The look start anchors at KEY_MID.look — not at the
    // origin — so the boundary is C0/C1 continuous with the orbit branch
    // and the sequence reads as a single lift, not a drop-then-rise.
    const t = smootherstep(p, cameraPhases.descent.range[0], cameraPhases.descent.range[1]);
    const a1 = ORBIT_A_START + ORBIT_A_END_REL;
    const orbitEnd: Vec3 = [Math.cos(a1) * ORBIT_R_END, KEY_MID.pos[1], Math.sin(a1) * ORBIT_R_END];
    const orbitEndLook: Vec3 = [0, KEY_MID.look[1], 0];
    return {
      pos: v3lerp(orbitEnd, KEY_DESCENT.pos, t),
      look: v3lerp(orbitEndLook, KEY_DESCENT.look, t),
    };
  };

  // Sigil overlay visibility envelope, re-tuned for the 3-phase timing.
  // The sigils are most legible during the orbit phase (0.25 → 0.85) when
  // the camera is close in; fade in alongside the armillary as the painted
  // prelude dissolves, and out before the descent begins so the final beat
  // carries a single epigraph instead of twelve competing labels.
  // Smootherstep on both edges so opacity has no velocity step. The fade-in
  // window matches `armillaryOpacity` (0.20 → 0.30) so the brass rings and
  // their riding sigils materialize together.
  export const sigilOverlayOpacity = (p: number): number => {
    const fadeIn = smootherstep(p, 0.2, 0.3);
    const fadeOut = 1 - smootherstep(p, 0.78, 0.9);
    return fadeIn * fadeOut;
  };

  // ---- v7 prelude helpers ---------------------------------------------------

  // Armillary + sigil opacity envelope. The painted prelude owns the screen
  // through p ∈ [0, 0.20]; the universe (armillary, sun sprite, sigil glyphs)
  // materializes between p = 0.20 → 0.30 as the last painted layers fade out.
  // Smootherstep so the dissolve has zero-derivative edges and the materials
  // never visibly pop in or out.
  export const armillaryOpacity = (p: number): number => smootherstep(p, 0.2, 0.3);

  // Per-prop painted-plane opacity. A prop is fully visible while the
  // camera is more than 1.5 world units in front of it, and fully invisible
  // once the camera reaches or passes the prop's Z. Smootherstep gives the
  // fade derivative-zero edges so prop transitions don't pop. Reverse-scroll
  // works identically: as the camera retreats past a prop's Z + 1.5, the
  // plane re-materializes.
  export const preludePropOpacity = (cameraZ: number, propZ: number): number =>
    smootherstep(cameraZ - propZ, -1.5, 0.0);

  // Master scroll-driven fade for the entire painted prelude. Multiplied into
  // each layer's per-layer (camera-Z) opacity so the painted scene is fully
  // gone by p=0.20 — before the armillary + sigils start to materialize at
  // p=0.20. Without this, the sky plane (z=5) would still be ~30% opaque at
  // p=0.22 while the universe is already fading in behind it, producing a
  // muddy overlap during the transition. With it, the painted scene exits
  // cleanly, leaving the canvas blank for ~0.5 of a scroll-tick before the
  // universe begins to develop.
  export const preludeMasterOpacity = (p: number): number => 1 - smootherstep(p, 0.16, 0.2);

  // Painted-prelude prop manifest. The 3D nebula + deep field + comets ARE
  // the sky behind these props; the painted scene is a sparse arrangement of
  // discrete cut-outs (clouds, land strip, trees, rocks, bush, single figure)
  // positioned in 3D between camera (z=25) and the universe. Each prop is
  // its own solid PNG alpha so the 3D sky shows through *between* props but
  // never *through* them.
  //
  // `PreludeAssetId` enumerates the baked WebPs (one bake per asset);
  // `PreludeProp.asset` says which asset a given instance loads. Multiple
  // props can share an asset (the two cloud shapes are instanced several
  // times across the upper portion of the frame so the cloud cover reads
  // dense without paying for redundant bakes / network fetches).
  //
  // `anchor: "bottom"` means `position.y` is the bottom edge of the prop
  // (the runtime offsets the mesh's local y by `+scale/2`); ground-aligned
  // props use this so a tree at y=0 stands on the horizon rather than being
  // centred on it. `scale` is world-height in units; runtime computes the
  // world-width from the texture's aspect at mount.
  export type PreludeAssetId =
    | "land"
    | "tree-left"
    | "tree-right"
    | "rock-near"
    | "rock-far"
    | "bush"
    | "figure"
    | "cloud-soft"
    | "cloud-dense";

  export const preludeAssetPath = (id: PreludeAssetId): string => `/art/cosmos/prelude/${id}.webp`;

  export type PreludeProp = {
    id: string;
    asset: PreludeAssetId;
    position: Vec3;
    scale: number;
    anchor?: "center" | "bottom";
  };

  export const preludeProps: ReadonlyArray<PreludeProp> = [
    // Clouds — six instances of two shapes (cloud-soft from clouds.png,
    // cloud-dense from clouds02.png) scattered across the upper portion of
    // the sky at varied Z for parallax depth on the dolly. Cloud cover
    // reads dense without baking six distinct WebPs.
    { id: "cloud-1", asset: "cloud-dense", position: [3.5, 4.8, 13], scale: 3.2 },
    { id: "cloud-2", asset: "cloud-soft", position: [-3.0, 4.2, 14], scale: 2.6 },
    { id: "cloud-3", asset: "cloud-soft", position: [5.5, 3.0, 12], scale: 2.4 },
    { id: "cloud-4", asset: "cloud-dense", position: [-5.5, 5.5, 11], scale: 2.8 },
    { id: "cloud-5", asset: "cloud-soft", position: [1.5, 2.2, 16], scale: 1.6 },
    { id: "cloud-6", asset: "cloud-soft", position: [-2.0, 2.8, 17], scale: 1.4 },
    // Horizon strip — painted dusk valley + distant mountains + river.
    // Source 1536×1024; bake crops top 30% (the painted sunset sky) so
    // the effective aspect becomes ~2.14:1. Scale + position size the
    // strip to cover the full screen width on wide viewports without
    // dominating vertically.
    {
      id: "land",
      asset: "land",
      position: [0, 0.0, 20],
      scale: 3.6,
      anchor: "center",
    },
    // Trees — in front of the land (z > 20) so they aren't occluded by
    // the land plane. y is set so the tree base sits just above the lower
    // frame edge at z≈20.5 (camera y=1.4, frustum-half-height≈1.52 →
    // frame y bottom ≈ -0.12). x stays inside the frustum on wide aspects.
    {
      id: "tree-left",
      asset: "tree-left",
      position: [-2.0, -0.1, 20.6],
      scale: 1.8,
      anchor: "bottom",
    },
    {
      id: "tree-right",
      asset: "tree-right",
      position: [2.2, -0.1, 20.4],
      scale: 1.5,
      anchor: "bottom",
    },
    // Rocks — scattered foreground anchors, low in the frame.
    {
      id: "rock-near",
      asset: "rock-near",
      position: [-0.8, -0.9, 22],
      scale: 0.8,
      anchor: "bottom",
    },
    {
      id: "rock-far",
      asset: "rock-far",
      position: [1.5, -0.5, 21],
      scale: 0.6,
      anchor: "bottom",
    },
    // Bush — closest prop to the camera, just inside the lower frame.
    {
      id: "bush",
      asset: "bush",
      position: [0.2, -1.0, 23],
      scale: 0.5,
      anchor: "bottom",
    },
    // Figure — single solitary silhouette (Wanderer archetype). Source PNG
    // is 93x190; placed just IN FRONT of the land (z=20.5, > land's z=20 so
    // it isn't occluded) and at a small world scale so the projected size
    // stays close to the source pixel height and the silhouette renders
    // crisply rather than upscaled.
    {
      id: "figure",
      asset: "figure",
      position: [-0.7, 0.3, 20.5],
      scale: 0.22,
      anchor: "bottom",
    },
  ];

  // Mobile/reduced-motion static fallback. The prop scene pre-flattened at
  // build time, so the static path pays one image decode instead of nine
  // and renders without WebGL.
  export const preludeCompositeMobile = "/art/cosmos/prelude/composite-mobile.webp";

  // Texture URLs warmed during the cosmos approach (idle preload in
  // `<CosmosBody>`), so the shared `THREE.TextureLoader` fetches inside
  // `useOptionalTexture` resolve from the HTTP cache rather than contending
  // for bandwidth at reveal time — the project loads these raw `/art/...`
  // paths (not `next/image`), so a `new Image()` warm shares the same cache
  // key. Built from the unique painted prelude assets (clouds, land, trees,
  // rocks, bush, figure) plus the brushed-brass roughness map (sampled once
  // during the armillary matcap bake; warming it lets that bake take its
  // immediate path instead of the 500ms cold-cache fallback). The twelve
  // zodiac sigils are intentionally excluded — they stay lazy in the sigil
  // popover, loaded only when the visitor opens one.
  export const warmupTextureUrls: ReadonlyArray<string> = [
    ...new Set(preludeProps.map((p) => p.asset)),
  ]
    .map(preludeAssetPath)
    .concat(textures.ringBrushedRoughness);

  // Camera FOV used by the cosmos canvas. Kept here so the prelude plane
  // sizing logic can compute world-space extents that fill the frustum at
  // each layer's Z without re-deriving the camera config.
  export const cameraFovDeg = 38;

  // World-space half-extent (vertical) of the frustum at a given distance
  // from the camera. Each prelude plane scales to twice this in height +
  // proportionally in width (using the runtime aspect ratio) so the painted
  // content always fills the frame at p=0 regardless of Z.
  export const frustumHalfHeightAt = (distance: number): number =>
    Math.tan((cameraFovDeg / 2) * DEG) * distance;

  // Descent-beat fade envelope. Hidden through the orbit phase; fades in
  // across the first half of the descent (0.85 → 0.95) and holds at full
  // opacity through scroll end. Consumed by the FBM cloud planes inside the
  // canvas AND the DOM overlay epigraph so cloud drift and the closing
  // Jungian line appear together. (Earlier named `horizonFadeOpacity` when
  // the beat was a painted horizon plane; the horizon was dropped in
  // favour of a sky-dominant beat.)
  export const descentBeatOpacity = (p: number): number =>
    smootherstep(p, cameraPhases.descent.range[0], 0.95);

  // Constellation line network fade. Lines appear mid-orbit (when the
  // camera is closest in and the sigils still dominate visual attention is
  // fine — these are background context, not foreground UI) and reach full
  // opacity well before the descent so they're already legible when the
  // descent's wider camera framing arrives. Capped at 0.5 base opacity by
  // the consumer's material.
  export const constellationLineOpacity = (p: number): number => smootherstep(p, 0.5, 0.7);

  // Constellation VERTEX STAR fade. Brighter than the lines, fades in
  // slightly earlier so the named-star pattern reads before the connecting
  // strokes — the references emphasize bright stars at the network nodes
  // and that's what readers parse first. Consumer applies a gentle
  // sinusoidal twinkle on top of this base envelope.
  export const constellationStarOpacity = (p: number): number => smootherstep(p, 0.42, 0.62);

  // Comet fade-out during the descent. Comets are foreground motion that
  // would compete with the constellation network in the final framing, so
  // their head + tail opacity is scaled by this multiplier — 1 through the
  // orbit, fading to 0 across the same 0.78 → 0.92 window the sigil
  // overlay uses for its own fade-out.
  export const cometDescentDimming = (p: number): number => 1 - smootherstep(p, 0.78, 0.92);

  // ---- Painted-poster fallback positions (stub) ------------------------------

  // Filled in by §9 of the design brief after the keyframe (end of Phase 3) is
  // rasterized and the 12 sigil 3D positions are projected to 2D screen coords.
  // Until then the reduced-motion / no-canvas branch falls back to the wheel
  // layout from sigilPosition(index).
  export type PosterPosition = { id: SigilId; x: number; y: number };
  export const posterSigilPositions: ReadonlyArray<PosterPosition | null> = [
    null, // aries
    null, // taurus
    null, // gemini
    null, // cancer
    null, // leo
    null, // virgo
    null, // libra
    null, // scorpio
    null, // sagittarius
    null, // capricorn
    null, // aquarius
    null, // pisces
  ];
}
