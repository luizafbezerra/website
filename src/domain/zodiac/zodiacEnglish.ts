import type { Locale } from "@/domain/site/Locale";
import type { WheelSign } from "@/domain/wheel/wheelGeometry";
import {
  type Element,
  type Modality,
  type NakshatraRef,
  VEDIC_CONTENT,
  type VedicContent,
  ZODIAC_CONTENT,
  type ZodiacContent,
  type ZodiacSignId,
} from "./zodiacContent";

// ---------------------------------------------------------------------------
// The wheel's nomenclature in English.
//
// `zodiacContent.ts` is the single source: one record per sign, maintained as a
// unit because the padas cross sign boundaries. Duplicating all of it into a
// parallel English record would double the surface that has to stay coherent, so
// this file translates the **closed vocabularies** instead — element, modality,
// planet, body part, archetype, pada range, mansion symbol — and looks each
// Portuguese value up. Roughly sixty short entries rather than three hundred
// lines of mirrored data, and `zodiacEnglish.test.ts` fails if any value the
// Portuguese record actually uses has no entry here, so the two cannot drift.
//
// None of this is invented vocabulary. Element, modality, planetary rulership,
// body correspondence and the nakshatra symbols are standard terms with settled
// English forms; translating "água" to "water" and "espada dupla" to
// "double-bladed sword" is naming the same referent, not writing new copy. The
// archetype names keep the Portuguese register — sentence case after the article,
// "The initiator" rather than "The Initiator" — because they are labels in a
// reference table, not titles.
//
// What stays untranslated on purpose: the nakshatra names and their deities.
// Those are Sanskrit proper nouns, transliterated once and read the same by a
// Portuguese and an English reader, exactly as "Rahu" and "Ketu" are.
//
// Her prose — `reading` and `vedicReading` — is not here and never will be. It
// comes from the CMS in whichever locale she has written it (REQ-007).
// ---------------------------------------------------------------------------

const ELEMENT_EN: Record<Element, string> = {
  fogo: "fire",
  terra: "earth",
  ar: "air",
  água: "water",
};

const MODALITY_EN: Record<Modality, string> = {
  cardinal: "cardinal",
  fixo: "fixed",
  mutável: "mutable",
};

/** Every planet named as a sign ruler or a mansion ruler, including the lunar nodes. */
const PLANET_EN: Record<string, string> = {
  Sol: "Sun",
  Lua: "Moon",
  Mercúrio: "Mercury",
  Vênus: "Venus",
  Marte: "Mars",
  Júpiter: "Jupiter",
  Saturno: "Saturn",
  Urano: "Uranus",
  Netuno: "Neptune",
  Plutão: "Pluto",
  Rahu: "Rahu",
  Ketu: "Ketu",
};

const BODY_PART_EN: Record<string, string> = {
  cabeça: "head",
  pescoço: "neck",
  "braços e pulmões": "arms and lungs",
  peito: "chest",
  coração: "heart",
  intestinos: "intestines",
  rins: "kidneys",
  "órgãos íntimos": "sexual organs",
  quadris: "hips",
  "ossos e joelhos": "bones and knees",
  tornozelos: "ankles",
  pés: "feet",
};

const ARCHETYPE_EN: Record<string, string> = {
  "O iniciador": "The initiator",
  "A guardiã": "The guardian",
  "O mensageiro": "The messenger",
  "A maternal": "The mother",
  "O soberano": "The sovereign",
  "A artesã": "The craftswoman",
  "A diplomata": "The diplomat",
  "O alquimista": "The alchemist",
  "O peregrino": "The pilgrim",
  "O arquiteto": "The architect",
  "O visionário": "The visionary",
  "A mística": "The mystic",
};

/** "padas 1–2" is already language-neutral; only the two ordinal forms move. */
const PADA_RANGE_EN: Record<string, string> = {
  "primeiro pada": "first pada",
  "último pada": "last pada",
  "padas 1–2": "padas 1–2",
  "padas 1–3": "padas 1–3",
  "padas 2–4": "padas 2–4",
  "padas 3–4": "padas 3–4",
};

