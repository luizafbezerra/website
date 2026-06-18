import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { seoField } from "../fields/seo";

/**
 * Site-wide settings. Fields are grouped into UNNAMED tabs purely for editor
 * navigation — unnamed tabs are presentational, so every field keeps its
 * existing data path (no migration). Never wrap these in a NAMED tab: that
 * would shift the column path and break the identity mapper's field-by-field
 * fallback.
 */
export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Configurações",
  admin: { group: "Configurações" },
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
    {
      type: "tabs",
      tabs: [
        // ── Identidade & Prática ─────────────────────────────────────────────
        {
          label: "Identidade & Prática",
          description: "Quem é a Luiza e onde atende. Editado uma vez; reutilizado em todo o site.",
          fields: [
            {
              name: "identity",
              type: "group",
              label: "Identidade",
              admin: {
                description: "Quem é a Luiza. Editado uma vez; reutilizado em todo o site.",
              },
              fields: [
                { name: "fullName", type: "text", label: "Nome completo" },
                {
                  name: "shortName",
                  type: "text",
                  label: "Nome curto",
                  admin: { description: "Forma familiar, ex.: para a legenda do retrato." },
                },
                {
                  name: "role",
                  type: "text",
                  label: "Profissão",
                  admin: { description: 'Ex.: "Psicóloga clínica".' },
                },
                {
                  name: "tradition",
                  type: "text",
                  label: "Abordagem",
                  admin: { description: 'Ex.: "Análise junguiana".' },
                },
                {
                  name: "credential",
                  type: "text",
                  label: "Registro (CRP)",
                  admin: { description: "Registro no Conselho, ex.: CRP 06/123456." },
                },
              ],
            },
            {
              name: "nap",
              type: "group",
              label: "Localização (NAP)",
              admin: {
                description: "Edite a cidade uma vez — cada frase modelo e o JSON-LD a reutilizam.",
              },
              fields: [
                { name: "city", type: "text", label: "Cidade" },
                {
                  name: "region",
                  type: "text",
                  label: "Estado",
                  admin: { description: "Estado, ex.: São Paulo." },
                },
                { name: "country", type: "text", label: "País" },
                {
                  name: "countryCode",
                  type: "text",
                  label: "Código do país",
                  admin: { description: "Código ISO, ex.: BR." },
                },
              ],
            },
          ],
        },
        // ── Contato ──────────────────────────────────────────────────────────
        {
          label: "Contato",
          fields: [
            {
              name: "contact",
              type: "group",
              label: "Contato",
              fields: [
                {
                  name: "phoneE164",
                  type: "text",
                  label: "Telefone (formato E.164)",
                  admin: {
                    description: "Formato E.164 (ex.: +5511964158128) — define o link do WhatsApp.",
                  },
                },
                {
                  name: "phoneDisplay",
                  type: "text",
                  label: "Telefone (exibição)",
                  admin: {
                    description: "Forma legível exibida nos botões, ex.: +55 11 96415-8128.",
                  },
                },
                { name: "email", type: "email", label: "E-mail" },
                { name: "instagramUrl", type: "text", label: "URL do Instagram" },
                {
                  name: "instagramHandle",
                  type: "text",
                  label: "Usuário do Instagram",
                  admin: { description: "Ex.: @simbolos.do.self" },
                },
              ],
            },
            {
              name: "availability",
              type: "group",
              label: "Disponibilidade",
              admin: {
                description:
                  "Opcional. Deixe um campo em branco para ocultar essa linha na seção de Contato.",
              },
              fields: [
                {
                  name: "hours",
                  type: "text",
                  label: "Horários",
                  admin: { description: "Ex.: Seg–Sex, 9h–18h." },
                },
                {
                  name: "responseNote",
                  type: "text",
                  label: "Tempo de resposta",
                  admin: { description: "Ex.: Respondo em até um dia útil." },
                },
              ],
            },
          ],
        },
        // ── Marca & Chrome ───────────────────────────────────────────────────
        {
          label: "Marca & Chrome",
          fields: [
            { name: "siteName", type: "text", label: "Nome do site", required: true },
            {
              name: "tagline",
              type: "textarea",
              label: "Resumo da prática",
              admin: {
                description:
                  "Resumo da prática em uma frase. Usado como fallback da meta descrição e no JSON-LD.",
              },
            },
            {
              name: "chrome",
              type: "group",
              label: "Cabeçalho e rodapé",
              fields: [
                {
                  name: "headerByline",
                  type: "text",
                  label: "Linha do cabeçalho",
                  admin: { description: "Pequena linha ao lado do nome no cabeçalho." },
                },
                {
                  name: "footerByline",
                  type: "text",
                  label: "Linha do rodapé",
                  admin: { description: "Pequena linha abaixo do nome no rodapé." },
                },
              ],
            },
          ],
        },
        // ── SEO & Social ─────────────────────────────────────────────────────
        {
          label: "SEO & Social",
          description: "Padrões de SEO do site e imagem social. Cada página pode sobrescrevê-los.",
          fields: [
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
            seoField(),
          ],
        },
      ],
    },
  ],
};
