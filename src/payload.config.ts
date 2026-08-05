import { buildConfig } from "payload";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { pt } from "@payloadcms/translations/languages/pt";
import path from "path";
import { fileURLToPath } from "url";

import { DEFAULT_LOCALE, SITE_LOCALES } from "@/domain/site/Locale";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Testimonials } from "./payload/collections/Testimonials";
import { Faq } from "./payload/collections/Faq";
import { Clinica } from "./payload/globals/clinica";
import { PageInicio } from "./payload/globals/pages/inicio";
import { PageAnalise } from "./payload/globals/pages/analise";
import { PageOrientacaoProfissional } from "./payload/globals/pages/orientacaoProfissional";
import { PageSobre } from "./payload/globals/pages/sobre";
import { PagePrimeiraConversa } from "./payload/globals/pages/primeiraConversa";
import { PagePerguntas } from "./payload/globals/pages/perguntas";
import { PageInternacional } from "./payload/globals/pages/internacional";
import { PagePrivacidade } from "./payload/globals/pages/privacidade";

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
  // Content localization (REQ-002), distinct from `i18n` above: that one is the
  // admin chrome's language, this one is the language of what she writes.
  // Visitor-facing text fields carry `localized: true` (see
  // `payload/fields/copyFields.ts`); `fallback` means an English field she has
  // not translated yet renders her Portuguese, so /en is never blank.
  localization: {
    locales: [...SITE_LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  // Admin information architecture (TASK-025). Four groups, and every document
  // belongs to exactly one: "Páginas" (one global per address, in CONCEPT §6 map
  // order), "A clínica" (the facts shared by every page), "Conteúdo" (the lists
  // she grows), "Sistema".
  collections: [Testimonials, Faq, Media, Users],
  globals: [
    PageInicio,
    PageAnalise,
    PageOrientacaoProfissional,
    PageSobre,
    PagePrimeiraConversa,
    PagePerguntas,
    PageInternacional,
    PagePrivacidade,
    Clinica,
  ],
  // The code-block feature existed for the blog only; editorial rich text needs
  // nothing beyond the defaults.
  editor: lexicalEditor(),
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