const SYMBOL_EN: Record<string, string> = {
  "cabeça de cavalo": "horse's head",
  yoni: "yoni",
  lâmina: "blade",
  carruagem: "chariot",
  "cabeça de cervo": "deer's head",
  gota: "droplet",
  aljava: "quiver",
  "flor de lótus": "lotus flower",
  "serpente enrolada": "coiled serpent",
  trono: "throne",
  rede: "net",
  leito: "bed",
  "mão aberta": "open hand",
  joia: "jewel",
  "junco ao vento": "reed in the wind",
  "arco triunfal": "triumphal arch",
  "cajado florido": "flowering staff",
  amuleto: "amulet",
  "raiz amarrada": "bound root",
  leque: "fan",
  "presa de elefante": "elephant's tusk",
  orelha: "ear",
  tambor: "drum",
  círculo: "circle",
  "espada dupla": "double-bladed sword",
  "serpente das águas": "serpent of the waters",
  peixe: "fish",
};

/** The twelve sign names and their date spans, in the reader's language. */
const SIGN_LABEL_EN: Record<ZodiacSignId, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

/** The month abbreviations inside `dateRange`; the numerals and dash are shared. */
const MONTH_EN: Record<string, string> = {
  jan: "Jan",
  fev: "Feb",
  mar: "Mar",
  abr: "Apr",
  mai: "May",
  jun: "Jun",
  jul: "Jul",
  ago: "Aug",
  set: "Sep",
  out: "Oct",
  nov: "Nov",
  dez: "Dec",
};

/**
 * Exported for the test, which asserts every Portuguese value the source record
 * actually uses has an entry above. A missing key would otherwise fall through
 * to the Portuguese string and ship a half-translated table.
 */
export const EN_TABLES = {
  ELEMENT_EN,
  MODALITY_EN,
  PLANET_EN,
  BODY_PART_EN,
  ARCHETYPE_EN,
  PADA_RANGE_EN,
  SYMBOL_EN,
  MONTH_EN,
} as const;

/** Falls back to the Portuguese rather than rendering blank if a key is missing. */
const en = (table: Record<string, string>, value: string): string => table[value] ?? value;

/** `"19 fev – 20 mar"` → `"19 Feb – 20 Mar"`, leaving the numerals and dash alone. */
function dateRangeIn(locale: Locale, dateRange: string): string {
  if (locale === "pt") return dateRange;

  return dateRange.replace(/\p{Letter}+/gu, (month) => en(MONTH_EN, month));
}

/**
 * The same five correspondences as `ZodiacContent`, but as plain strings.
 *
 * `ZodiacContent.element` and `.modality` are unions of the *Portuguese* terms,
 * which is right for the source record and wrong for a translated one: "water"
 * is not a member of `Element`. These values are only ever rendered, so the
 * display type widens to `string` rather than the unions growing an English arm
 * that the source data can never hold.
 */
export type ZodiacDisplay = {
  element: string;
  modality: string;
  ruler: string;
  bodyPart: string;
  archetype: string;
};

export function zodiacContentIn(locale: Locale, id: ZodiacSignId): ZodiacDisplay {
  const content: ZodiacContent = ZODIAC_CONTENT[id];
  if (locale === "pt") return content;

  return {
    element: en(ELEMENT_EN, content.element),
    modality: en(MODALITY_EN, content.modality),
    ruler: en(PLANET_EN, content.ruler),
    bodyPart: en(BODY_PART_EN, content.bodyPart),
    archetype: en(ARCHETYPE_EN, content.archetype),
  };
}

export function vedicContentIn(locale: Locale, id: ZodiacSignId): VedicContent {
  const content = VEDIC_CONTENT[id];
  if (locale === "pt") return content;

  return {
    ...content,
    nakshatras: content.nakshatras.map(
      (nakshatra): NakshatraRef => ({
        ...nakshatra,
        ...(nakshatra.range ? { range: en(PADA_RANGE_EN, nakshatra.range) } : {}),
        ruler: en(PLANET_EN, nakshatra.ruler),
        symbol: en(SYMBOL_EN, nakshatra.symbol),
      }),
    ),
  };
}

/** The wheel's own label and date span for one sector. */
export function wheelSignIn(locale: Locale, sign: WheelSign): { label: string; dateRange: string } {
  if (locale === "pt") return { label: sign.label, dateRange: sign.dateRange };

  return {
    label: SIGN_LABEL_EN[sign.id as ZodiacSignId] ?? sign.label,
    dateRange: dateRangeIn(locale, sign.dateRange),
  };
}
