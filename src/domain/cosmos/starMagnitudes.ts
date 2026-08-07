// Photometry for the brightest stars in the constellation figures.
//
// `constellations.ts` carries positions only — it was written for the 3D scene,
// where every vertex is drawn the same size. A star chart needs the opposite:
// the hierarchy *is* the chart, and a sky where Sirius and a fourth-magnitude
// filler star look alike reads as a dot pattern rather than as the sky.
//
// So brightness lives here, as its own small table of real Bright Star Catalog
// values, rather than as a field bolted onto `Star3` (which the 3D scene
// consumes and has no use for). Entries are matched to figure vertices by
// angular proximity, so neither file has to know the other's ordering, and a
// star with no entry simply falls to `DEFAULT_MAGNITUDE`.
//
// Pure TS — no React/Next imports, per the domain-layer rules.

export type BrightStar = {
  name: string;
  /** Right ascension, in hours. */
  raH: number;
  /** Declination, in degrees. */
  decDeg: number;
  /** Apparent visual magnitude — lower is brighter. */
  magnitude: number;
};

/**
 * What a figure vertex is assumed to be when the table has no entry for it.
 * Third magnitude: visible from a dark site, unremarkable, which is what an
 * unnamed vertex in a constellation figure almost always is.
 */
export const DEFAULT_MAGNITUDE = 3.0;

/** How close a vertex must sit to a table entry to be considered that star. */
const MATCH_TOLERANCE_DEG = 0.35;

/**
 * The stars bright enough to carry a figure, with real catalog positions of
 * their own. Ordered by magnitude so the table reads as what it is: the list of
 * stars a person standing outside would actually name.
 */
