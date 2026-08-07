import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

/**
 * Drop the Início page's own credential strip.
 *
 * The strip appears on every core page (CONCEPT §8.8), so it is stored once in
 * A Clínica → Identidade → Credenciais; a per-page copy would drift the moment
 * one of the two was edited. The tables carried no data: the tab shipped in the
 * Phase 4 schema and was never seeded or edited.
 *
 * Hand-edited after generation: `IF EXISTS` on both drops, per the precedent in
 * `20260805_013127_concept_v3_cms`. Production has not run that migration yet,
 * so these tables may not exist when this one replays there, and a strict drop
 * would abort the whole deploy. The DOWN side stays strict — a genuine conflict
 * on the way back should still fail loudly.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "page_inicio_credencial_items" CASCADE;
  DROP TABLE IF EXISTS "page_inicio_credencial_items_locales" CASCADE;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_inicio_credencial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_inicio_credencial_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "page_inicio_credencial_items" ADD CONSTRAINT "page_inicio_credencial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_credencial_items_locales" ADD CONSTRAINT "page_inicio_credencial_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_credencial_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_inicio_credencial_items_order_idx" ON "page_inicio_credencial_items" USING btree ("_order");
  CREATE INDEX "page_inicio_credencial_items_parent_id_idx" ON "page_inicio_credencial_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_inicio_credencial_items_locales_locale_parent_id_unique" ON "page_inicio_credencial_items_locales" USING btree ("_locale","_parent_id");`);
}
