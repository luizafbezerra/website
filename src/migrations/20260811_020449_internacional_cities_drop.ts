import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_internacional_brasileiros_fora_cities" CASCADE;
  DROP TABLE "page_internacional_brasileiros_fora_cities_locales" CASCADE;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_internacional_brasileiros_fora_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_internacional_brasileiros_fora_cities_locales" (
  	"city" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "page_internacional_brasileiros_fora_cities" ADD CONSTRAINT "page_internacional_brasileiros_fora_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_brasileiros_fora_cities_locales" ADD CONSTRAINT "page_internacional_brasileiros_fora_cities_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional_brasileiros_fora_cities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_internacional_brasileiros_fora_cities_order_idx" ON "page_internacional_brasileiros_fora_cities" USING btree ("_order");
  CREATE INDEX "page_internacional_brasileiros_fora_cities_parent_id_idx" ON "page_internacional_brasileiros_fora_cities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_internacional_brasileiros_fora_cities_locales_locale_pa" ON "page_internacional_brasileiros_fora_cities_locales" USING btree ("_locale","_parent_id");`);
}
