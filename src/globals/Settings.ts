import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { seoField } from "../fields/seo";

export const Settings: GlobalConfig = {
  slug: "settings",
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
    { name: "siteName", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "ogImage", type: "upload", relationTo: "media" },
    {
      name: "social",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "tagline",
      type: "textarea",
      admin: {
        description:
          "One-sentence summary of the practice. Used as a meta-description fallback and in JSON-LD.",
      },
    },

    // ── Identity ─────────────────────────────────────────────────────────────
    {
      name: "identity",
      type: "group",
      admin: { description: "Who Luiza is. Edited once; reused across the whole site." },
      fields: [
        { name: "fullName", type: "text" },
        {
          name: "shortName",
          type: "text",
          admin: { description: "Familiar form, e.g. for the portrait caption." },
        },
        { name: "role", type: "text", admin: { description: 'e.g. "Psicóloga clínica".' } },
        { name: "tradition", type: "text", admin: { description: 'e.g. "Análise junguiana".' } },
        {
          name: "credential",
          type: "text",
          admin: { description: "Conselho registration, e.g. CRP 06/123456." },
        },
      ],
    },

    // ── NAP (name / address / phone — local-SEO single source) ───────────────
    {
      name: "nap",
      type: "group",
      label: "Location (NAP)",
      admin: {
        description: "Edit the city once — every templated sentence and JSON-LD reuses it.",
      },
      fields: [
        { name: "city", type: "text" },
        { name: "region", type: "text", admin: { description: "State, e.g. São Paulo." } },
        { name: "country", type: "text" },
        { name: "countryCode", type: "text", admin: { description: "ISO code, e.g. BR." } },
      ],
    },

    // ── Contact ──────────────────────────────────────────────────────────────
    {
      name: "contact",
      type: "group",
      fields: [
        {
          name: "phoneE164",
          type: "text",
          admin: { description: "E.164 format (e.g. +5511964158128) — drives the WhatsApp link." },
        },
        {
          name: "phoneDisplay",
          type: "text",
          admin: { description: "Human-readable form shown on buttons, e.g. +55 11 96415-8128." },
        },
        { name: "email", type: "email" },
        { name: "instagramUrl", type: "text" },
        { name: "instagramHandle", type: "text", admin: { description: "e.g. @simbolos.do.self" } },
      ],
    },

    // ── Availability (optional — blank rows hide on the page) ────────────────
    {
      name: "availability",
      type: "group",
      admin: {
        description: "Optional. Leave a field blank to hide that row in the Contact section.",
      },
      fields: [
        { name: "hours", type: "text", admin: { description: "e.g. Seg–Sex, 9h–18h." } },
        {
          name: "responseNote",
          type: "text",
          admin: { description: "e.g. Respondo em até um dia útil." },
        },
      ],
    },

    // ── Chrome (header / footer bylines) ─────────────────────────────────────
    {
      name: "chrome",
      type: "group",
      fields: [
        {
          name: "headerByline",
          type: "text",
          admin: { description: "Small line beside the name in the header." },
        },
        {
          name: "footerByline",
          type: "text",
          admin: { description: "Small line under the name in the footer." },
        },
      ],
    },

    // ── SEO defaults (per-page overrides live on each page global) ───────────
    seoField(),
  ],
};
