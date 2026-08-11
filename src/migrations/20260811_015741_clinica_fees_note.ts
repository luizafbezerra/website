import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clinica_locales" ADD COLUMN "fees_note" varchar;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clinica_locales" DROP COLUMN "fees_note";`);
}
