// Real-RA/Dec constellation data for the cosmos section.
//
// Each star carries its actual right ascension (in hours) and declination
// (in degrees) sourced from standard astronomical references (Bright Star
// Catalog / SIMBAD positions, rounded for legibility). Positions are
// converted to cartesian on a celestial sphere of `CONSTELLATION_RADIUS`
// world units. Line pairs follow the canonical figures (IAU / "Sky Atlas
// 2000" style) so a viewer who knows the night sky reads each constellation
// at a glance.
//
// Coordinate mapping into the cosmos scene:
//   RA  =  0h    → +X
//   RA  =  6h    → +Z   (back of camera at orbit start)
//   RA  = 12h    → -X
//   RA  = 18h    → -Z   (front of camera at orbit start / descent end)
//   Dec = +90°   → +Y   (north celestial pole)
//
// Pure TS — no React/Next/three imports, per the domain-layer rules.

export type Star3 = readonly [number, number, number];

export type Constellation = {
  id: string;
  name: string; // pt-BR
  marginalia: string; // short companion line (not currently rendered, kept for future use)
  stars: ReadonlyArray<Star3>;
  lines: ReadonlyArray<readonly [number, number]>;
};

// Render radius for constellation stars. Sits between the foreground star
// shell (radii 4–8) and the deep-field stars (radii 30–80) so the line
// network reads as "the near sky" without overlapping armillary geometry.
export const CONSTELLATION_RADIUS = 12;

const DEG = Math.PI / 180;
const HOURS_TO_RAD = 15 * DEG; // 1h of RA = 15° = π/12 rad

// Real-RA/Dec → cartesian on the constellation sphere.
//   raH    right ascension in hours (0..24)
//   decDeg declination in degrees (-90..+90)
const s = (raH: number, decDeg: number): Star3 => {
  const ra = raH * HOURS_TO_RAD;
  const dec = decDeg * DEG;
  return [
    Math.cos(dec) * Math.cos(ra) * CONSTELLATION_RADIUS,
    Math.sin(dec) * CONSTELLATION_RADIUS,
    Math.cos(dec) * Math.sin(ra) * CONSTELLATION_RADIUS,
  ];
};

