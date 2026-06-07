import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { seoField } from "../fields/seo";

export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Configurações",
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        // The seed script writes this global outside a Next request scope,
        // where `revalidatePath` throws. It passes `skipRevalidate`; real admin
        // saves run inside a request and revalidate normally.
        if (context?.skipRevalidate) return;
        revalidatePath("/", "layout");
      },
    ],
  },
  fields: [
    // ── Site metadata (existing) ─────────────────────────────────────────────
    { name: "siteName", type: "text", label: "Nome do site", required: true },
    { name: "description", type: "textarea", label: "Descrição" },
    { name: "ogImage", type: "upload", relationTo: "media", label: "Imagem social (OG)" },
    {
      name: "social",
      type: "array",
      label: "Redes sociais",
      fields: [
        { name: "label", type: "text", label: "Rótulo", required: true },
        { name: "url", type: "text", label: "URL", required: true },
      ],
    },
    {
      name: "tagline",
      type: "textarea",
      label: "Resumo da prática",
      admin: {
        description:
          "One-sentence summary of the practice. Used as a meta-description fallback and in JSON-LD.",
      },
    },

    // ── Identity ─────────────────────────────────────────────────────────────
    {
      name: "identity",
      type: "group",
      label: "Identidade",
      admin: { description: "Who Luiza is. Edited once; reused across the whole site." },
      fields: [
        { name: "fullName", type: "text", label: "Nome completo" },
        {
          name: "shortName",
          type: "text",
          label: "Nome curto",
          admin: { description: "Familiar form, e.g. for the portrait caption." },
        },
        {
          name: "role",
          type: "text",
          label: "Profissão",
          admin: { description: 'e.g. "Psicóloga clínica".' },
        },
        {
          name: "tradition",
          type: "text",
          label: "Abordagem",
          admin: { description: 'e.g. "Análise junguiana".' },
        },
        {
          name: "credential",
          type: "text",
          label: "Registro (CRP)",
          admin: { description: "Conselho registration, e.g. CRP 06/123456." },
        },
      ],
    },

    // ── NAP (name / address / phone — local-SEO single source) ───────────────
    {
      name: "nap",
      type: "group",
      label: "Localização (NAP)",
      admin: {
        description: "Edit the city once — every templated sentence and JSON-LD reuses it.",
      },
      fields: [
        { name: "city", type: "text", label: "Cidade" },
        {
          name: "region",
          type: "text",
          label: "Estado",
          admin: { description: "State, e.g. São Paulo." },
        },
        { name: "country", type: "text", label: "País" },
        {
          name: "countryCode",
          type: "text",
          label: "Código do país",
          admin: { description: "ISO code, e.g. BR." },
        },
      ],
    },

    // ── Contact ──────────────────────────────────────────────────────────────
    {
      name: "contact",
      type: "group",
      label: "Contato",
      fields: [
        {
          name: "phoneE164",
          type: "text",
          label: "Telefone (formato E.164)",
          admin: { description: "E.164 format (e.g. +5511964158128) — drives the WhatsApp link." },
        },
        {
          name: "phoneDisplay",
          type: "text",
          label: "Telefone (exibição)",
          admin: { description: "Human-readable form shown on buttons, e.g. +55 11 96415-8128." },
        },
        { name: "email", type: "email", label: "E-mail" },
        { name: "instagramUrl", type: "text", label: "URL do Instagram" },
        {
          name: "instagramHandle",
          type: "text",
          label: "Usuário do Instagram",
          admin: { description: "e.g. @simbolos.do.self" },
        },
      ],
    },

    // ── Availability (optional — blank rows hide on the page) ────────────────
    {
      name: "availability",
      type: "group",
      label: "Disponibilidade",
      admin: {
        description: "Optional. Leave a field blank to hide that row in the Contact section.",
      },
      fields: [
        {
          name: "hours",
          type: "text",
          label: "Horários",
          admin: { description: "e.g. Seg–Sex, 9h–18h." },
        },
        {
          name: "responseNote",
          type: "text",
          label: "Tempo de resposta",
          admin: { description: "e.g. Respondo em até um dia útil." },
        },
      ],
    },

    // ── Chrome (header / footer bylines) ─────────────────────────────────────
    {
      name: "chrome",
      type: "group",
      label: "Cabeçalho e rodapé",
      fields: [
        {
          name: "headerByline",
          type: "text",
          label: "Linha do cabeçalho",
          admin: { description: "Small line beside the name in the header." },
        },
        {
          name: "footerByline",
          type: "text",
          label: "Linha do rodapé",
          admin: { description: "Small line under the name in the footer." },
        },
      ],
    },

    // ── SEO defaults (per-page overrides live on each page global) ───────────
    seoField(),
  ],
};