export const BRIGHT_STARS: ReadonlyArray<BrightStar> = [
  { name: "Sirius", raH: 6.75, decDeg: -16.72, magnitude: -1.46 },
  { name: "Canopus", raH: 6.4, decDeg: -52.7, magnitude: -0.72 },
  { name: "Rigil Kentaurus", raH: 14.66, decDeg: -60.83, magnitude: -0.27 },
  { name: "Arcturus", raH: 14.26, decDeg: 19.18, magnitude: -0.05 },
  { name: "Vega", raH: 18.62, decDeg: 38.78, magnitude: 0.03 },
  { name: "Capella", raH: 5.28, decDeg: 45.99, magnitude: 0.08 },
  { name: "Rigel", raH: 5.24, decDeg: -8.2, magnitude: 0.13 },
  { name: "Procyon", raH: 7.66, decDeg: 5.22, magnitude: 0.34 },
  { name: "Achernar", raH: 1.63, decDeg: -57.24, magnitude: 0.46 },
  { name: "Betelgeuse", raH: 5.92, decDeg: 7.4, magnitude: 0.5 },
  { name: "Hadar", raH: 14.06, decDeg: -60.37, magnitude: 0.61 },
  { name: "Altair", raH: 19.85, decDeg: 8.87, magnitude: 0.77 },
  { name: "Acrux", raH: 12.44, decDeg: -63.1, magnitude: 0.77 },
  { name: "Aldebaran", raH: 4.6, decDeg: 16.51, magnitude: 0.85 },
  { name: "Antares", raH: 16.49, decDeg: -26.43, magnitude: 0.96 },
  { name: "Spica", raH: 13.42, decDeg: -11.16, magnitude: 1.04 },
  { name: "Pollux", raH: 7.76, decDeg: 28.03, magnitude: 1.14 },
  { name: "Fomalhaut", raH: 22.96, decDeg: -29.62, magnitude: 1.16 },
  { name: "Deneb", raH: 20.69, decDeg: 45.28, magnitude: 1.25 },
  { name: "Mimosa", raH: 12.79, decDeg: -59.69, magnitude: 1.25 },
  { name: "Regulus", raH: 10.14, decDeg: 11.97, magnitude: 1.36 },
  { name: "Adhara", raH: 6.98, decDeg: -28.97, magnitude: 1.5 },
  { name: "Castor", raH: 7.58, decDeg: 31.89, magnitude: 1.58 },
  { name: "Shaula", raH: 17.56, decDeg: -37.1, magnitude: 1.62 },
  { name: "Gacrux", raH: 12.52, decDeg: -57.11, magnitude: 1.63 },
  { name: "Bellatrix", raH: 5.42, decDeg: 6.35, magnitude: 1.64 },
  { name: "Elnath", raH: 5.44, decDeg: 28.61, magnitude: 1.65 },
  { name: "Alnilam", raH: 5.6, decDeg: -1.2, magnitude: 1.69 },
  { name: "Alnair", raH: 22.14, decDeg: -46.96, magnitude: 1.74 },
  { name: "Alnitak", raH: 5.68, decDeg: -1.94, magnitude: 1.77 },
  { name: "Alioth", raH: 12.9, decDeg: 55.96, magnitude: 1.77 },
  { name: "Dubhe", raH: 11.06, decDeg: 61.75, magnitude: 1.79 },
  { name: "Mirfak", raH: 3.41, decDeg: 49.86, magnitude: 1.79 },
  { name: "Wezen", raH: 7.14, decDeg: -26.39, magnitude: 1.83 },
  { name: "Kaus Australis", raH: 18.4, decDeg: -34.38, magnitude: 1.85 },
  { name: "Alkaid", raH: 13.79, decDeg: 49.31, magnitude: 1.86 },
  { name: "Sargas", raH: 17.62, decDeg: -42.99, magnitude: 1.87 },
  { name: "Menkalinan", raH: 5.99, decDeg: 44.95, magnitude: 1.9 },
  { name: "Atria", raH: 16.81, decDeg: -69.03, magnitude: 1.91 },
  { name: "Alhena", raH: 6.63, decDeg: 16.4, magnitude: 1.93 },
  { name: "Peacock", raH: 20.43, decDeg: -56.74, magnitude: 1.94 },
  { name: "Mirzam", raH: 6.38, decDeg: -17.96, magnitude: 1.98 },
  { name: "Alphard", raH: 9.46, decDeg: -8.66, magnitude: 1.98 },
  { name: "Polaris", raH: 2.53, decDeg: 89.26, magnitude: 1.98 },
  { name: "Hamal", raH: 2.12, decDeg: 23.46, magnitude: 2.0 },
  { name: "Nunki", raH: 18.92, decDeg: -26.3, magnitude: 2.05 },
  { name: "Diphda", raH: 0.73, decDeg: -17.99, magnitude: 2.04 },
  { name: "Denebola", raH: 11.82, decDeg: 14.57, magnitude: 2.14 },
  { name: "Mizar", raH: 13.4, decDeg: 54.93, magnitude: 2.23 },
  { name: "Merak", raH: 11.03, decDeg: 56.38, magnitude: 2.37 },
];

/**
 * The magnitude of the catalogued star at this position, or
 * `DEFAULT_MAGNITUDE` when no catalogued star sits there.
 *
 * Matching is by angular separation rather than by exact coordinates: the
 * figures round their positions for legibility, and the two files are allowed
 * to disagree in the third decimal without silently losing a star.
 */
export function magnitudeAt(raH: number, decDeg: number): number {
  let best = DEFAULT_MAGNITUDE;
  let bestSeparation = MATCH_TOLERANCE_DEG;

  for (const star of BRIGHT_STARS) {
    // Small-angle separation is enough here, with the RA difference narrowed by
    // the declination — at the pole an hour of RA spans almost no sky.
    const decDelta = star.decDeg - decDeg;
    const raDelta = wrapHours(star.raH - raH) * 15 * Math.cos(decDeg * (Math.PI / 180));
    const separation = Math.hypot(decDelta, raDelta);

    if (separation < bestSeparation) {
      bestSeparation = separation;
      best = star.magnitude;
    }
  }

  return best;
}

/** Signed hour difference, folded into −12…+12 so 23h and 1h are two apart. */
function wrapHours(hours: number): number {
  return ((((hours + 12) % 24) + 24) % 24) - 12;
}
