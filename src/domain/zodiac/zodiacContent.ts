// ---------------------------------------------------------------------------
// The wheel's scholarly reference data — and nothing else.
//
// This file holds only interlocking nomenclature: each sign's element,
// modality, ruler, body correspondence and archetype name, and the three lunar
// mansions (nakshatras) whose padas its arc spans, with each mansion's deity,
// ruler and symbol. None of it is editorial voice, which is why it lives in
// code rather than in the CMS: the padas deliberately cross sign boundaries, so
// the table only stays coherent if it is maintained as one unit.
//
// **What is deliberately not here.** Until TASK-037 this file also carried a
// prose paragraph per sign, a prose paragraph per Vedic band, and a one-line
// `motif` per mansion — all of it written by a developer and flagged
// `_isPlaceholder: true`. Every one of them has been removed. The wheel's prose
// belongs to Luiza alone (REQ-007 / CONCEPT §11): her per-sign `reading` and
// `vedicReading` live in the `page-analise` global's `mandala` tab, all twelve
// empty on purpose, and the wheel speaks only through the painting until she
// writes them. Deleting the drafts rather than leaving them unrendered is the
// point — prose in her name cannot be wired back in by accident if it does not
// exist. Git history holds the removed text if it is ever wanted as a start.
//
// The nomenclature stays Portuguese in both locales; see the plan's execution
// notes for why, and `messages` for the chrome that does localize.
// ---------------------------------------------------------------------------

/**
 * The twelve sign ids, in zodiac order — the wheel's key space.
 *
 * Declared here as a literal tuple rather than derived from `WHEEL_ZODIAC` so
 * that `Record<ZodiacSignId, …>` is exhaustively checked: the geometry module
 * types its array as `ReadonlyArray<WheelSign>`, which widens `id` to `string`
 * and would let a missing sign slip through every lookup on this page.
 * `zodiacContent.test.ts` holds the two lists to each other.
 */
export const ZODIAC_SIGN_IDS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSignId = (typeof ZODIAC_SIGN_IDS)[number];

export type Element = "fogo" | "terra" | "ar" | "água";
export type Modality = "cardinal" | "fixo" | "mutável";

export type ZodiacContent = {
  element: Element;
  modality: Modality;
  ruler: string;
  bodyPart: string;
  /** The archetype's name — standard vocabulary, not an interpretation. */
  archetype: string;
};

export const ZODIAC_CONTENT: Record<ZodiacSignId, ZodiacContent> = {
  aries: {
    element: "fogo",
    modality: "cardinal",
    ruler: "Marte",
    bodyPart: "cabeça",
    archetype: "O iniciador",
  },
  taurus: {
    element: "terra",
    modality: "fixo",
    ruler: "Vênus",
    bodyPart: "pescoço",
    archetype: "A guardiã",
  },
  gemini: {
    element: "ar",
    modality: "mutável",
    ruler: "Mercúrio",
    bodyPart: "braços e pulmões",
    archetype: "O mensageiro",
  },
  cancer: {
    element: "água",
    modality: "cardinal",
    ruler: "Lua",
    bodyPart: "peito",
    archetype: "A maternal",
  },
  leo: {
    element: "fogo",
    modality: "fixo",
    ruler: "Sol",
    bodyPart: "coração",
    archetype: "O soberano",
  },
  virgo: {
    element: "terra",
    modality: "mutável",
    ruler: "Mercúrio",
    bodyPart: "intestinos",
    archetype: "A artesã",
  },
  libra: {
    element: "ar",
    modality: "cardinal",
    ruler: "Vênus",
    bodyPart: "rins",
    archetype: "A diplomata",
  },
  scorpio: {
    element: "água",
    modality: "fixo",
    ruler: "Plutão",
    bodyPart: "órgãos íntimos",
    archetype: "O alquimista",
  },
  sagittarius: {
    element: "fogo",
    modality: "mutável",
    ruler: "Júpiter",
    bodyPart: "quadris",
    archetype: "O peregrino",
  },
  capricorn: {
    element: "terra",
    modality: "cardinal",
    ruler: "Saturno",
    bodyPart: "ossos e joelhos",
    archetype: "O arquiteto",
  },
  aquarius: {
    element: "ar",
    modality: "fixo",
    ruler: "Urano",
    bodyPart: "tornozelos",
    archetype: "O visionário",
  },
  pisces: {
    element: "água",
    modality: "mutável",
    ruler: "Netuno",
    bodyPart: "pés",
    archetype: "A mística",
  },
};

/**
 * One lunar mansion as it falls inside a sign's arc. `range` names the padas
 * when the mansion is shared with a neighbouring sign — which is most of them,
 * since 27 mansions do not divide evenly into 12 signs.
 */
export type NakshatraRef = {
  name: string;
  range?: string;
  deity: string;
  ruler: string;
  symbol: string;
};

export type VedicContent = {
  nakshatras: NakshatraRef[];
};

