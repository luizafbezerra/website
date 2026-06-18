import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"lead" jsonb,
  	"cta_primary_label" varchar,
  	"cta_secondary_label" varchar,
  	"portrait_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_pillars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" jsonb,
  	"bio" jsonb,
  	"formacao" varchar,
  	"idiomas" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_voices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_writing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" jsonb,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"body" jsonb,
  	"whatsapp_label" varchar,
  	"faq_link_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_pillars_items" DROP CONSTRAINT "home_pillars_items_parent_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_portrait_id_media_id_fk";
  
  DROP INDEX "home_hero_hero_portrait_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_id" integer;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "home_hero_portrait_idx" ON "home_hero" USING btree ("portrait_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillars_items" ADD CONSTRAINT "home_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_pillars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  ALTER TABLE "home" DROP COLUMN "hero_subtitle";
  ALTER TABLE "home" DROP COLUMN "hero_lead";
  ALTER TABLE "home" DROP COLUMN "hero_cta_primary_label";
  ALTER TABLE "home" DROP COLUMN "hero_cta_secondary_label";
  ALTER TABLE "home" DROP COLUMN "hero_portrait_id";
  ALTER TABLE "home" DROP COLUMN "pillars_eyebrow";
  ALTER TABLE "home" DROP COLUMN "pillars_heading_lead";
  ALTER TABLE "home" DROP COLUMN "pillars_heading_accent_word";
  ALTER TABLE "home" DROP COLUMN "pillars_heading_trail";
  ALTER TABLE "home" DROP COLUMN "pillars_heading_accent_style";
  ALTER TABLE "home" DROP COLUMN "pillars_heading_accent_italic";
  ALTER TABLE "home" DROP COLUMN "pillars_intro";
  ALTER TABLE "home" DROP COLUMN "pillars_note";
  ALTER TABLE "home" DROP COLUMN "about_eyebrow";
  ALTER TABLE "home" DROP COLUMN "about_heading_lead";
  ALTER TABLE "home" DROP COLUMN "about_heading_accent_word";
  ALTER TABLE "home" DROP COLUMN "about_heading_trail";
  ALTER TABLE "home" DROP COLUMN "about_heading_accent_style";
  ALTER TABLE "home" DROP COLUMN "about_heading_accent_italic";
  ALTER TABLE "home" DROP COLUMN "about_bio";
  ALTER TABLE "home" DROP COLUMN "about_formacao";
  ALTER TABLE "home" DROP COLUMN "about_idiomas";
  ALTER TABLE "home" DROP COLUMN "voices_eyebrow";
  ALTER TABLE "home" DROP COLUMN "voices_heading";
  ALTER TABLE "home" DROP COLUMN "writing_eyebrow";
  ALTER TABLE "home" DROP COLUMN "writing_heading_lead";
  ALTER TABLE "home" DROP COLUMN "writing_heading_accent_word";
  ALTER TABLE "home" DROP COLUMN "writing_heading_trail";
  ALTER TABLE "home" DROP COLUMN "writing_heading_accent_style";
  ALTER TABLE "home" DROP COLUMN "writing_heading_accent_italic";
  ALTER TABLE "home" DROP COLUMN "writing_intro";
  ALTER TABLE "home" DROP COLUMN "contact_eyebrow";
  ALTER TABLE "home" DROP COLUMN "contact_heading_lead";
  ALTER TABLE "home" DROP COLUMN "contact_heading_accent_word";
  ALTER TABLE "home" DROP COLUMN "contact_heading_trail";
  ALTER TABLE "home" DROP COLUMN "contact_heading_accent_style";
  ALTER TABLE "home" DROP COLUMN "contact_heading_accent_italic";
  ALTER TABLE "home" DROP COLUMN "contact_body";
  ALTER TABLE "home" DROP COLUMN "contact_whatsapp_label";
  ALTER TABLE "home" DROP COLUMN "contact_faq_link_label";
  DROP TYPE "public"."enum_home_pillars_heading_accent_style";
  DROP TYPE "public"."enum_home_about_heading_accent_style";
  DROP TYPE "public"."enum_home_writing_heading_accent_style";
  DROP TYPE "public"."enum_home_contact_heading_accent_style";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_pillars_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_about_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_writing_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_contact_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  ALTER TABLE "faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_voices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_writing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_contact" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "home_hero" CASCADE;
  DROP TABLE "home_pillars" CASCADE;
  DROP TABLE "home_about" CASCADE;
  DROP TABLE "home_voices" CASCADE;
  DROP TABLE "home_writing" CASCADE;
  DROP TABLE "home_contact" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_fk";
  
  ALTER TABLE "home_pillars_items" DROP CONSTRAINT "home_pillars_items_parent_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_faq_id_idx";
  ALTER TABLE "home" ADD COLUMN "hero_subtitle" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_lead" jsonb;
  ALTER TABLE "home" ADD COLUMN "hero_cta_primary_label" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_cta_secondary_label" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_portrait_id" integer;
  ALTER TABLE "home" ADD COLUMN "pillars_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "pillars_heading_lead" varchar;
  ALTER TABLE "home" ADD COLUMN "pillars_heading_accent_word" varchar;
  ALTER TABLE "home" ADD COLUMN "pillars_heading_trail" varchar;
  ALTER TABLE "home" ADD COLUMN "pillars_heading_accent_style" "enum_home_pillars_heading_accent_style" DEFAULT 'terracotta';
  ALTER TABLE "home" ADD COLUMN "pillars_heading_accent_italic" boolean DEFAULT true;
  ALTER TABLE "home" ADD COLUMN "pillars_intro" jsonb;
  ALTER TABLE "home" ADD COLUMN "pillars_note" varchar;
  ALTER TABLE "home" ADD COLUMN "about_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "about_heading_lead" varchar;
  ALTER TABLE "home" ADD COLUMN "about_heading_accent_word" varchar;
  ALTER TABLE "home" ADD COLUMN "about_heading_trail" varchar;
  ALTER TABLE "home" ADD COLUMN "about_heading_accent_style" "enum_home_about_heading_accent_style" DEFAULT 'cobalt';
  ALTER TABLE "home" ADD COLUMN "about_heading_accent_italic" boolean DEFAULT true;
  ALTER TABLE "home" ADD COLUMN "about_bio" jsonb;
  ALTER TABLE "home" ADD COLUMN "about_formacao" varchar;
  ALTER TABLE "home" ADD COLUMN "about_idiomas" varchar;
  ALTER TABLE "home" ADD COLUMN "voices_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "voices_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "writing_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "writing_heading_lead" varchar;
  ALTER TABLE "home" ADD COLUMN "writing_heading_accent_word" varchar;
  ALTER TABLE "home" ADD COLUMN "writing_heading_trail" varchar;
  ALTER TABLE "home" ADD COLUMN "writing_heading_accent_style" "enum_home_writing_heading_accent_style" DEFAULT 'terracotta';
  ALTER TABLE "home" ADD COLUMN "writing_heading_accent_italic" boolean DEFAULT true;
  ALTER TABLE "home" ADD COLUMN "writing_intro" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_eyebrow" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_heading_lead" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_heading_accent_word" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_heading_trail" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_heading_accent_style" "enum_home_contact_heading_accent_style" DEFAULT 'terracotta';
  ALTER TABLE "home" ADD COLUMN "contact_heading_accent_italic" boolean DEFAULT true;
  ALTER TABLE "home" ADD COLUMN "contact_body" jsonb;
  ALTER TABLE "home" ADD COLUMN "contact_whatsapp_label" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_faq_link_label" varchar;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_pillars_items" ADD CONSTRAINT "home_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_hero_hero_portrait_idx" ON "home" USING btree ("hero_portrait_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_id";`);
}
