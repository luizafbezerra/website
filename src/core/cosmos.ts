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
  const mulberry32 = (seed: number) => {
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
    "Para Jung, o céu noturno é uma das linguagens mais antigas que temos para conversar com nós mesmos — não como prescrição, mas como um vocabulário de padrões. Estas constelações não predizem; elas nomeiam.";
  export const sectionDisclaimer = "Não é uma análise astrológica; é uma evocação simbólica.";
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

  // Texture asset paths. Files are stubbed during initial implementation; ring
  // materials fall back to solid palette colours when the texture is missing.
  // Texture processing pipeline lives in §7 of the design brief.
  export const textures = {
    ringBrass: "/art/cosmos/ring-brass.webp",
    sunGilt: "/art/cosmos/sun-gilt.webp",
    star: ["/art/cosmos/star-1.webp", "/art/cosmos/star-2.webp", "/art/cosmos/star-3.webp"],
    nebula: [
      "/art/cosmos/nebula-1.webp",
      "/art/cosmos/nebula-2.webp",
      "/art/cosmos/nebula-3.webp",
      "/art/cosmos/nebula-4.webp",
    ],
    milkyWay: "/art/cosmos/milky-way.webp",
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
    // Palette stubs — replaced visually by the brass texture once shipped.
    ringColor: "#b07a3a", // ochre/brass placeholder
    ringColorAccent: "#8a5a2a", // shadow side
    sunColor: "#d8a04a", // gilt
    sunRadius: 0.085,
    ringSegments: 96,
    tubularSegments: 16,
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

  // ---- Star field (3 parallax layers) ----------------------------------------

  export type StarLayer = {
    id: "near" | "mid" | "far";
    z: number; // approximate depth at the scene origin
    count: number;
    spread: { x: number; y: number };
    sizeRange: readonly [number, number];
    brightnessRange: readonly [number, number];
  };

  export const starLayers: ReadonlyArray<StarLayer> = [
    {
      id: "near",
      z: -1.8,
      count: 38,
      spread: { x: 7, y: 4.5 },
      sizeRange: [0.04, 0.08],
      brightnessRange: [0.65, 0.95],
    },
    {
      id: "mid",
      z: -4.5,
      count: 52,
      spread: { x: 16, y: 10 },
      sizeRange: [0.03, 0.055],
      brightnessRange: [0.5, 0.85],
    },
    {
      id: "far",
      z: -9.0,
      count: 64,
      spread: { x: 36, y: 22 },
      sizeRange: [0.025, 0.045],
      brightnessRange: [0.35, 0.7],
    },
  ];

  // Pre-built deterministic star sets per layer. Seed differs per layer so the
  // layers don't visibly align.
  const buildStarLayer = (layer: StarLayer, seed: number): Star[] => {
    const rng = mulberry32(seed);
    const out: Star[] = [];
    for (let i = 0; i < layer.count; i++) {
      out.push({
        x: (rng() * 2 - 1) * layer.spread.x,
        y: (rng() * 2 - 1) * layer.spread.y,
        z: layer.z,
        size: lerp(layer.sizeRange[0], layer.sizeRange[1], rng()),
        brightness: lerp(layer.brightnessRange[0], layer.brightnessRange[1], rng()),
        phase: rng() * Math.PI * 2,
      });
    }
    return out;
  };

  export const starLayerStars: Record<StarLayer["id"], ReadonlyArray<Star>> = {
    near: buildStarLayer(starLayers[0], 0xa11ce),
    mid: buildStarLayer(starLayers[1], 0xb0b1e),
    far: buildStarLayer(starLayers[2], 0xc0c1e),
  };

  // ---- Nebulae ---------------------------------------------------------------

  export type Nebula = {
    id: string;
    position: Vec3;
    size: number;
    color: string;
    opacity: number;
    driftAmp: number;
    driftPeriodSec: number;
    driftPhase: number;
    textureIdx: number;
  };

  // 4 painted cloud washes at deep Z. Colours drawn from the site palette
  // (terracotta, cobalt, ochre, moss). Sparse on purpose — 1–2 in view at most.
  export const nebulae: ReadonlyArray<Nebula> = [
    {
      id: "n1",
      position: [-5.2, 1.4, -6.8],
      size: 4.6,
      color: "#7d3a25", // terracotta-deep wash
      opacity: 0.18,
      driftAmp: 0.32,
      driftPeriodSec: 34,
      driftPhase: 0,
      textureIdx: 0,
    },
    {
      id: "n2",
      position: [4.4, -1.8, -6.2],
      size: 3.8,
      color: "#36598a", // cobalt wash
      opacity: 0.16,
      driftAmp: 0.26,
      driftPeriodSec: 28,
      driftPhase: 1.4,
      textureIdx: 1,
    },
    {
      id: "n3",
      position: [0.9, 3.0, -8.2],
      size: 5.3,
      color: "#a67233", // ochre wash
      opacity: 0.15,
      driftAmp: 0.38,
      driftPeriodSec: 40,
      driftPhase: 2.6,
      textureIdx: 2,
    },
    {
      id: "n4",
      position: [-2.6, -2.4, -7.6],
      size: 3.2,
      color: "#5e7a3c", // moss wash
      opacity: 0.13,
      driftAmp: 0.22,
      driftPeriodSec: 32,
      driftPhase: 0.7,
      textureIdx: 3,
    },
  ];

  // ---- Milky Way band --------------------------------------------------------

  export const milkyWay = {
    position: [0, 0.4, -9.5] as Vec3,
    eulerDeg: [0, 0, 22] as readonly [number, number, number], // 22° tilt
    width: 26,
    height: 7,
    color: "#a07a40", // soft ochre placeholder (texture brings ochre→gilt→cobalt)
    opacity: 0.16,
  } as const;

  // Very slow opacity wobble so the band breathes — not consciously noticed.
  export const milkyWayBreath = (t: number): number => 0.88 + 0.12 * Math.sin(t * 0.06);

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

  // ---- Camera cinema (5 phases) ----------------------------------------------

  export type CameraKey = { pos: Vec3; look: Vec3 };

  export const cameraPhases = {
    entry: { range: [0.0, 0.12] as const },
    approach: { range: [0.12, 0.35] as const },
    orbit: { range: [0.35, 0.6] as const },
    tiltUp: { range: [0.6, 0.82] as const },
    recede: { range: [0.82, 1.0] as const },
  };

  // Keyframes. The orbit phase is a continuous polar arc (no kink at
  // mid-phase); other phases interpolate position + lookAt via smootherstep.
  // Entry uses two keyframes (far/end) so the camera drifts gently rather than
  // holding still — that removes the velocity step at the entry→approach
  // boundary.
  const KEY_FAR: CameraKey = { pos: [0, 0.04, 8.4], look: [0, 0, 0] };
  const KEY_ENTRY_END: CameraKey = { pos: [0, 0.12, 7.2], look: [0, 0, 0] };
  const KEY_APPROACH_END: CameraKey = { pos: [0, 0.32, 3.6], look: [0, 0, 0] };
  const KEY_ORBIT_END: CameraKey = { pos: [-3.0, 0.45, -1.5], look: [0, 0, 0] };
  const KEY_TILT_END: CameraKey = { pos: [-1.0, 2.7, -3.0], look: [0, 0.45, 0] };
  const KEY_RECEDE_END: CameraKey = { pos: [0, 1.0, 7.0], look: [0, 0, 0] };

  // Polar coordinates of approach-end (used as the orbit start point so the
  // approach→orbit hand-off has no positional jump).
  const ORBIT_R_START = Math.hypot(KEY_APPROACH_END.pos[0], KEY_APPROACH_END.pos[2]);
  const ORBIT_R_END = Math.hypot(KEY_ORBIT_END.pos[0], KEY_ORBIT_END.pos[2]);
  const ORBIT_A_START = Math.atan2(KEY_APPROACH_END.pos[2], KEY_APPROACH_END.pos[0]);
  // Angle of orbit-end — unwrapped so we always orbit counterclockwise via the
  // back of the armillary (rings cross in front/behind as the brief asks).
  const ORBIT_A_END = (() => {
    const raw = Math.atan2(KEY_ORBIT_END.pos[2], KEY_ORBIT_END.pos[0]);
    return raw < ORBIT_A_START ? raw + Math.PI * 2 : raw;
  })();

  export const cameraKeyAtProgress = (p: number): CameraKey => {
    // Entry: gentle drift FAR → ENTRY_END. Not static — keeps velocity
    // continuous through the boundary with the approach phase.
    if (p <= cameraPhases.entry.range[1]) {
      const t = smootherstep(p, cameraPhases.entry.range[0], cameraPhases.entry.range[1]);
      return {
        pos: v3lerp(KEY_FAR.pos, KEY_ENTRY_END.pos, t),
        look: v3lerp(KEY_FAR.look, KEY_ENTRY_END.look, t),
      };
    }
    // Approach: dolly forward from entry-end to approach-end.
    if (p <= cameraPhases.approach.range[1]) {
      const t = smootherstep(p, cameraPhases.approach.range[0], cameraPhases.approach.range[1]);
      return {
        pos: v3lerp(KEY_ENTRY_END.pos, KEY_APPROACH_END.pos, t),
        look: v3lerp(KEY_ENTRY_END.look, KEY_APPROACH_END.look, t),
      };
    }
    // Orbit: ONE continuous polar arc from approach-end's polar form to
    // orbit-end's, going via the back. No mid-phase kink.
    if (p <= cameraPhases.orbit.range[1]) {
      const t = smootherstep(p, cameraPhases.orbit.range[0], cameraPhases.orbit.range[1]);
      const a = lerp(ORBIT_A_START, ORBIT_A_END, t);
      const r = lerp(ORBIT_R_START, ORBIT_R_END, t);
      const y = lerp(KEY_APPROACH_END.pos[1], KEY_ORBIT_END.pos[1], t);
      return {
        pos: [Math.cos(a) * r, y, Math.sin(a) * r],
        look: v3lerp(KEY_APPROACH_END.look, KEY_ORBIT_END.look, t),
      };
    }
    // Tilt up.
    if (p <= cameraPhases.tiltUp.range[1]) {
      const t = smootherstep(p, cameraPhases.tiltUp.range[0], cameraPhases.tiltUp.range[1]);
      return {
        pos: v3lerp(KEY_ORBIT_END.pos, KEY_TILT_END.pos, t),
        look: v3lerp(KEY_ORBIT_END.look, KEY_TILT_END.look, t),
      };
    }
    // Recede.
    const t = smootherstep(p, cameraPhases.recede.range[0], cameraPhases.recede.range[1]);
    return {
      pos: v3lerp(KEY_TILT_END.pos, KEY_RECEDE_END.pos, t),
      look: v3lerp(KEY_TILT_END.look, KEY_RECEDE_END.look, t),
    };
  };

  // Sigil overlay visibility envelope. Wider fade windows + smootherstep so
  // the sigils don't pop in/out at phase boundaries.
  export const sigilOverlayOpacity = (p: number): number => {
    const fadeIn = smootherstep(p, 0.14, 0.42);
    const fadeOut = 1 - smootherstep(p, 0.78, 1.0);
    return fadeIn * fadeOut;
  };

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
