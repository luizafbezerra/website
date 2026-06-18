import config from "@payload-config";
import { getPayload } from "payload";
import { seedFaq } from "./faq";
import { seedHome } from "./home";
import { seedMandala } from "./mandala";
import { seedSettings } from "./settings";

/**
 * Seed Payload globals and collections from `core/*.defaults` — the same
 * hardcoded values the site renders when Payload is disabled, so the DB and the
 * code fallback share a single source of truth.
 *
 * Idempotent by design: globals upsert via `updateGlobal`; collections
 * find-or-create by a natural key. Seeders are added per implementation phase.
 *
 * Run with `pnpm seed` (forces NODE_ENV=production via shim.cjs so the adapter
 * never auto-pushes schema — apply migrations first).
 */
async function main() {
  const payload = await getPayload({ config });
  payload.logger.info("Seeding from core/*.defaults …");

  await seedSettings(payload);
  await seedHome(payload);
  await seedMandala(payload);
  await seedFaq(payload);

  payload.logger.info("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
