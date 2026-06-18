import type { GlobalConfig } from "payload";
import { headingField } from "../../fields/accentHeading";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/** Contact (Contato) — eyebrow, accent heading, body, and the WhatsApp/FAQ labels. */
export const HomeContact: GlobalConfig = {
  slug: "home-contact",
  label: "Contato",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [
    { name: "eyebrow", type: "text", label: "Sobrescrito" },
    headingField({ label: "Título" }),
    { name: "body", type: "richText", label: "Texto" },
    { name: "whatsappLabel", type: "text", label: "Rótulo do botão WhatsApp" },
    { name: "faqLinkLabel", type: "text", label: "Rótulo do link de perguntas" },
  ],
};
