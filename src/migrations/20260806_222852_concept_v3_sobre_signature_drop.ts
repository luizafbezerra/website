import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_sobre" DROP CONSTRAINT "page_sobre_assinatura_image_id_media_id_fk";
  
  DROP INDEX "page_sobre_assinatura_assinatura_image_idx";
  ALTER TABLE "page_sobre" DROP COLUMN "assinatura_image_id";
  ALTER TABLE "page_sobre_locales" DROP COLUMN "assinatura_closing_line";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_sobre" ADD COLUMN "assinatura_image_id" integer;
  ALTER TABLE "page_sobre_locales" ADD COLUMN "assinatura_closing_line" varchar;
  ALTER TABLE "page_sobre" ADD CONSTRAINT "page_sobre_assinatura_image_id_media_id_fk" FOREIGN KEY ("assinatura_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_sobre_assinatura_assinatura_image_idx" ON "page_sobre" USING btree ("assinatura_image_id");`);
}
