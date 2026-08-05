import { getPagePerguntasGlobal as infraGetPagePerguntasGlobal } from "@/infrastructure/payload/getPagePerguntasGlobal";
import type { Locale } from "@/domain/site/Locale";
import { PERGUNTAS_DEFAULTS, type Perguntas } from "./Perguntas";
import { perguntasFromPayload } from "./perguntasFromPayload";

/**
 * The reference page's own frame — its opening, the four section headings, the
 * plate and the closing hand-off. This is the single read path for the
 * `page-perguntas` global; the questions come from `getFaq` and the credential
 * strip and WhatsApp number from `getClinica`.
 *
 * Falls back to `PERGUNTAS_DEFAULTS` when Payload is off and when the read fails.
 * This page is where a cold searcher's last doubt gets answered, so a database
 * hiccup must degrade to the written page rather than to an error screen — and
 * the questions degrade the same way, through `getFaq`'s own fallback.
 */
export async function getPerguntas(locale: Locale): Promise<Perguntas> {
  try {
    const doc = await infraGetPagePerguntasGlobal(locale);
    if (!doc) return PERGUNTAS_DEFAULTS;

    return perguntasFromPayload(doc);
  } catch (error) {
    console.error("[perguntas] global read failed, falling back to defaults:", error);
    return PERGUNTAS_DEFAULTS;
  }
}
