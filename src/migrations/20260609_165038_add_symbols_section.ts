import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_home_sections_type" ADD VALUE 'symbols' BEFORE 'voices';`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_sections" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_home_sections_type";
  CREATE TYPE "public"."enum_home_sections_type" AS ENUM('pillars', 'about', 'cosmos', 'voices', 'writing', 'contact');
  ALTER TABLE "home_sections" ALTER COLUMN "type" SET DATA TYPE "public"."enum_home_sections_type" USING "type"::"public"."enum_home_sections_type";`);
}