export const VEDIC_CONTENT: Record<ZodiacSignId, VedicContent> = {
  aries: {
    nakshatras: [
      { name: "Ashwini", deity: "Ashwini Kumaras", ruler: "Ketu", symbol: "cabeça de cavalo" },
      { name: "Bharani", deity: "Yama", ruler: "Vênus", symbol: "yoni" },
      { name: "Krittika", range: "primeiro pada", deity: "Agni", ruler: "Sol", symbol: "lâmina" },
    ],
  },
  taurus: {
    nakshatras: [
      { name: "Krittika", range: "padas 2–4", deity: "Agni", ruler: "Sol", symbol: "lâmina" },
      { name: "Rohini", deity: "Brahma", ruler: "Lua", symbol: "carruagem" },
      {
        name: "Mrigashira",
        range: "padas 1–2",
        deity: "Soma",
        ruler: "Marte",
        symbol: "cabeça de cervo",
      },
    ],
  },
  gemini: {
    nakshatras: [
      {
        name: "Mrigashira",
        range: "padas 3–4",
        deity: "Soma",
        ruler: "Marte",
        symbol: "cabeça de cervo",
      },
      { name: "Ardra", deity: "Rudra", ruler: "Rahu", symbol: "gota" },
      { name: "Punarvasu", range: "padas 1–3", deity: "Aditi", ruler: "Júpiter", symbol: "aljava" },
    ],
  },
  cancer: {
    nakshatras: [
      {
        name: "Punarvasu",
        range: "último pada",
        deity: "Aditi",
        ruler: "Júpiter",
        symbol: "aljava",
      },
      { name: "Pushya", deity: "Brihaspati", ruler: "Saturno", symbol: "flor de lótus" },
      { name: "Ashlesha", deity: "Nagas", ruler: "Mercúrio", symbol: "serpente enrolada" },
    ],
  },
  leo: {
    nakshatras: [
      { name: "Magha", deity: "Pitris", ruler: "Ketu", symbol: "trono" },
      { name: "Purva Phalguni", deity: "Bhaga", ruler: "Vênus", symbol: "rede" },
      {
        name: "Uttara Phalguni",
        range: "primeiro pada",
        deity: "Aryaman",
        ruler: "Sol",
        symbol: "leito",
      },
    ],
  },
  virgo: {
    nakshatras: [
      {
        name: "Uttara Phalguni",
        range: "padas 2–4",
        deity: "Aryaman",
        ruler: "Sol",
        symbol: "leito",
      },
      { name: "Hasta", deity: "Savitar", ruler: "Lua", symbol: "mão aberta" },
      { name: "Chitra", range: "padas 1–2", deity: "Tvashtar", ruler: "Marte", symbol: "joia" },
    ],
  },
  libra: {
    nakshatras: [
      { name: "Chitra", range: "padas 3–4", deity: "Tvashtar", ruler: "Marte", symbol: "joia" },
      { name: "Swati", deity: "Vayu", ruler: "Rahu", symbol: "junco ao vento" },
      {
        name: "Vishakha",
        range: "padas 1–3",
        deity: "Indra-Agni",
        ruler: "Júpiter",
        symbol: "arco triunfal",
      },
    ],
  },
  scorpio: {
    nakshatras: [
      {
        name: "Vishakha",
        range: "último pada",
        deity: "Indra-Agni",
        ruler: "Júpiter",
        symbol: "arco triunfal",
      },
      { name: "Anuradha", deity: "Mitra", ruler: "Saturno", symbol: "cajado florido" },
      { name: "Jyeshtha", deity: "Indra", ruler: "Mercúrio", symbol: "amuleto" },
    ],
  },
  sagittarius: {
    nakshatras: [
      { name: "Mula", deity: "Nirriti", ruler: "Ketu", symbol: "raiz amarrada" },
      { name: "Purva Ashadha", deity: "Apas", ruler: "Vênus", symbol: "leque" },
      {
        name: "Uttara Ashadha",
        range: "primeiro pada",
        deity: "Vishvedevas",
        ruler: "Sol",
        symbol: "presa de elefante",
      },
    ],
  },
  capricorn: {
    nakshatras: [
      {
        name: "Uttara Ashadha",
        range: "padas 2–4",
        deity: "Vishvedevas",
        ruler: "Sol",
        symbol: "presa de elefante",
      },
      { name: "Shravana", deity: "Vishnu", ruler: "Lua", symbol: "orelha" },
      { name: "Dhanishta", range: "padas 1–2", deity: "Vasus", ruler: "Marte", symbol: "tambor" },
    ],
  },
  aquarius: {
    nakshatras: [
      { name: "Dhanishta", range: "padas 3–4", deity: "Vasus", ruler: "Marte", symbol: "tambor" },
      { name: "Shatabhisha", deity: "Varuna", ruler: "Rahu", symbol: "círculo" },
      {
        name: "Purva Bhadrapada",
        range: "padas 1–3",
        deity: "Aja Ekapada",
        ruler: "Júpiter",
        symbol: "espada dupla",
      },
    ],
  },
  pisces: {
    nakshatras: [
      {
        name: "Purva Bhadrapada",
        range: "último pada",
        deity: "Aja Ekapada",
        ruler: "Júpiter",
        symbol: "espada dupla",
      },
      {
        name: "Uttara Bhadrapada",
        deity: "Ahirbudhnya",
        ruler: "Saturno",
        symbol: "serpente das águas",
      },
      { name: "Revati", deity: "Pushan", ruler: "Mercúrio", symbol: "peixe" },
    ],
  },
};
