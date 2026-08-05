import { getPageInternacionalGlobal as infraGetPageInternacionalGlobal } from "@/infrastructure/payload/getPageInternacionalGlobal";
import type { Locale } from "@/domain/site/Locale";
import { INTERNACIONAL_DEFAULTS, type Internacional } from "./Internacional";
import { internacionalFromPayload } from "./internacionalFromPayload";

/**
 * Brasil e exterior's own copy. This is the single read path for the
 * `page-internacional` global; the international bilhete opener, the availability
 * state and the credential strip come from `getClinica` instead.
 *
 * Falls back to `INTERNACIONAL_DEFAULTS` when Payload is off and when the read
 * fails. This page is the answer to one question — "do you attend from where I
 * live?" — and a database hiccup must degrade to the written page rather than to
 * an error screen that reads like "no".
 */
export async function getInternacional(locale: Locale): Promise<Internacional> {
  try {
    const doc = await infraGetPageInternacionalGlobal(locale);
    if (!doc) return INTERNACIONAL_DEFAULTS;

    return internacionalFromPayload(doc);
  } catch (error) {
    console.error("[internacional] global read failed, falling back to defaults:", error);
    return INTERNACIONAL_DEFAULTS;
  }
}
