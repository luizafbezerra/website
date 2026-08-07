import type { Locale } from "@/domain/site/Locale";
import { getPageOrientacaoProfissionalGlobal as infraGetPageOrientacaoProfissionalGlobal } from "@/infrastructure/payload/getPageOrientacaoProfissionalGlobal";
import {
  ORIENTACAO_PROFISSIONAL_DEFAULTS,
  type OrientacaoProfissional,
} from "./OrientacaoProfissional";
import { orientacaoProfissionalFromPayload } from "./orientacaoProfissionalFromPayload";

/**
 * The career-guidance page's own copy. This is the single read path for the
 * `page-orientacao-profissional` global; the fee, the availability state, the
 * credential strip and the orientação opener come from `getClinica` instead.
 *
 * Falls back to `ORIENTACAO_PROFISSIONAL_DEFAULTS` when Payload is off and when the
 * read fails. This page is the site's strongest non-brand search asset (CONCEPT
 * §10), so a database hiccup must degrade to the written page rather than to an
 * error screen — an error page is also a page a crawler can index.
 */
export async function getOrientacaoProfissional(locale: Locale): Promise<OrientacaoProfissional> {
  try {
    const doc = await infraGetPageOrientacaoProfissionalGlobal(locale);
    if (!doc) return ORIENTACAO_PROFISSIONAL_DEFAULTS;

    return orientacaoProfissionalFromPayload(doc);
  } catch (error) {
    console.error("[orientacaoProfissional] global read failed, falling back to defaults:", error);
    return ORIENTACAO_PROFISSIONAL_DEFAULTS;
  }
}
