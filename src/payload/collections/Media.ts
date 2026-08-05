import path from "path";
import type { CollectionConfig } from "payload";
import { fileURLToPath } from "url";

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
  fields: [
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
