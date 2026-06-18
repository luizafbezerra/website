import type { GlobalConfig } from "payload";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/**
 * Voices (título) — just the section heading. The quotes themselves live in the
 * `testimonials` collection (consent + initials), co-located in this group.
 * Leads with its heading (no eyebrow); the heading stays plain text (no accent).
 */
export const HomeVoices: GlobalConfig = {
  slug: "home-voices",
  label: "Vozes (título)",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [{ name: "heading", type: "text", label: "Título" }],
};
