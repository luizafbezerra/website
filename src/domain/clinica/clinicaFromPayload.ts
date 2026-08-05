import type { PayloadClinica } from "@/infrastructure/payload/getClinicaGlobal";
import { isAvailabilityState } from "./AvailabilityState";
import { type Clinica, CLINICA_DEFAULTS, type JungPassage } from "./Clinica";
import { feeFrom } from "./Fee";
import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

/** Blank strings are absences, not values — a cleared field must fall back. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

function passagesFrom(raw: PayloadClinica["jung"]): JungPassage[] {
  if (!Array.isArray(raw?.passages)) return CLINICA_DEFAULTS.jungPassages;

  return raw.passages
    .map((passage) => ({
      text: filled(passage?.text),
      attribution: filled(passage?.attribution),
    }))
    .filter((passage): passage is JungPassage => passage.text !== null);
}

/**
 * The credential strip, in stored order. An emptied array is a decision — she
 * removed the last unconfirmed fact — so it stays empty instead of falling back
 * to the defaults; only a missing array means "never edited".
 */
function credentialsFrom(raw: PayloadClinica["identity"]): string[] {
  if (!Array.isArray(raw?.credentials)) return CLINICA_DEFAULTS.credentials;

  return raw.credentials
    .map((entry) => filled(entry?.item))
    .filter((item): item is string => item !== null);
}

/** Normalize the raw `clinica` global, falling back field by field. */
export function clinicaFromPayload(doc: PayloadClinica): Clinica {
  const defaults = CLINICA_DEFAULTS;
  const whatsappE164 = filled(doc.contact?.whatsappE164) ?? defaults.whatsappE164;
  const state = doc.availability?.state;

  return {
    clinicName: filled(doc.identity?.clinicName) ?? defaults.clinicName,
    fullName: filled(doc.identity?.fullName) ?? defaults.fullName,
    shortName: filled(doc.identity?.shortName) ?? defaults.shortName,
    role: filled(doc.identity?.role) ?? defaults.role,
    // The one field whose empty value is meaningful: no CRP means no row.
    credential: filled(doc.identity?.credential) ?? defaults.credential,
    credentials: credentialsFrom(doc.identity),
    positioning: filled(doc.identity?.positioning) ?? defaults.positioning,
    whatsappE164,
    whatsappDisplay: filled(doc.contact?.whatsappDisplay) ?? defaults.whatsappDisplay,
    whatsappUrl: whatsappUrlFromPhone(whatsappE164),
    email: filled(doc.contact?.email) ?? defaults.email,
    instagramUrl: filled(doc.contact?.instagramUrl) ?? defaults.instagramUrl,
    instagramHandle: filled(doc.contact?.instagramHandle) ?? defaults.instagramHandle,
    availability: {
      state: isAvailabilityState(state) ? state : defaults.availability.state,
      responseWindow: filled(doc.availability?.responseWindow),
    },
    fees: {
      analysis: feeFrom(doc.fees?.analysis),
      careerGuidance: feeFrom(doc.fees?.careerGuidance),
      internationalNote: filled(doc.fees?.internationalNote),
    },
    // The openers fall back like every other field, which is what makes the
    // drafts reach production: Phase 4 seeded these four blank, and a blank
    // stored value would otherwise leave /primeira-conversa's set-piece empty on
    // a database nobody has edited.
    notes: {
      analysis: filled(doc.notes?.analysis) ?? defaults.notes.analysis,
      careerGuidance: filled(doc.notes?.careerGuidance) ?? defaults.notes.careerGuidance,
      unsure: filled(doc.notes?.unsure) ?? defaults.notes.unsure,
      english: filled(doc.notes?.english) ?? defaults.notes.english,
    },
    jungPassages: passagesFrom(doc.jung),
    privacyLine: filled(doc.privacy?.line),
  };
}
