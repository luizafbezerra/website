import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { FAQ_DEFAULTS } from "@/domain/faq/FaqEntry";

/**
 * One-shot reconciler for the `faq` collection (plan TASK-049).
 *
 * `seedFaq` finds-or-creates by the Portuguese `question` and never deletes, so
 * every row it has ever written is still in the database — including the ten
 * drafted answers this repo removed in August and her six answers removed on
 * 2026-08-07. Twenty rows for a four-row `FAQ_DEFAULTS`, sixteen of them invisible
 * to the code and visible on the page.
 *
 * **Deliberately one-off, and deliberately not part of `seedFaq`.** The next thing
 * that happens to this collection is Luiza adding her own questions through
 * `/admin`. A seed that reconciled — that deleted whatever was not in
 * `FAQ_DEFAULTS` — would delete her work on its next run. So the destructive step
 * lives here, is run by hand, and announces exactly what it will remove.
 *
 * Matching is on the **pt** `question`, because that is the key `seedFaq` writes
 * and finds by. A row whose Portuguese question is not in `FAQ_DEFAULTS` is by
 * definition not something the current code would produce.
 *
 *   Dry run (default):
 *     pnpm exec tsx --require ./scripts/no-schema-push.cjs --env-file .env.local \
 *       scripts/faq-cleanup.mts
 *   Apply:
 *     … scripts/faq-cleanup.mts --apply
 */

/** High enough that the whole collection fits in one read. */
const PAGE_SIZE = 500;

type FaqRow = {
  id: number | string;
  question?: string | null;
  category?: string | null;
};

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

  const keep = new Set(FAQ_DEFAULTS.map((entry) => entry.question));

  const { docs } = await payload.find({
    collection: "faq",
    limit: PAGE_SIZE,
    pagination: false,
    overrideAccess: true,
    locale: "pt",
  });
  const rows = docs as FaqRow[];

  const surplus = rows.filter((row) => !keep.has(row.question ?? ""));
  const kept = rows.length - surplus.length;

  payload.logger.info(
    `faq: ${rows.length} rows in the database, ${FAQ_DEFAULTS.length} in FAQ_DEFAULTS — ` +
      `${kept} matched, ${surplus.length} surplus.`,
  );

  if (surplus.length === 0) {
    payload.logger.info("Nothing to remove; the database already matches FAQ_DEFAULTS.");
    return;
  }

  surplus.forEach((row, index) => {
    const number = String(index + 1).padStart(2, " ");
    payload.logger.info(`  ${number}. [${row.category ?? "sem seção"}] ${row.question ?? "(sem pergunta)"}`);
  });

  // A row present in the database but absent from FAQ_DEFAULTS is either a stale
  // seed leftover (what this script is for) or something Luiza wrote in /admin
  // (which must never be deleted by accident). The list above is printed before
  // any write precisely so that difference is a human judgement, not a heuristic.
  if (!apply) {
    payload.logger.info(
      `Dry run — nothing deleted. Re-run with --apply to remove these ${surplus.length} rows.`,
    );
    return;
  }

  for (const row of surplus) {
    await payload.delete({
      collection: "faq",
      id: row.id,
      overrideAccess: true,
      context: { skipRevalidate: true },
    });
  }

  payload.logger.info(`Deleted ${surplus.length} surplus faq rows; ${kept} remain.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
