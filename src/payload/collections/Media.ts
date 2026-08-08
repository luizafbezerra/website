import path from "path";
import type { CollectionConfig } from "payload";
import { fileURLToPath } from "url";
import { blurDataUrlFrom } from "@/payload/media/blurDataUrl";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Mídia", plural: "Arquivos de mídia" },
  admin: {
    group: "Conteúdo",
    description:
      "As imagens do site. O texto alternativo descreve a imagem para quem não a vê — e é traduzível.",
  },
  upload: {
    // Three levels up from src/payload/collections/ is the project root. Only
    // used when the Vercel Blob adapter is absent; it owns storage otherwise.
    staticDir: path.resolve(dirname, "../../../public/media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: undefined },
      { name: "card", width: 768, height: undefined },
      { name: "hero", width: 1400, height: undefined },
    ],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // Derive the placeholder from the bytes as they arrive, before the adapter
    // ships them to Blob. `req.file` is present on a create and on a replace-file
    // update, and absent when she only edits the alt text — in which case the
    // stored value is already right and must survive untouched.
    beforeChange: [
      async ({ data, req }) => {
        const buffer = req.file?.data;
        if (!buffer) return data;
        return { ...data, blurDataURL: await blurDataUrlFrom(buffer) };
      },
    ],
  },
  fields: [
    {
      name: "blurDataURL",
      type: "text",
      // Machine-written and machine-read: a base64 data URI is not something to
      // put in front of her. Hidden rather than access-locked — field-level
      // `update: () => false` would strip the hook's own value on the way in.
      admin: { hidden: true },
    },
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
      localized: true,
      admin: {
        description:
          "Descreva o que se vê. Para uma pintura, diga a cena — não repita o título da obra.",
      },
    },
  ],
};
