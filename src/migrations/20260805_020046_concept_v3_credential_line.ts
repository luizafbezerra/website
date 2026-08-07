import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "clinica_identity_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "clinica_identity_credentials_locales" (
  	"item" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "clinica_identity_credentials" ADD CONSTRAINT "clinica_identity_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinica"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clinica_identity_credentials_locales" ADD CONSTRAINT "clinica_identity_credentials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinica_identity_credentials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clinica_identity_credentials_order_idx" ON "clinica_identity_credentials" USING btree ("_order");
  CREATE INDEX "clinica_identity_credentials_parent_id_idx" ON "clinica_identity_credentials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "clinica_identity_credentials_locales_locale_parent_id_unique" ON "clinica_identity_credentials_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "clinica_identity_credentials" CASCADE;
  DROP TABLE "clinica_identity_credentials_locales" CASCADE;`);
}
