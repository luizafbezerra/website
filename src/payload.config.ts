import { buildConfig } from "payload";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { pt } from "@payloadcms/translations/languages/pt";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Testimonials } from "./collections/Testimonials";
import { LexicalCodeFeature } from "./features/lexicalCode/feature.server";
import { Settings } from "./globals/Settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  // Single-locale admin: the practice is pt-BR, so the panel chrome renders in
  // Portuguese. Field labels are set per-field across the collections/globals.
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: "pt",
  },
  collections: [Users, Media, Posts, Testimonials],
  globals: [Settings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, LexicalCodeFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: vercelPostgresAdapter({ pool: { connectionString: process.env.POSTGRES_URL } }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
});
