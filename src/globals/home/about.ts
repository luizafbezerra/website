import type { GlobalConfig } from "payload";
import { headingField } from "../../fields/accentHeading";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/** About (Sobre) — accent heading, bio, formação, idiomas. Leads with its heading (no eyebrow). */
export const HomeAbout: GlobalConfig = {
  slug: "home-about",
  label: "Sobre",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [
    headingField({ label: "Título" }),
    { name: "bio", type: "richText", label: "Biografia" },
    { name: "formacao", type: "text", label: "Formação" },
    { name: "idiomas", type: "text", label: "Idiomas" },
  ],
};