export const constellations: ReadonlyArray<Constellation> = [
  // ---- Equatorial / winter ---------------------------------------------------
  {
    id: "orion",
    name: "Órion",
    marginalia: "o caçador, o cinturão e a espada",
    // Betelgeuse, Bellatrix, Mintaka, Alnilam, Alnitak, Saiph, Rigel, Meissa.
    stars: [
      s(5.92, 7.4), //  0 Betelgeuse (right shoulder)
      s(5.42, 6.35), //  1 Bellatrix  (left shoulder)
      s(5.53, -0.3), //  2 Mintaka    (belt right)
      s(5.6, -1.2), //  3 Alnilam    (belt center)
      s(5.68, -1.94), //  4 Alnitak    (belt left)
      s(5.8, -9.67), //  5 Saiph      (right knee)
      s(5.24, -8.2), //  6 Rigel      (left foot)
      s(5.59, 9.93), //  7 Meissa     (head)
    ],
    lines: [
      [7, 0], // head → right shoulder
      [7, 1], // head → left shoulder
      [0, 1], // shoulders
      [0, 4], // right shoulder → belt right (Alnitak)
      [1, 2], // left shoulder → belt left  (Mintaka)
      [2, 3], // belt
      [3, 4], // belt
      [4, 5], // belt → right knee
      [2, 6], // belt → left foot
      [5, 6], // knees / waist tie
    ],
  },
  {
    id: "canis-major",
    name: "Cão Maior",
    marginalia: "Sirius, a estrela mais brilhante",
    // Sirius, Mirzam, Wezen, Aludra, Adhara, Furud.
    stars: [
      s(6.75, -16.72), // 0 Sirius
      s(6.38, -17.96), // 1 Mirzam
      s(6.98, -28.97), // 2 Adhara
      s(7.14, -26.39), // 3 Wezen
      s(7.4, -29.3), //  4 Aludra
      s(6.34, -30.06), // 5 Furud
    ],
    lines: [
      [1, 0],
      [0, 3],
      [3, 4],
      [3, 2],
      [2, 5],
    ],
  },
  {
    id: "canis-minor",
    name: "Cão Menor",
    marginalia: "Procyon, o que precede o cão",
    stars: [s(7.66, 5.22), s(7.45, 8.29)],
    lines: [[0, 1]],
  },
  {
    id: "gemini",
    name: "Gêmeos",
    marginalia: "Castor e Pólux, os irmãos",
    stars: [
      s(7.58, 31.89), // 0 Castor
      s(7.76, 28.03), // 1 Pollux
      s(7.34, 21.98), // 2 Wasat
      s(7.06, 20.57), // 3 Mekbuda
      s(6.74, 25.13), // 4 Mebsuta
      s(6.38, 22.51), // 5 Tejat
      s(6.25, 22.51), // 6 Propus
      s(6.63, 16.4), //  7 Alhena
    ],
    lines: [
      [0, 4],
      [4, 5],
      [5, 6],
      [1, 2],
      [2, 3],
      [3, 7],
      [0, 1],
    ],
  },
  {
    id: "auriga",
    name: "Cocheiro",
    marginalia: "Capella, a cabra brilhante",
    stars: [
      s(5.28, 45.99), //  0 Capella
      s(5.99, 44.95), //  1 Menkalinan
      s(6.0, 37.21), //   2 Mahasim
      s(4.95, 33.16), //  3 Hassaleh
      s(5.03, 43.82), //  4 Almaaz
      s(5.44, 28.61), //  5 Elnath (shared w/ Taurus — pentagon close)
    ],
    lines: [
      [0, 4],
      [0, 1],
      [1, 2],
      [2, 5],
      [5, 3],
      [3, 0],
    ],
  },
  {
    id: "taurus",
    name: "Touro",
    marginalia: "Aldebaran, o olho do touro",
    // Aldebaran + Hyades V + horns + Pleiades brightest (Alcyone).
    stars: [
      s(4.6, 16.51), //  0 Aldebaran (eye)
      s(4.48, 19.18), // 1 Ain (epsilon)
      s(4.38, 17.54), // 2 Hyades west
      s(4.33, 15.87), // 3 Hyades south
      s(5.44, 28.61), // 4 Elnath (north horn — shared w/ Auriga)
      s(5.62, 21.14), // 5 Zeta Tau (south horn tip)
      s(3.79, 24.11), // 6 Alcyone (Pleiades)
    ],
    lines: [
      [1, 0],
      [0, 3],
      [3, 2],
      [2, 1], // V of Hyades + Aldebaran
      [1, 4], // up to north horn
      [0, 5], // down to south horn
    ],
  },
  {
    id: "perseus",
    name: "Perseu",
    marginalia: "Algol, a estrela demônio",
    stars: [
      s(3.41, 49.86), // 0 Mirfak
      s(3.14, 40.96), // 1 Algol
      s(3.9, 31.88), //  2 Atik
      s(3.71, 47.79), // 3 Delta
      s(3.96, 40.01), // 4 Epsilon
    ],
    lines: [
      [0, 3],
      [3, 0],
      [0, 4],
      [4, 1],
      [1, 2],
    ],
  },
  {
    id: "andromeda",
    name: "Andrômeda",
    marginalia: "a princesa acorrentada",
    stars: [
      s(0.14, 29.09), // 0 Alpheratz (shared w/ Pegasus)
      s(1.16, 35.62), // 1 Mirach
      s(2.07, 42.33), // 2 Almach
    ],
    lines: [
      [0, 1],
      [1, 2],
    ],
  },
  {
    id: "pegasus",
    name: "Pégaso",
    marginalia: "o grande quadrado, o cavalo alado",
    stars: [
      s(23.08, 15.21), // 0 Markab
      s(23.06, 28.08), // 1 Scheat
      s(0.22, 15.18), //  2 Algenib
      s(0.14, 29.09), //  3 Alpheratz (shared w/ Andromeda)
    ],
    lines: [
      [0, 1],
      [1, 3],
      [3, 2],
      [2, 0], // great square
    ],
  },

  // ---- Northern (high declination, often circumpolar) -----------------------
  {
    id: "ursa-major",
    name: "Ursa Maior",
    marginalia: "o carro do norte, a roda que indica",
    stars: [
      s(11.06, 61.75), // 0 Dubhe
      s(11.03, 56.38), // 1 Merak
      s(11.9, 53.69), //  2 Phecda
      s(12.26, 57.03), // 3 Megrez
      s(12.9, 55.96), //  4 Alioth
      s(13.4, 54.93), //  5 Mizar
      s(13.79, 49.31), // 6 Alkaid
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "ursa-minor",
    name: "Ursa Menor",
    marginalia: "Polaris, o pólo do céu",
    stars: [
      s(2.53, 89.26), //  0 Polaris
      s(17.54, 86.59), // 1 Yildun
      s(15.74, 77.79), // 2 Epsilon UMi
      s(16.77, 82.04), // 3 Zeta UMi
      s(14.85, 74.16), // 4 Eta UMi
      s(15.34, 71.83), // 5 Pherkad
      s(14.85, 74.16), // 6 Kochab (approx, very close to Eta — pattern reads)
    ],
    lines: [
      [0, 1],
      [1, 3],
      [3, 2],
      [2, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    marginalia: "a rainha em W",
    stars: [
      s(0.68, 56.54), // 0 Schedar
      s(0.16, 59.15), // 1 Caph
      s(0.96, 60.72), // 2 Gamma Cas
      s(1.43, 60.24), // 3 Ruchbah
      s(1.91, 63.67), // 4 Segin
    ],
    lines: [
      [1, 0],
      [0, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "cepheus",
    name: "Cefeu",
    marginalia: "o rei pai, o pentágono austero",
    stars: [
      s(21.31, 62.59), // 0 Alderamin
      s(21.48, 70.56), // 1 Alfirk
      s(23.66, 77.63), // 2 Errai
      s(22.83, 66.2), //  3 Iota
      s(22.18, 58.2), //  4 Zeta
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  {
    id: "draco",
    name: "Dragão",
    marginalia: "a serpente do polo",
    // 7 bright stars tracing the long serpentine line.
    stars: [
      s(17.94, 51.49), // 0 Etamin (head)
      s(17.51, 52.3), //  1 Rastaban
      s(18.35, 56.87), // 2 Grumium
      s(17.69, 65.71), // 3 Tail bend
      s(16.4, 61.51), //  4 Edasich
      s(15.42, 58.97), // 5 Theta Dra
      s(14.07, 64.38), // 6 Thuban (old pole star)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },

  // ---- Summer / Milky Way ---------------------------------------------------
  {
    id: "cygnus",
    name: "Cisne",
    marginalia: "a cruz boreal, o voo descendente",
    stars: [
      s(20.69, 45.28), // 0 Deneb (tail)
      s(20.37, 40.26), // 1 Sadr (chest)
      s(19.51, 27.96), // 2 Albireo (head)
      s(20.77, 33.97), // 3 Gienah (E wing)
      s(19.75, 45.13), // 4 Delta Cyg (W wing)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 1],
      [1, 4],
    ],
  },
  {
    id: "lyra",
    name: "Lira",
    marginalia: "Vega e a lira de Orfeu",
    stars: [
      s(18.62, 38.78), // 0 Vega
      s(18.83, 33.36), // 1 Sheliak
      s(18.98, 32.69), // 2 Sulafat
      s(18.89, 36.9), //  3 Delta Lyrae
      s(18.75, 37.6), //  4 Zeta Lyrae
    ],
    lines: [
      [0, 4],
      [4, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },
  {
    id: "aquila",
    name: "Águia",
    marginalia: "Altair, a visão alta",
    stars: [
      s(19.85, 8.87), //  0 Altair
      s(19.77, 10.61), // 1 Tarazed
      s(19.92, 6.41), //  2 Alshain
      s(19.42, 3.11), //  3 Delta Aql
      s(20.19, -0.82), // 4 Theta Aql
      s(19.88, 1.0), //   5 Eta Aql
    ],
    lines: [
      [1, 0],
      [0, 2],
      [3, 0],
      [0, 4],
      [4, 5],
    ],
  },
  {
    id: "hercules",
    name: "Hércules",
    marginalia: "a pedra angular do herói",
    stars: [
      s(17.24, 14.39), // 0 Rasalgethi
      s(16.51, 21.49), // 1 Kornephoros
      s(17.25, 24.84), // 2 Sarin
      s(17.25, 36.81), // 3 Pi Her (top L)
      s(17.66, 46.01), // 4 Iota
      s(17.94, 37.25), // 5 Theta
      s(16.71, 38.92), // 6 Eta (top R)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 5],
      [5, 4],
      [4, 6],
      [6, 1], // keystone
      [3, 2],
      [3, 6],
    ],
  },
  {
    id: "bootes",
    name: "Boieiro",
    marginalia: "Arcturus, o guardião do urso",
    stars: [
      s(14.26, 19.18), // 0 Arcturus
      s(14.75, 27.07), // 1 Izar
      s(13.91, 18.4), //  2 Muphrid
      s(15.03, 40.39), // 3 Nekkar
      s(14.53, 38.31), // 4 Seginus
      s(15.26, 33.31), // 5 Delta Boo
    ],
    lines: [
      [2, 0],
      [0, 1],
      [1, 5],
      [5, 3],
      [3, 4],
      [4, 1],
    ],
  },
  {
    id: "corona-borealis",
    name: "Coroa Boreal",
    marginalia: "o arco da coroa",
    stars: [
      s(15.46, 29.11), // 0 Nusakan
      s(15.58, 26.71), // 1 Alphecca
      s(15.71, 26.3), //  2 Gamma
      s(15.83, 26.07), // 3 Delta
      s(15.96, 26.88), // 4 Epsilon
      s(16.04, 29.85), // 5 Iota
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },

  // ---- Zodiacal (RA 9h–18h) -------------------------------------------------
  {
    id: "leo",
    name: "Leão",
    marginalia: "Regulus, o coração brilhante",
    stars: [
      s(10.14, 11.97), // 0 Regulus
      s(10.33, 19.84), // 1 Algieba
      s(10.28, 23.42), // 2 Adhafera
      s(9.88, 26.01), //  3 Rasalas
      s(10.12, 16.76), // 4 Eta Leo
      s(11.82, 14.57), // 5 Denebola
      s(11.24, 15.43), // 6 Chertan
      s(11.24, 20.52), // 7 Zosma
    ],
    lines: [
      [0, 4],
      [4, 1],
      [1, 2],
      [2, 3], // sickle
      [0, 6],
      [6, 5],
      [5, 7],
      [7, 1], // triangle
    ],
  },
  {
    id: "virgo",
    name: "Virgem",
    marginalia: "Spica, a espiga de trigo",
    stars: [
      s(13.42, -11.16), // 0 Spica
      s(11.84, 1.76), //   1 Beta Vir
      s(12.92, -0.67), //  2 Porrima
      s(13.04, 10.96), //  3 Vindemiatrix (Epsilon)
      s(13.58, -0.6), //   4 Heze (Zeta)
    ],
    lines: [
      [1, 2],
      [2, 4],
      [4, 0],
      [2, 3],
    ],
  },
  {
    id: "scorpius",
    name: "Escorpião",
    marginalia: "Antares, a curva do ferrão",
    stars: [
      s(15.99, -22.62), // 0 Dschubba
      s(16.09, -19.81), // 1 Acrab (Graffias)
      s(16.49, -26.43), // 2 Antares
      s(17.2, -43.24), //  3 Eta Sco
      s(17.56, -37.1), //  4 Shaula (Lambda)
      s(17.51, -37.3), //  5 Lesath  (Upsilon)
      s(17.62, -42.99), // 6 Theta Sco
      s(16.84, -34.29), // 7 Epsilon
      s(16.87, -38.05), // 8 Mu Sco
      s(16.92, -42.36), // 9 Zeta Sco
    ],
    lines: [
      [1, 0],
      [0, 2],
      [2, 7],
      [7, 8],
      [8, 9],
      [9, 3],
      [3, 6],
      [6, 4],
      [4, 5],
    ],
  },
  {
    id: "sagittarius",
    name: "Sagitário",
    marginalia: "o arqueiro, o bule de chá",
    stars: [
      s(18.4, -34.38), //  0 Kaus Australis (epsilon)
      s(18.35, -29.83), // 1 Kaus Media (delta)
      s(18.47, -25.42), // 2 Kaus Borealis (lambda)
      s(18.92, -26.3), //  3 Nunki (sigma)
      s(19.04, -29.88), // 4 Ascella (zeta)
      s(18.74, -26.99), // 5 Phi Sgr
      s(19.16, -21.74), // 6 Albaldah (pi)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 5],
      [5, 3],
      [3, 4],
      [4, 0], // teapot body
      [3, 6], // handle to lid
    ],
  },

  // ---- Southern -------------------------------------------------------------
  {
    id: "crux",
    name: "Cruzeiro do Sul",
    marginalia: "o eixo austral, a orientação no escuro",
    stars: [
      s(12.44, -63.1), //  0 Acrux
      s(12.79, -59.69), // 1 Becrux
      s(12.52, -57.11), // 2 Gacrux
      s(12.25, -58.75), // 3 Delta Cru
    ],
    lines: [
      [0, 2],
      [1, 3],
    ],
  },
  {
    id: "centaurus",
    name: "Centauro",
    marginalia: "Alpha Centauri, o vizinho mais próximo",
    stars: [
      s(14.66, -60.84), // 0 Alpha Cen (Rigil Kentaurus)
      s(14.06, -60.37), // 1 Hadar (Beta Cen)
      s(14.11, -36.37), // 2 Menkent (Theta Cen)
      s(13.34, -36.71), // 3 Iota Cen
      s(13.66, -53.47), // 4 Epsilon Cen
    ],
    lines: [
      [0, 1],
      [1, 4],
      [4, 2],
      [2, 3],
    ],
  },
];

// Flatten all constellations' line endpoints into a single packed
// Float32Array suitable for `THREE.BufferGeometry.setAttribute('position',
// ...)`. Six floats per line segment (two XYZ vertices). One draw call
// covers the entire network (~90 segments across ~25 constellations).
export const buildLineEndpoints = (): Float32Array => {
  let total = 0;
  for (const c of constellations) total += c.lines.length;
  const out = new Float32Array(total * 6);
  let i = 0;
  for (const c of constellations) {
    for (const [a, b] of c.lines) {
      const sa = c.stars[a];
      const sb = c.stars[b];
      out[i++] = sa[0];
      out[i++] = sa[1];
      out[i++] = sa[2];
      out[i++] = sb[0];
      out[i++] = sb[1];
      out[i++] = sb[2];
    }
  }
  return out;
};

// Flatten all constellation star positions for vertex-star sprite rendering.
// Each star also carries a brightness multiplier (currently uniform 1.0;
// reserved for future emphasis on first-magnitude stars).
export type StarVertex = {
  pos: Star3;
  brightness: number;
};

export const buildStarVertices = (): ReadonlyArray<StarVertex> => {
  const out: StarVertex[] = [];
  for (const c of constellations) {
    for (const pos of c.stars) {
      out.push({ pos, brightness: 1 });
    }
  }
  return out;
};
