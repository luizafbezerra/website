import { getPageInicioGlobal as infraGetPageInicioGlobal } from "@/infrastructure/payload/getPageInicioGlobal";
import type { Locale } from "@/domain/site/Locale";
import { type Inicio, INICIO_DEFAULTS } from "./Inicio";
import { inicioFromPayload } from "./inicioFromPayload";

/**
 * The home page's own copy. This is the single read path for the `page-inicio`
 * global; cross-page facts come from `getClinica` instead.
 *
 * Falls back to `INICIO_DEFAULTS` when Payload is off and when the read fails —
 * pre-deploy the table does not exist yet, and the home page is the one route
 * that must never be what takes the site down.
 */
export async function getInicio(locale: Locale): Promise<Inicio> {
  try {
    const doc = await infraGetPageInicioGlobal(locale);
    if (!doc) return INICIO_DEFAULTS;

    return inicioFromPayload(doc);
  } catch (error) {
    console.error("[inicio] global read failed, falling back to defaults:", error);
    return INICIO_DEFAULTS;
  }
}
