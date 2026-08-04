import { WHEEL_ZODIAC, type WheelSign } from "@/domain/wheel/wheelGeometry";
import type { PayloadMandala } from "@/infrastructure/payload/getMandalaGlobal";
import type { MandalaContent } from "./MandalaContent";
import {
  VEDIC_CONTENT,
  type VedicContent,
  ZODIAC_CONTENT,
  type ZodiacContent,
} from "./zodiacContent";

/** A trimmed-non-empty string, or null when the value is blank/absent. */
function filledText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  return value.trim().length > 0 ? value : null;
}

/**
 * Overlay editable CMS prose on the code reference, keyed by sign id. An empty
 * CMS field falls back to the code text and the entry stays flagged
 * `_isPlaceholder` — still an un-edited draft.
 */
export function mandalaFromPayload(doc: PayloadMandala): MandalaContent {
  const zodiac = {} as Record<WheelSign["id"], ZodiacContent>;
  const vedic = {} as Record<WheelSign["id"], VedicContent>;

  for (const { id } of WHEEL_ZODIAC) {
    const baseZodiac = ZODIAC_CONTENT[id];
    const baseVedic = VEDIC_CONTENT[id];
    const cms = doc?.[id] ?? null;

    const paragraph = filledText(cms?.paragraph);
    const vedicParagraph = filledText(cms?.vedicParagraph);

    zodiac[id] = {
      ...baseZodiac,
      paragraph: paragraph ?? baseZodiac.paragraph,
      _isPlaceholder: paragraph === null,
    };
    vedic[id] = {
      ...baseVedic,
      paragraph: vedicParagraph ?? baseVedic.paragraph,
      _isPlaceholder: vedicParagraph === null,
    };
  }

  return { zodiac, vedic };
}
