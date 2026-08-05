import type { AvailabilityState } from "./AvailabilityState";
import { type Fee, feeFrom } from "./Fee";
import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

// ---------------------------------------------------------------------------
// Everything the site knows about the practice, held exactly once (REQ-003) —
// the domain shape of the "A Clínica" global. Anything a visitor can read on
// more than one page is here; anything belonging to a single screen lives in
// that page's own global.
//
// CLINICA_DEFAULTS is what renders when Payload is off or a field is blank. Its
// values are the CONCEPT v3 facts: online-only, Brasil e exterior (CON-001).
// `whatsappUrl` is derived from the number, never stored.
// ---------------------------------------------------------------------------

export type JungPassage = { text: string; attribution: string | null };

/**
 * The four pre-written openers (CONCEPT §8.1). Three are localized translations
 * of the same invitation; `english` is written in English on purpose, because it
 * is the opener offered to anglophones on the Portuguese pages too.
 */
export type NoteOpeners = {
  analysis: string | null;
  careerGuidance: string | null;
  unsure: string | null;
  english: string | null;
};

export type Clinica = {
  // identity
  clinicName: string;
  fullName: string;
  shortName: string;
  role: string;
  /** Empty hides the credential row rather than advertising a fake registration. */
  credential: string;
  /**
   * The credential strip of CONCEPT §6/§8.8, in render order and without the
   * CRP — `CredentialLine` prepends `credential` when it is set. Only facts she
   * has confirmed belong here; deleting an item in the CMS removes it.
   */
  credentials: string[];
  /** Her canonical positioning sentence, verbatim. */
  positioning: string;
  // contact
  whatsappE164: string;
  whatsappDisplay: string;
  whatsappUrl: string; // derived from whatsappE164
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  // availability
  availability: { state: AvailabilityState; responseWindow: string | null };
  // fees (never empty strings — see Fee)
  fees: { analysis: Fee; careerGuidance: Fee; internationalNote: string | null };
  // the bilhete openers, the Jung pool, the privacy line
  notes: NoteOpeners;
  jungPassages: JungPassage[];
  privacyLine: string | null;
};

const WHATSAPP_E164 = "+5511964158128";

export const CLINICA_DEFAULTS: Clinica = {
  clinicName: "Símbolos do Self",
  fullName: "Luiza Fernandes Bezerra",
  shortName: "Luiza Bezerra",
  role: "Psicóloga clínica",
  // Blank until she confirms her CRP in writing (DEP-005). The row hides.
  credential: "",
  // CONCEPT §6's credencial line, minus the CRP. Every item is a fact already
  // public in her own bio; anything she has not confirmed she deletes in the CMS.
  credentials: [
    "PUC-SP",
    "clínica desde 2014",
    "on-line",
    "português e inglês",
    "Brasil e exterior",
  ],
  positioning: "Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior.",
  whatsappE164: WHATSAPP_E164,
  whatsappDisplay: "+55 11 96415-8128",
  email: "luizafbezerra@gmail.com",
  instagramUrl: "https://www.instagram.com/simbolos.do.self/",
  instagramHandle: "@simbolos.do.self",
  whatsappUrl: whatsappUrlFromPhone(WHATSAPP_E164),
  // Mirrors the global's own default. Of the three states this is the one whose
  // being wrong costs a conversation she would have had anyway, rather than a
  // client who reads "sem novos atendimentos" and leaves. She confirms it in the
  // admin (DEP-005).
  availability: { state: "open", responseWindow: null },
  fees: { analysis: feeFrom(null), careerGuidance: feeFrom(null), internationalNote: null },
  notes: { analysis: null, careerGuidance: null, unsure: null, english: null },
  jungPassages: [],
  privacyLine: null,
};
