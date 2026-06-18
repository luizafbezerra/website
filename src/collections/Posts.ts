import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const revalidateBlog = (slug?: string) => {
  revalidatePath("/blog", "layout");
  // The nav lives in the root layout and the homepage "Escrita" section depends
  // on post count, so the 0↔1 transition must refresh "/" (all pages) too.
  revalidatePath("/", "layout");
  if (slug) {
    revalidatePath(`/blog/${slug}`, "layout");
  }
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Publicação", plural: "Publicações" },
  admin: {
    group: "Blog",
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedDate", "updatedAt"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    // Content fields in an UNNAMED "Conteúdo" tab (presentational only — field
    // data paths are unchanged). The slug / date / featured fields stay in the
    // sidebar via `admin.position`.
    {
      type: "tabs",
      tabs: [
        {
          label: "Conteúdo",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Título",
              required: true,
              localized: true,
            },
            {
              name: "description",
              type: "textarea",
              label: "Descrição",
              required: true,
              localized: true,
            },
            {
              name: "coverImage",
              type: "upload",
              relationTo: "media",
              label: "Imagem de capa",
              required: false,
              admin: {
                description: "Imagem de capa opcional para a publicação.",
              },
            },
            {
              name: "content",
              type: "richText",
              label: "Conteúdo",
              required: true,
              localized: true,
            },
            {
              name: "tags",
              type: "array",
              label: "Tags",
              fields: [
                {
                  name: "tag",
                  type: "text",
                  label: "Tag",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      label: "Endereço (slug)",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Gerado automaticamente a partir do título ao criar. Pode ser editado manualmente.",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      label: "Data de publicação",
      required: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "yyyy-MM-dd",
        },
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destaque",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && !data.slug && data.title) {
          const titleValue =
            typeof data.title === "object" ? (data.title as Record<string, string>).en : data.title;
          if (titleValue) {
            data.slug = slugify(titleValue);
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, context }) => {
        if (context.disableRevalidate) return;
        const slug = doc.slug as string | undefined;
        revalidateBlog(slug);
      },
    ],
    afterDelete: [
      async ({ doc, context }) => {
        if (context?.disableRevalidate) return;
        const slug = doc.slug as string | undefined;
        revalidateBlog(slug);
      },
    ],
  },
};
