import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_sobre_locales" ADD COLUMN "formacao_intro" varchar;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_sobre_locales" DROP COLUMN "formacao_intro";`);
}
