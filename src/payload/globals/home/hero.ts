import type { GlobalConfig } from "payload";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/** Hero — the pinned-first block: subtitle, opening paragraph, CTAs, portrait. */
export const HomeHero: GlobalConfig = {
  slug: "home-hero",
  label: "Início (hero)",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [
    {
      name: "subtitle",
      type: "text",
      label: "Subtítulo",
      admin: { description: 'Linha sob o nome, ex.: "Para a vida adulta".' },
    },
    { name: "lead", type: "richText", label: "Parágrafo de abertura" },
    { name: "ctaPrimaryLabel", type: "text", label: "Botão principal" },
    { name: "ctaSecondaryLabel", type: "text", label: "Link secundário" },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
      label: "Retrato",
      admin: { description: "Foto da Luiza. Em branco, usa a imagem padrão do código." },
    },
  ],
};
