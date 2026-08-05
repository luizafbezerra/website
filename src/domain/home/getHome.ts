import { getHomeAboutGlobal as infraGetHomeAboutGlobal } from "@/infrastructure/payload/getHomeAboutGlobal";
import { getHomeContactGlobal as infraGetHomeContactGlobal } from "@/infrastructure/payload/getHomeContactGlobal";
import { getHomeHeroGlobal as infraGetHomeHeroGlobal } from "@/infrastructure/payload/getHomeHeroGlobal";
import { getHomePillarsGlobal as infraGetHomePillarsGlobal } from "@/infrastructure/payload/getHomePillarsGlobal";
import { getHomeStructureGlobal as infraGetHomeStructureGlobal } from "@/infrastructure/payload/getHomeStructureGlobal";
import { getHomeVoicesGlobal as infraGetHomeVoicesGlobal } from "@/infrastructure/payload/getHomeVoicesGlobal";
import type { Locale } from "@/domain/site/Locale";
import { type Home, HOME_DEFAULTS } from "./Home";
import { homeFromPayload } from "./homeFromPayload";

/**
 * The homepage is composed from several small globals (structure + one per
 * section), read together and assembled into the single `Home` object. Falls
 * back to `HOME_DEFAULTS` when Payload is off or a global read fails (e.g.
 * pre-migration, when the table does not exist yet), so the page never breaks
 * on a schema that has not deployed.
 */
export async function getHome(locale: Locale): Promise<Home> {
  try {
    const [structure, hero, pillars, about, voices, contact] = await Promise.all([
      infraGetHomeStructureGlobal(locale),
      infraGetHomeHeroGlobal(locale),
      infraGetHomePillarsGlobal(locale),
      infraGetHomeAboutGlobal(locale),
      infraGetHomeVoicesGlobal(locale),
      infraGetHomeContactGlobal(locale),
    ]);

    return homeFromPayload({ structure, hero, pillars, about, voices, contact });
  } catch (error) {
    console.error("[home] global read failed, falling back to defaults:", error);
    return HOME_DEFAULTS;
  }
}
