import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_inicio_cosmos_lamina_captions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_cosmos_lamina_captions_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_inicio_cosmos_lamina_captions" CASCADE;
  DROP TABLE "page_inicio_cosmos_lamina_captions_locales" CASCADE;
  ALTER TABLE "page_inicio" DROP CONSTRAINT "page_inicio_cosmos_lamina_plate_id_media_id_fk";
  
  DROP INDEX "page_inicio_cosmos_lamina_cosmos_lamina_plate_idx";
  ALTER TABLE "page_inicio" DROP COLUMN "cosmos_lamina_plate_id";
  ALTER TABLE "page_inicio" DROP COLUMN "cosmos_lamina_painter";
  ALTER TABLE "page_inicio" DROP COLUMN "cosmos_lamina_year";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "cosmos_lamina_work_title";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "cosmos_lamina_closing_line";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_inicio_cosmos_lamina_captions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_inicio_cosmos_lamina_captions_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "page_inicio" ADD COLUMN "cosmos_lamina_plate_id" integer;
  ALTER TABLE "page_inicio" ADD COLUMN "cosmos_lamina_painter" varchar;
  ALTER TABLE "page_inicio" ADD COLUMN "cosmos_lamina_year" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "cosmos_lamina_work_title" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "cosmos_lamina_closing_line" varchar;
  ALTER TABLE "page_inicio_cosmos_lamina_captions" ADD CONSTRAINT "page_inicio_cosmos_lamina_captions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_cosmos_lamina_captions_locales" ADD CONSTRAINT "page_inicio_cosmos_lamina_captions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_cosmos_lamina_captions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_inicio_cosmos_lamina_captions_order_idx" ON "page_inicio_cosmos_lamina_captions" USING btree ("_order");
  CREATE INDEX "page_inicio_cosmos_lamina_captions_parent_id_idx" ON "page_inicio_cosmos_lamina_captions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_inicio_cosmos_lamina_captions_locales_locale_parent_id_" ON "page_inicio_cosmos_lamina_captions_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "page_inicio" ADD CONSTRAINT "page_inicio_cosmos_lamina_plate_id_media_id_fk" FOREIGN KEY ("cosmos_lamina_plate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_inicio_cosmos_lamina_cosmos_lamina_plate_idx" ON "page_inicio" USING btree ("cosmos_lamina_plate_id");`);
}
