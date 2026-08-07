import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

/**
 * `/primeira-conversa` gains its opening and its plate (TASK-001 of
 * plan/feature-page-primeira-conversa-1.md): an `abertura` tab, because the page
 * had no field for its own `h1` or lead, and a `plate` group on `permissoes`.
 *
 * Audited per the Phase 4 precedent: zero `RENAME` statements — this run was
 * non-interactive, the snapshot now matching the real schema — and `up` is purely
 * additive, so nothing here can fail on production's stored rows. The `down`
 * drops carry `IF EXISTS` so a partially applied rollback still completes.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_image_id" integer;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_painter" varchar;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_year" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "abertura_heading" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "abertura_lead" jsonb;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "permissoes_plate_work_title" varchar;
  ALTER TABLE "page_primeira_conversa" ADD CONSTRAINT "page_primeira_conversa_permissoes_plate_image_id_media_id_fk" FOREIGN KEY ("permissoes_plate_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_primeira_conversa_permissoes_plate_permissoes_plate_idx" ON "page_primeira_conversa" USING btree ("permissoes_plate_image_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_primeira_conversa" DROP CONSTRAINT IF EXISTS "page_primeira_conversa_permissoes_plate_image_id_media_id_fk";

  DROP INDEX IF EXISTS "page_primeira_conversa_permissoes_plate_permissoes_plate_idx";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN IF EXISTS "permissoes_plate_image_id";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN IF EXISTS "permissoes_plate_painter";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN IF EXISTS "permissoes_plate_year";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN IF EXISTS "abertura_heading";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN IF EXISTS "abertura_lead";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN IF EXISTS "permissoes_plate_work_title";`);
}
