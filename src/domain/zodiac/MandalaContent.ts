import type { WheelSign } from "@/domain/wheel/wheelGeometry";
import {
  VEDIC_CONTENT,
  type VedicContent,
  ZODIAC_CONTENT,
  type ZodiacContent,
} from "./zodiacContent";

// ---------------------------------------------------------------------------
// The hybrid editability model.
//
// Only the two prose paragraphs of each sign — its sign text and its Vedic
// summary — are editable from the Payload `mandala` global. Everything else
// (element / modality / ruler / body / archetype, and the full nakshatra table)
// stays code-maintained: it is interlocking scholarly reference data, not
// editorial voice, and the Vedic padas deliberately span sign boundaries.
//
// The `mandala` global seeds its defaults from this same prose, so the rendered
// site is identical until she edits a paragraph.
// ---------------------------------------------------------------------------

export type MandalaContent = {
  zodiac: Record<WheelSign["id"], ZodiacContent>;
  vedic: Record<WheelSign["id"], VedicContent>;
};

/** Code defaults: every sign's reference data plus its placeholder prose. */
export const MANDALA_DEFAULTS: MandalaContent = {
  zodiac: ZODIAC_CONTENT,
  vedic: VEDIC_CONTENT,
};
