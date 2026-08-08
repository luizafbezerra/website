import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";
import { blurDataUrlFrom } from "@/payload/media/blurDataUrl";

/**
 * Adds the low-quality placeholder every uploaded image now carries, and
 * backfills the ones already in Blob.
 *
 * The backfill belongs here rather than in a script someone has to remember: the
 * seven files predate the field, and every environment that runs this migration
 * needs them filled or its images go back to appearing out of an empty box.
 *
 * Reading through `payload.find` rather than the `url` column on purpose — the
 * column still holds the old `/api/media/file/…` proxy path, and the storage
 * adapter's afterRead hook is what turns it into the public Blob URL these
 * fetches need.
 *
 * Nothing here is allowed to fail the migration. A placeholder is a nicety, and
 * a build that dies because a CDN blipped would be a far worse trade than a
 * handful of images rendering exactly as they did yesterday.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "blur_data_u_r_l" varchar;`);

  try {
    const { docs } = await payload.find({ collection: "media", limit: 1000, depth: 0, req });

    for (const doc of docs) {
      try {
        if (!doc.url) continue;

        const response = await fetch(doc.url);
        if (!response.ok) {
          payload.logger.warn(
            `[media] ${doc.filename}: blob returned ${response.status}, skipping`,
          );
          continue;
        }

        const blurDataURL = await blurDataUrlFrom(Buffer.from(await response.arrayBuffer()));
        if (!blurDataURL) continue;

        await db.execute(
          sql`UPDATE "media" SET "blur_data_u_r_l" = ${blurDataURL} WHERE "id" = ${doc.id};`,
        );
      } catch (error) {
        payload.logger.warn(`[media] ${doc.filename}: could not backfill placeholder: ${error}`);
      }
    }
  } catch (error) {
    payload.logger.warn(`[media] placeholder backfill skipped entirely: ${error}`);
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "blur_data_u_r_l";`);
}
