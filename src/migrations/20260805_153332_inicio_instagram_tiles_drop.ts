import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_inicio_instagram_tiles" CASCADE;
  DROP TABLE "page_inicio_instagram_tiles_locales" CASCADE;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_inicio_instagram_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"crop_id" integer,
  	"full_id" integer,
  	"painter" varchar,
  	"year" varchar,
  	"post_url" varchar
  );
  
  CREATE TABLE "page_inicio_instagram_tiles_locales" (
  	"work_title" varchar,
  	"passage" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_crop_id_media_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_full_id_media_id_fk" FOREIGN KEY ("full_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles_locales" ADD CONSTRAINT "page_inicio_instagram_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_instagram_tiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_inicio_instagram_tiles_order_idx" ON "page_inicio_instagram_tiles" USING btree ("_order");
  CREATE INDEX "page_inicio_instagram_tiles_parent_id_idx" ON "page_inicio_instagram_tiles" USING btree ("_parent_id");
  CREATE INDEX "page_inicio_instagram_tiles_crop_idx" ON "page_inicio_instagram_tiles" USING btree ("crop_id");
  CREATE INDEX "page_inicio_instagram_tiles_full_idx" ON "page_inicio_instagram_tiles" USING btree ("full_id");
  CREATE UNIQUE INDEX "page_inicio_instagram_tiles_locales_locale_parent_id_unique" ON "page_inicio_instagram_tiles_locales" USING btree ("_locale","_parent_id");`);
}
