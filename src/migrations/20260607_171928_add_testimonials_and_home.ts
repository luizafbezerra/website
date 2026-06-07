import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_sections_type" AS ENUM('pillars', 'about', 'cosmos', 'voices', 'writing', 'contact');
  CREATE TYPE "public"."enum_home_pillars_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_about_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_writing_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TYPE "public"."enum_home_contact_heading_accent_style" AS ENUM('terracotta', 'cobalt');
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" varchar,
  	"attribution" varchar,
  	"consent_given" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_body" varchar,
  	"version_attribution" varchar,
  	"version_consent_given" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "home_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_home_sections_type" NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "home_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar,
  	"title" varchar,
  	"paragraph" varchar
  );
  
  CREATE TABLE "home_nav_extra_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_subtitle" varchar,
  	"hero_lead" jsonb,
  	"hero_cta_primary_label" varchar,
  	"hero_cta_secondary_label" varchar,
  	"hero_portrait_id" integer,
  	"pillars_eyebrow" varchar,
  	"pillars_heading_lead" varchar,
  	"pillars_heading_accent_word" varchar,
  	"pillars_heading_trail" varchar,
  	"pillars_heading_accent_style" "enum_home_pillars_heading_accent_style" DEFAULT 'terracotta',
  	"pillars_heading_accent_italic" boolean DEFAULT true,
  	"pillars_intro" jsonb,
  	"pillars_note" varchar,
  	"about_eyebrow" varchar,
  	"about_heading_lead" varchar,
  	"about_heading_accent_word" varchar,
  	"about_heading_trail" varchar,
  	"about_heading_accent_style" "enum_home_about_heading_accent_style" DEFAULT 'cobalt',
  	"about_heading_accent_italic" boolean DEFAULT true,
  	"about_bio" jsonb,
  	"about_formacao" varchar,
  	"about_idiomas" varchar,
  	"voices_eyebrow" varchar,
  	"voices_heading" varchar,
  	"writing_eyebrow" varchar,
  	"writing_heading_lead" varchar,
  	"writing_heading_accent_word" varchar,
  	"writing_heading_trail" varchar,
  	"writing_heading_accent_style" "enum_home_writing_heading_accent_style" DEFAULT 'terracotta',
  	"writing_heading_accent_italic" boolean DEFAULT true,
  	"writing_intro" varchar,
  	"contact_eyebrow" varchar,
  	"contact_heading_lead" varchar,
  	"contact_heading_accent_word" varchar,
  	"contact_heading_trail" varchar,
  	"contact_heading_accent_style" "enum_home_contact_heading_accent_style" DEFAULT 'terracotta',
  	"contact_heading_accent_italic" boolean DEFAULT true,
  	"contact_body" jsonb,
  	"contact_whatsapp_label" varchar,
  	"contact_faq_link_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_sections" ADD CONSTRAINT "home_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillars_items" ADD CONSTRAINT "home_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_nav_extra_links" ADD CONSTRAINT "home_nav_extra_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "home_sections_order_idx" ON "home_sections" USING btree ("_order");
  CREATE INDEX "home_sections_parent_id_idx" ON "home_sections" USING btree ("_parent_id");
  CREATE INDEX "home_pillars_items_order_idx" ON "home_pillars_items" USING btree ("_order");
  CREATE INDEX "home_pillars_items_parent_id_idx" ON "home_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "home_nav_extra_links_order_idx" ON "home_nav_extra_links" USING btree ("_order");
  CREATE INDEX "home_nav_extra_links_parent_id_idx" ON "home_nav_extra_links" USING btree ("_parent_id");
  CREATE INDEX "home_hero_hero_portrait_idx" ON "home" USING btree ("hero_portrait_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_testimonials_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_nav_extra_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "home_sections" CASCADE;
  DROP TABLE "home_pillars_items" CASCADE;
  DROP TABLE "home_nav_extra_links" CASCADE;
  DROP TABLE "home" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_home_sections_type";
  DROP TYPE "public"."enum_home_pillars_heading_accent_style";
  DROP TYPE "public"."enum_home_about_heading_accent_style";
  DROP TYPE "public"."enum_home_writing_heading_accent_style";
  DROP TYPE "public"."enum_home_contact_heading_accent_style";`);
}
