import { buildConfig } from "payload";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { resendAdapter } from "@payloadcms/email-resend";
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
import { InstagramAuth } from "./payload/globals/instagramAuth";
import { refreshInstagramTokenWorkflow } from "./payload/jobs/refreshInstagramToken";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Outbound email exists only to reach the developer when the Instagram token
 * refresh keeps failing — there are no forms on this site and nothing is ever
 * sent to a visitor. Configured only when both halves are present, so a local
 * checkout with no Resend key still boots and the alert falls back to
 * `console.error` (see `alertInstagramTokenFailure`).
 */
const email =
  process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_FROM
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.CONTACT_EMAIL_FROM,
        defaultFromName: "Símbolos do Self",
      })
    : undefined;

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
    // "Sistema": machine state, hidden from her sidebar (see instagramAuth.ts).
    InstagramAuth,
  ],
  email,
  /**
   * One scheduled workflow: renewing the Instagram token (see
   * `payload/jobs/refreshInstagramToken.ts` — two tasks, so a token fetched
   * from Meta survives a failed save). No `autoRun` — this deploys to
   * serverless functions, where there is no long-lived process to hold a timer;
   * a Vercel cron pokes `/api/payload-jobs/run` daily and that endpoint
   * evaluates the schedules itself.
   */
  jobs: {
    workflows: [refreshInstagramTokenWorkflow],
    // Required by the workflow's `concurrency` key, which keeps a retrying run
    // and a freshly scheduled one from refreshing the token simultaneously.
    enableConcurrencyControl: true,
    /**
     * Payload hides the jobs collection by default, which made every refresh
     * run invisible — the audit trail existed but nobody could open it. Shown
     * under Sistema instead. A successful run deletes its own row
     * (`deleteJobOnComplete`, left at its default on purpose: the row's task
     * log carries the fetched token, and a success has nothing to keep), so
     * what appears here is exactly what needs attention — failures and
     * pending retries. Success is recorded on the `instagram-auth` global;
     * `pnpm instagram:status` prints both.
     */
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      admin: {
        ...defaultJobsCollection.admin,
        group: "Sistema",
        hidden: false,
      },
      labels: { plural: "Tarefas agendadas", singular: "Tarefa agendada" },
    }),
    access: {
      /**
       * `jobs.access.run` defaults to **public**, which would leave the job
       * runner open to anyone who guessed the path. Vercel's cron sends
       * `Authorization: Bearer $CRON_SECRET`; an admin session is also allowed so
       * the endpoint stays usable by hand.
       *
       * With `CRON_SECRET` unset the header can never match, so this falls back
       * to requiring a logged-in user — closed, not open.
       */
      run: ({ req }) => {
        const header = req.headers.get("authorization");
        if (process.env.CRON_SECRET && header === `Bearer ${process.env.CRON_SECRET}`) return true;
        return Boolean(req.user);
      },
    },
  },
  // The code-block feature existed for the blog only; editorial rich text needs
  // nothing beyond the defaults.
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: vercelPostgresAdapter({ pool: { connectionString: process.env.POSTGRES_URL } }),
  plugins: [
    vercelBlobStorage({
      // Serve the blob URL itself, not Payload's `/api/media/file/<name>` proxy.
      //
      // The proxy is the adapter's default, and it costs a serverless invocation
      // per image: boot Payload, run the collection's read access control, fetch
      // the bytes back out of Blob, stream them on — with no `Cache-Control`, so
      // nothing downstream may keep the result. Measured at 0.5–2.3s locally,
      // and `/_next/image` chains *behind* it: the optimizer cannot emit a byte
      // until the proxy answers, so her portrait and every plate wait out two
      // functions on a cold path that repeats because none of it caches.
      //
      // The collection is `read: () => true` — the files are public, and Blob's
      // access is `'public'` — so the access-control hop was buying nothing. The
      // blob URL is served from the edge with a one-year `Cache-Control`, and
      // `next.config.ts` already allow-lists the hostname in `remotePatterns`,
      // which is the leftover showing this was the intent all along.
      //
      // The stored `url` column still reads `/api/media/file/…`; the adapter's
      // afterRead hook rewrites it on every read, so no data migration and no
      // re-upload — the files are already in Blob.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
});
