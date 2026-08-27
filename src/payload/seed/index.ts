import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";
import { seedClinica } from "./clinica";
import { seedFaq } from "./faq";
import { seedPages } from "./pages";

/**
 * Seed Payload globals and collections from the domain layer's code defaults — the
 * same hardcoded values the site renders when Payload is disabled, so the DB and
 * the code fallback share a single source of truth.
 *
 * **This overwrites the CMS, and that is why it asks twice.** Globals are one row
 * each, so every seeder here is an `updateGlobal` upsert: it writes the code
 * default over whatever is stored, in both locales. On a fresh database that is a
 * bootstrap. On a database somebody has been editing through `/admin` it is data
 * loss — and `.env.local` in this project points at **production**, which makes
 * `pnpm seed` a one-word command for discarding Luiza's edits to nine globals.
 *
 * So there are two gates, and they are deliberately different flags:
 *
 *   · `--apply` — required to write anything at all. Without it this is a dry run
 *     that names the target database and every global it would touch.
 *   · `--overwrite-stored` — additionally required when a global already has a
 *     stored row. That is the difference between seeding an empty database and
 *     overwriting a live one, and it should not be the same keystroke.
 *
 * Nothing here deletes. A row in a collection that is no longer in the code
 * defaults is `scripts/faq-cleanup.mts`'s business.
 *
 *   Dry run (default):        pnpm seed
 *   Fresh database:           pnpm seed --apply
 *   Overwrite a live CMS:     pnpm seed --apply --overwrite-stored
 *
 * When only the questions have changed, prefer `pnpm faq:seed`: it writes the
 * `faq` collection alone and leaves all nine globals untouched.
 */

/** Every global this script upserts, in the order the seeders write them. */
const SEEDED_GLOBALS = [
  "clinica",
  "page-inicio",
  "page-analise",
  "page-orientacao-profissional",
  "page-sobre",
  "page-primeira-conversa",
  "page-perguntas",
  "page-internacional",
  "page-privacidade",
] as const;

type Flags = { apply: boolean; overwriteStored: boolean };

function parseFlags(argv: readonly string[]): Flags {
  const known = ["--apply", "--dry-run", "--overwrite-stored"];
  const unknown = argv.filter((arg) => arg.startsWith("--") && !known.includes(arg));
  if (unknown.length > 0) {
    throw new Error(`Unrecognized flag(s): ${unknown.join(", ")}. Use ${known.join(", ")}.`);
  }
  return {
    apply: argv.includes("--apply"),
    overwriteStored: argv.includes("--overwrite-stored"),
  };
}

/**
 * The database the adapter will actually write to, host and name only.
 *
 * Read from `POSTGRES_URL` because that is the variable `payload.config.ts` hands
 * the adapter — reporting `DATABASE_URL` instead would be truthful about the env
 * file and a lie about the write. Credentials are dropped rather than masked: a
 * seed log is the kind of output that gets pasted into a chat.
 */
function targetDatabase(): string {
  const raw = process.env.POSTGRES_URL;
  if (!raw) return "unknown (POSTGRES_URL is not set)";
  try {
    const url = new URL(raw);
    return `${url.host}${url.pathname}`;
  } catch {
    return "unparseable POSTGRES_URL";
  }
}

/**
 * Whether a global already has a row, per slug.
 *
 * `findGlobal` answers with the code defaults when nothing is stored, so the
 * contents cannot distinguish the two states. The `id` can: Payload only sets it
 * once the row exists.
 */
async function storedGlobals(payload: Payload): Promise<string[]> {
  const stored: string[] = [];
  for (const slug of SEEDED_GLOBALS) {
    const doc = (await payload.findGlobal({
      slug,
      locale: "pt",
      depth: 0,
      overrideAccess: true,
    })) as { id?: unknown; updatedAt?: unknown };
    if (doc?.id) stored.push(slug);
  }
  return stored;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const payload = await getPayload({ config });

  const stored = await storedGlobals(payload);
  const faqRows = await payload.count({ collection: "faq", overrideAccess: true });

  payload.logger.warn(`Target database: ${targetDatabase()}`);
  payload.logger.info(
    `Globals: ${SEEDED_GLOBALS.length} would be written — ` +
      `${stored.length} already stored, ${SEEDED_GLOBALS.length - stored.length} empty.`,
  );
  for (const slug of SEEDED_GLOBALS) {
    const state = stored.includes(slug) ? "OVERWRITE (stored)" : "create    (empty)";
    payload.logger.info(`  ${state}  ${slug}`);
  }
  payload.logger.info(
    `Collection faq: ${faqRows.totalDocs} rows in the database, ${FAQ_DEFAULTS.length} in FAQ_DEFAULTS.`,
  );

  if (!flags.apply) {
    payload.logger.info(
      "Dry run — nothing written. Re-run with --apply. " +
        "To write only the questions, use `pnpm faq:seed` instead.",
    );
    return;
  }

  // The second gate. An empty database needs only `--apply`; overwriting a CMS
  // somebody has edited is a separate decision and gets a separate flag.
  if (stored.length > 0 && !flags.overwriteStored) {
    throw new Error(
      `${stored.length} of ${SEEDED_GLOBALS.length} globals already have stored content on ` +
        `${targetDatabase()}, and seeding replaces it with the code defaults in both locales:\n` +
        stored.map((slug) => `  · ${slug}`).join("\n") +
        "\n\nIf you meant to discard those edits, re-run with --apply --overwrite-stored. " +
        "If you only meant to update the questions, run `pnpm faq:seed --apply`.",
    );
  }

  payload.logger.info("Seeding from the domain defaults …");

  await seedClinica(payload);
  await seedPages(payload);
  await seedFaq(payload);

  payload.logger.info("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
