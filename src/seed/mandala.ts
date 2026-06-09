import type { Payload } from "payload";
import { MANDALA_DEFAULTS } from "@/core/zodiacContent";

/**
 * Seed the `mandala` global from `MANDALA_DEFAULTS` — the two editable prose
 * paragraphs (sign + vedic) of each zodiac sign, which the wheel falls back to
 * in code. The structural reference (element/regente/nakshatras) is not stored.
 * Idempotent (globals upsert). Skips revalidation so it can run outside a Next
 * request, like the other seeders.
 */
export async function seedMandala(payload: Payload): Promise<void> {
  const { zodiac, vedic } = MANDALA_DEFAULTS;
  const prose = (id: keyof typeof zodiac) => ({
    paragraph: zodiac[id].paragraph,
    vedicParagraph: vedic[id].paragraph,
  });

  await payload.updateGlobal({
    slug: "mandala",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: {
      aries: prose("aries"),
      taurus: prose("taurus"),
      gemini: prose("gemini"),
      cancer: prose("cancer"),
      leo: prose("leo"),
      virgo: prose("virgo"),
      libra: prose("libra"),
      scorpio: prose("scorpio"),
      sagittarius: prose("sagittarius"),
      capricorn: prose("capricorn"),
      aquarius: prose("aquarius"),
      pisces: prose("pisces"),
    },
  });

  payload.logger.info("  ✓ mandala global");
}
