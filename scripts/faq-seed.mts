import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";
import { seedFaq } from "@/payload/seed/faq";

/**
 * Seed the `faq` collection **and nothing else**.
 *
 * `pnpm seed` also runs `seedClinica` and `seedPages`, which upsert globals — so
 * against production it would overwrite every field Luiza has edited in `/admin`
 * with the code default. That entrypoint now refuses to do it without
 * `--apply --overwrite-stored`, and this script is the reason the narrow path
 * exists: when only the questions have changed, nine globals is the wrong blast
 * radius for the write.
 *
 * It reports before it writes, because `seedFaq` finds-or-creates by the
 * Portuguese question and *updates* what it matches: a row she has reworded in
 * `/admin` is silently replaced by the code default. The dry run names every row
 * it would touch and says which of the two it would do, so overwriting her work is
 * a decision somebody makes rather than a side effect.
 *
 * It never deletes. A row in the database that is no longer in `FAQ_DEFAULTS` is
 * `scripts/faq-cleanup.mts`'s business, and that separation is deliberate: adding
 * questions and removing them are different risks and deserve different commands.
 *
 *   Dry run (default):
 *     pnpm faq:seed
 *   Apply:
 *     pnpm faq:seed --apply
 */

/** High enough that the whole collection fits in one read. */
const PAGE_SIZE = 500;

function parseApply(argv: readonly string[]): boolean {
  if (argv.includes("--apply")) return true;
  const unknown = argv.filter((arg) => arg.startsWith("--") && arg !== "--dry-run");
  if (unknown.length > 0) {
    throw new Error(`Unrecognized flag(s): ${unknown.join(", ")}. Use --apply or --dry-run.`);
  }
  return false;
}

async function main(): Promise<void> {
  const apply = parseApply(process.argv.slice(2));
  const payload: Payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "faq",
    limit: PAGE_SIZE,
    pagination: false,
    overrideAccess: true,
    locale: "pt",
  });
  const existing = new Set(docs.map((doc) => (doc as { question?: string | null }).question ?? ""));

  const creates = FAQ_DEFAULTS.filter((entry) => !existing.has(entry.question));
  const updates = FAQ_DEFAULTS.filter((entry) => existing.has(entry.question));

  payload.logger.info(
    `faq: ${docs.length} rows in the database, ${FAQ_DEFAULTS.length} in FAQ_DEFAULTS — ` +
      `${creates.length} to create, ${updates.length} to overwrite.`,
  );

  for (const entry of updates) {
    payload.logger.info(`  overwrite [${entry.category}] ${entry.question}`);
  }
  for (const entry of creates) {
    payload.logger.info(`  create    [${entry.category}] ${entry.question}`);
  }

  if (!apply) {
    payload.logger.info("Dry run — nothing written. Re-run with --apply.");
    return;
  }

  await seedFaq(payload);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
