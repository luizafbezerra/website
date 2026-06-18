import type { GlobalConfig } from "payload";
import { headingField } from "../../fields/accentHeading";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/** Writing (Escrita) — accent heading + intro for the recent-posts block. Leads with its heading (no eyebrow). */
export const HomeWriting: GlobalConfig = {
  slug: "home-writing",
  label: "Escrita (bloco)",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [
    headingField({ label: "Título" }),
    { name: "intro", type: "textarea", label: "Introdução" },
  ],
};
