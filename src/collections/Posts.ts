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
  if (slug) {
    revalidatePath(`/blog/${slug}`, "layout");
  }
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Publicação", plural: "Publicações" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedDate", "updatedAt"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Endereço (slug)",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from the English title on create. Can be edited manually.",
      },
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
        description: "Optional hero image for the post.",
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
