import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('pt', 'en');
  CREATE TYPE "public"."enum_testimonials_service" AS ENUM('analise', 'orientacao');
  CREATE TYPE "public"."enum__testimonials_v_version_service" AS ENUM('analise', 'orientacao');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('pt', 'en');
  CREATE TYPE "public"."enum_faq_category" AS ENUM('analise', 'orientacao', 'pratico', 'internacional');
  CREATE TYPE "public"."enum_clinica_availability_state" AS ENUM('open', 'waitlist', 'closed');
  CREATE TABLE "testimonials_locales" (
  	"body" varchar,
  	"context" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_body" varchar,
  	"version_context" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
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
  
  CREATE TABLE "page_inicio_como_comecar_beats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar
  );
  
  CREATE TABLE "page_inicio_como_comecar_beats_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_inicio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_portrait_id" integer,
  	"cosmos_lamina_plate_id" integer,
  	"cosmos_lamina_painter" varchar,
  	"cosmos_lamina_year" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_inicio_locales" (
  	"hero_lead" jsonb,
  	"hero_cta_primary_label" varchar,
  	"hero_cta_secondary_label" varchar,
  	"instagram_heading" varchar,
  	"instagram_intro" varchar,
  	"dois_caminhos_heading" varchar,
  	"dois_caminhos_intro" varchar,
  	"dois_caminhos_analysis_title" varchar,
  	"dois_caminhos_analysis_body" varchar,
  	"dois_caminhos_analysis_link_label" varchar,
  	"dois_caminhos_career_guidance_title" varchar,
  	"dois_caminhos_career_guidance_body" varchar,
  	"dois_caminhos_career_guidance_link_label" varchar,
  	"dois_caminhos_boundary" varchar,
  	"o_sintoma_heading" varchar,
  	"o_sintoma_body" jsonb,
  	"o_sintoma_link_label" varchar,
  	"cosmos_caption" varchar,
  	"cosmos_lamina_work_title" varchar,
  	"cosmos_lamina_closing_line" varchar,
  	"sobre_digest_heading" varchar,
  	"sobre_digest_body" jsonb,
  	"sobre_digest_link_label" varchar,
  	"brasil_exterior_heading" varchar,
  	"brasil_exterior_body" varchar,
  	"brasil_exterior_link_label" varchar,
  	"como_comecar_heading" varchar,
  	"como_comecar_link_label" varchar,
  	"vozes_heading" varchar,
  	"contato_eyebrow" varchar,
  	"contato_heading" varchar,
  	"contato_body" jsonb,
  	"contato_whatsapp_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_analise_o_metodo_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_analise_o_metodo_tools_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_analise_o_que_trazem_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar
  );
  
  CREATE TABLE "page_analise_o_que_trazem_pillars_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_analise_sonho_ampliado_parallels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "page_analise_sonho_ampliado_parallels_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_analise_pratico_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_analise_pratico_items_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_analise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_analise_locales" (
  	"abertura_heading" varchar,
  	"abertura_body" jsonb,
  	"a_visao_heading" varchar,
  	"a_visao_body" jsonb,
  	"o_metodo_heading" varchar,
  	"o_metodo_body" jsonb,
  	"mandala_heading" varchar,
  	"mandala_intro" varchar,
  	"mandala_aries_reading" varchar,
  	"mandala_aries_vedic_reading" varchar,
  	"mandala_leo_reading" varchar,
  	"mandala_leo_vedic_reading" varchar,
  	"mandala_sagittarius_reading" varchar,
  	"mandala_sagittarius_vedic_reading" varchar,
  	"mandala_taurus_reading" varchar,
  	"mandala_taurus_vedic_reading" varchar,
  	"mandala_virgo_reading" varchar,
  	"mandala_virgo_vedic_reading" varchar,
  	"mandala_capricorn_reading" varchar,
  	"mandala_capricorn_vedic_reading" varchar,
  	"mandala_gemini_reading" varchar,
  	"mandala_gemini_vedic_reading" varchar,
  	"mandala_libra_reading" varchar,
  	"mandala_libra_vedic_reading" varchar,
  	"mandala_aquarius_reading" varchar,
  	"mandala_aquarius_vedic_reading" varchar,
  	"mandala_cancer_reading" varchar,
  	"mandala_cancer_vedic_reading" varchar,
  	"mandala_scorpio_reading" varchar,
  	"mandala_scorpio_vedic_reading" varchar,
  	"mandala_pisces_reading" varchar,
  	"mandala_pisces_vedic_reading" varchar,
  	"o_que_trazem_eyebrow" varchar,
  	"o_que_trazem_heading" varchar,
  	"o_que_trazem_intro" jsonb,
  	"o_que_trazem_note" varchar,
  	"o_que_trazem_boundary" varchar,
  	"sonho_ampliado_heading" varchar,
  	"sonho_ampliado_motif" varchar,
  	"sonho_ampliado_closing_line" varchar,
  	"pratico_heading" varchar,
  	"para_comecar_heading" varchar,
  	"para_comecar_body" varchar,
  	"para_comecar_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_para_quem_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_para_quem_cases_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_o_percurso_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar
  );
  
  CREATE TABLE "page_orientacao_profissional_o_percurso_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_nem_coaching_distinctions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_nem_coaching_distinctions_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_pratico_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional_pratico_items_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_orientacao_profissional" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nem_coaching_plate_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_orientacao_profissional_locales" (
  	"abertura_heading" varchar,
  	"abertura_body" jsonb,
  	"para_quem_heading" varchar,
  	"o_percurso_heading" varchar,
  	"o_percurso_body" jsonb,
  	"o_percurso_deliverable" varchar,
  	"nem_coaching_heading" varchar,
  	"nem_coaching_body" jsonb,
  	"pergunta_mais_funda_heading" varchar,
  	"pergunta_mais_funda_body" varchar,
  	"pergunta_mais_funda_link_label" varchar,
  	"pratico_heading" varchar,
  	"comecar_heading" varchar,
  	"comecar_body" varchar,
  	"comecar_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_sobre_credencial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_sobre_credencial_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_sobre_formacao_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"institution" varchar,
  	"period" varchar
  );
  
  CREATE TABLE "page_sobre_formacao_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_sobre" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quem_e_portrait_id" integer,
  	"assinatura_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_sobre_locales" (
  	"quem_e_heading" varchar,
  	"quem_e_body" jsonb,
  	"formacao_heading" varchar,
  	"a_clinica_heading" varchar,
  	"a_clinica_body" jsonb,
  	"assinatura_closing_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_passo_a_passo_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar
  );
  
  CREATE TABLE "page_primeira_conversa_passo_a_passo_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_permissoes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_permissoes_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_logistica_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_logistica_items_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_mini_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_mini_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_primeira_conversa_locales" (
  	"passo_a_passo_heading" varchar,
  	"permissoes_heading" varchar,
  	"logistica_heading" varchar,
  	"mini_faq_heading" varchar,
  	"mini_faq_link_label" varchar,
  	"bilhete_heading" varchar,
  	"bilhete_intro" jsonb,
  	"bilhete_choose_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_perguntas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_perguntas_locales" (
  	"abertura_eyebrow" varchar,
  	"abertura_heading" varchar,
  	"abertura_intro" varchar,
  	"sections_analise_heading" varchar,
  	"sections_analise_intro" varchar,
  	"sections_orientacao_heading" varchar,
  	"sections_orientacao_intro" varchar,
  	"sections_pratico_heading" varchar,
  	"sections_pratico_intro" varchar,
  	"sections_internacional_heading" varchar,
  	"sections_internacional_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_internacional_brasileiros_fora_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL
  );
  
  CREATE TABLE "page_internacional_brasileiros_fora_cities_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_internacional_pratico_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_internacional_pratico_items_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_internacional" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"in_english_heading" varchar,
  	"in_english_body" varchar,
  	"in_english_link_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_internacional_locales" (
  	"abertura_heading" varchar,
  	"abertura_body" jsonb,
  	"abertura_trust_line" varchar,
  	"brasileiros_fora_heading" varchar,
  	"brasileiros_fora_body" jsonb,
  	"pratico_heading" varchar,
  	"comecar_heading" varchar,
  	"comecar_body" varchar,
  	"comecar_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_privacidade_guarda_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_privacidade_guarda_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_privacidade_nunca_faz_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_privacidade_nunca_faz_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_privacidade" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_privacidade_locales" (
  	"abertura_eyebrow" varchar,
  	"abertura_heading" varchar,
  	"abertura_body" jsonb,
  	"guarda_heading" varchar,
  	"nunca_faz_heading" varchar,
  	"bilhete_nota_heading" varchar,
  	"bilhete_nota_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clinica_jung_passages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "clinica_jung_passages_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "clinica" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identity_clinic_name" varchar NOT NULL,
  	"identity_full_name" varchar NOT NULL,
  	"identity_short_name" varchar,
  	"identity_credential" varchar,
  	"contact_whatsapp_e164" varchar,
  	"contact_whatsapp_display" varchar,
  	"contact_email" varchar,
  	"contact_instagram_url" varchar,
  	"contact_instagram_handle" varchar,
  	"availability_state" "enum_clinica_availability_state" DEFAULT 'open' NOT NULL,
  	"fees_analysis" varchar,
  	"fees_career_guidance" varchar,
  	"notes_english" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "clinica_locales" (
  	"identity_role" varchar,
  	"identity_positioning" varchar,
  	"availability_response_window" varchar,
  	"fees_international_note" varchar,
  	"notes_analysis" varchar,
  	"notes_career_guidance" varchar,
  	"notes_unsure" varchar,
  	"privacy_line" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_nav_extra_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_voices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_writing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mandala" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "posts_tags" CASCADE;
  DROP TABLE IF EXISTS "posts" CASCADE;
  DROP TABLE IF EXISTS "_posts_v_version_tags" CASCADE;
  DROP TABLE IF EXISTS "_posts_v" CASCADE;
  DROP TABLE IF EXISTS "settings_social" CASCADE;
  DROP TABLE IF EXISTS "settings" CASCADE;
  DROP TABLE IF EXISTS "home_sections" CASCADE;
  DROP TABLE IF EXISTS "home_nav_extra_links" CASCADE;
  DROP TABLE IF EXISTS "home" CASCADE;
  DROP TABLE IF EXISTS "home_hero" CASCADE;
  DROP TABLE IF EXISTS "home_pillars_items" CASCADE;
  DROP TABLE IF EXISTS "home_pillars" CASCADE;
  DROP TABLE IF EXISTS "home_about" CASCADE;
  DROP TABLE IF EXISTS "home_voices" CASCADE;
  DROP TABLE IF EXISTS "home_writing" CASCADE;
  DROP TABLE IF EXISTS "home_contact" CASCADE;
  DROP TABLE IF EXISTS "mandala" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "testimonials" ADD COLUMN "service" "enum_testimonials_service";
  ALTER TABLE "testimonials" ADD COLUMN "abroad" boolean DEFAULT false;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_service" "enum__testimonials_v_version_service";
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_abroad" boolean DEFAULT false;
  ALTER TABLE "_testimonials_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_testimonials_v" ADD COLUMN "published_locale" "enum__testimonials_v_published_locale";
  -- Hand-added (the only edit to this generated file). Existing FAQ rows just
  -- lost their question and answer columns to the locales table above, so they
  -- are empty shells; and a NOT NULL category with no default would fail
  -- outright on any database that still holds them. Their text is preserved in
  -- docs/content-export-2026-08.md and re-created by the seed (RISK-003).
  DELETE FROM "faq";
  ALTER TABLE "faq" ADD COLUMN "category" "enum_faq_category" NOT NULL;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_locales" ADD CONSTRAINT "faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_credencial_items" ADD CONSTRAINT "page_inicio_credencial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_credencial_items_locales" ADD CONSTRAINT "page_inicio_credencial_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_credencial_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_crop_id_media_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_full_id_media_id_fk" FOREIGN KEY ("full_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles" ADD CONSTRAINT "page_inicio_instagram_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_instagram_tiles_locales" ADD CONSTRAINT "page_inicio_instagram_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_instagram_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_cosmos_lamina_captions" ADD CONSTRAINT "page_inicio_cosmos_lamina_captions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_cosmos_lamina_captions_locales" ADD CONSTRAINT "page_inicio_cosmos_lamina_captions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_cosmos_lamina_captions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_como_comecar_beats" ADD CONSTRAINT "page_inicio_como_comecar_beats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio_como_comecar_beats_locales" ADD CONSTRAINT "page_inicio_como_comecar_beats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio_como_comecar_beats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_inicio" ADD CONSTRAINT "page_inicio_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio" ADD CONSTRAINT "page_inicio_cosmos_lamina_plate_id_media_id_fk" FOREIGN KEY ("cosmos_lamina_plate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_inicio_locales" ADD CONSTRAINT "page_inicio_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_o_metodo_tools" ADD CONSTRAINT "page_analise_o_metodo_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_o_metodo_tools_locales" ADD CONSTRAINT "page_analise_o_metodo_tools_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise_o_metodo_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_o_que_trazem_pillars" ADD CONSTRAINT "page_analise_o_que_trazem_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_o_que_trazem_pillars_locales" ADD CONSTRAINT "page_analise_o_que_trazem_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise_o_que_trazem_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_sonho_ampliado_parallels" ADD CONSTRAINT "page_analise_sonho_ampliado_parallels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_analise_sonho_ampliado_parallels" ADD CONSTRAINT "page_analise_sonho_ampliado_parallels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_sonho_ampliado_parallels_locales" ADD CONSTRAINT "page_analise_sonho_ampliado_parallels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise_sonho_ampliado_parallels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_pratico_items" ADD CONSTRAINT "page_analise_pratico_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_pratico_items_locales" ADD CONSTRAINT "page_analise_pratico_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise_pratico_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_locales" ADD CONSTRAINT "page_analise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_para_quem_cases" ADD CONSTRAINT "page_orientacao_profissional_para_quem_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" ADD CONSTRAINT "page_orientacao_profissional_para_quem_cases_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional_para_quem_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_o_percurso_steps" ADD CONSTRAINT "page_orientacao_profissional_o_percurso_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_o_percurso_steps_locales" ADD CONSTRAINT "page_orientacao_profissional_o_percurso_steps_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional_o_percurso_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_nem_coaching_distinctions" ADD CONSTRAINT "page_orientacao_profissional_nem_coaching_distinctions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_nem_coaching_distinctions_locales" ADD CONSTRAINT "page_orientacao_profissional_nem_coaching_distinctions_lo_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional_nem_coaching_distinctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_pratico_items" ADD CONSTRAINT "page_orientacao_profissional_pratico_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_pratico_items_locales" ADD CONSTRAINT "page_orientacao_profissional_pratico_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional_pratico_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional" ADD CONSTRAINT "page_orientacao_profissional_nem_coaching_plate_id_media_id_fk" FOREIGN KEY ("nem_coaching_plate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_orientacao_profissional_locales" ADD CONSTRAINT "page_orientacao_profissional_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_orientacao_profissional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_sobre_credencial_items" ADD CONSTRAINT "page_sobre_credencial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_sobre_credencial_items_locales" ADD CONSTRAINT "page_sobre_credencial_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_sobre_credencial_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_sobre_formacao_items" ADD CONSTRAINT "page_sobre_formacao_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_sobre_formacao_items_locales" ADD CONSTRAINT "page_sobre_formacao_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_sobre_formacao_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_sobre" ADD CONSTRAINT "page_sobre_quem_e_portrait_id_media_id_fk" FOREIGN KEY ("quem_e_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_sobre" ADD CONSTRAINT "page_sobre_assinatura_image_id_media_id_fk" FOREIGN KEY ("assinatura_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_sobre_locales" ADD CONSTRAINT "page_sobre_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_sobre"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_steps" ADD CONSTRAINT "page_primeira_conversa_passo_a_passo_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_steps_locales" ADD CONSTRAINT "page_primeira_conversa_passo_a_passo_steps_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_passo_a_passo_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_permissoes_items" ADD CONSTRAINT "page_primeira_conversa_permissoes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_permissoes_items_locales" ADD CONSTRAINT "page_primeira_conversa_permissoes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_permissoes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_logistica_items" ADD CONSTRAINT "page_primeira_conversa_logistica_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_logistica_items_locales" ADD CONSTRAINT "page_primeira_conversa_logistica_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_logistica_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_mini_faq_items" ADD CONSTRAINT "page_primeira_conversa_mini_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_mini_faq_items_locales" ADD CONSTRAINT "page_primeira_conversa_mini_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_mini_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_locales" ADD CONSTRAINT "page_primeira_conversa_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_perguntas_locales" ADD CONSTRAINT "page_perguntas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_perguntas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_brasileiros_fora_cities" ADD CONSTRAINT "page_internacional_brasileiros_fora_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_brasileiros_fora_cities_locales" ADD CONSTRAINT "page_internacional_brasileiros_fora_cities_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional_brasileiros_fora_cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_pratico_items" ADD CONSTRAINT "page_internacional_pratico_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_pratico_items_locales" ADD CONSTRAINT "page_internacional_pratico_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional_pratico_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_internacional_locales" ADD CONSTRAINT "page_internacional_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_internacional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_privacidade_guarda_items" ADD CONSTRAINT "page_privacidade_guarda_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_privacidade"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_privacidade_guarda_items_locales" ADD CONSTRAINT "page_privacidade_guarda_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_privacidade_guarda_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_privacidade_nunca_faz_items" ADD CONSTRAINT "page_privacidade_nunca_faz_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_privacidade"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_privacidade_nunca_faz_items_locales" ADD CONSTRAINT "page_privacidade_nunca_faz_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_privacidade_nunca_faz_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_privacidade_locales" ADD CONSTRAINT "page_privacidade_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_privacidade"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clinica_jung_passages" ADD CONSTRAINT "clinica_jung_passages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinica"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clinica_jung_passages_locales" ADD CONSTRAINT "clinica_jung_passages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinica_jung_passages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clinica_locales" ADD CONSTRAINT "clinica_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinica"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faq_locales_locale_parent_id_unique" ON "faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_inicio_credencial_items_order_idx" ON "page_inicio_credencial_items" USING btree ("_order");
  CREATE INDEX "page_inicio_credencial_items_parent_id_idx" ON "page_inicio_credencial_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_inicio_credencial_items_locales_locale_parent_id_unique" ON "page_inicio_credencial_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_inicio_instagram_tiles_order_idx" ON "page_inicio_instagram_tiles" USING btree ("_order");
  CREATE INDEX "page_inicio_instagram_tiles_parent_id_idx" ON "page_inicio_instagram_tiles" USING btree ("_parent_id");
  CREATE INDEX "page_inicio_instagram_tiles_crop_idx" ON "page_inicio_instagram_tiles" USING btree ("crop_id");
  CREATE INDEX "page_inicio_instagram_tiles_full_idx" ON "page_inicio_instagram_tiles" USING btree ("full_id");
  CREATE UNIQUE INDEX "page_inicio_instagram_tiles_locales_locale_parent_id_unique" ON "page_inicio_instagram_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_inicio_cosmos_lamina_captions_order_idx" ON "page_inicio_cosmos_lamina_captions" USING btree ("_order");
  CREATE INDEX "page_inicio_cosmos_lamina_captions_parent_id_idx" ON "page_inicio_cosmos_lamina_captions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_inicio_cosmos_lamina_captions_locales_locale_parent_id_" ON "page_inicio_cosmos_lamina_captions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_inicio_como_comecar_beats_order_idx" ON "page_inicio_como_comecar_beats" USING btree ("_order");
  CREATE INDEX "page_inicio_como_comecar_beats_parent_id_idx" ON "page_inicio_como_comecar_beats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_inicio_como_comecar_beats_locales_locale_parent_id_uniq" ON "page_inicio_como_comecar_beats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_inicio_hero_hero_portrait_idx" ON "page_inicio" USING btree ("hero_portrait_id");
  CREATE INDEX "page_inicio_cosmos_lamina_cosmos_lamina_plate_idx" ON "page_inicio" USING btree ("cosmos_lamina_plate_id");
  CREATE UNIQUE INDEX "page_inicio_locales_locale_parent_id_unique" ON "page_inicio_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_analise_o_metodo_tools_order_idx" ON "page_analise_o_metodo_tools" USING btree ("_order");
  CREATE INDEX "page_analise_o_metodo_tools_parent_id_idx" ON "page_analise_o_metodo_tools" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_analise_o_metodo_tools_locales_locale_parent_id_unique" ON "page_analise_o_metodo_tools_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_analise_o_que_trazem_pillars_order_idx" ON "page_analise_o_que_trazem_pillars" USING btree ("_order");
  CREATE INDEX "page_analise_o_que_trazem_pillars_parent_id_idx" ON "page_analise_o_que_trazem_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_analise_o_que_trazem_pillars_locales_locale_parent_id_u" ON "page_analise_o_que_trazem_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_analise_sonho_ampliado_parallels_order_idx" ON "page_analise_sonho_ampliado_parallels" USING btree ("_order");
  CREATE INDEX "page_analise_sonho_ampliado_parallels_parent_id_idx" ON "page_analise_sonho_ampliado_parallels" USING btree ("_parent_id");
  CREATE INDEX "page_analise_sonho_ampliado_parallels_image_idx" ON "page_analise_sonho_ampliado_parallels" USING btree ("image_id");
  CREATE UNIQUE INDEX "page_analise_sonho_ampliado_parallels_locales_locale_parent_" ON "page_analise_sonho_ampliado_parallels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_analise_pratico_items_order_idx" ON "page_analise_pratico_items" USING btree ("_order");
  CREATE INDEX "page_analise_pratico_items_parent_id_idx" ON "page_analise_pratico_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_analise_pratico_items_locales_locale_parent_id_unique" ON "page_analise_pratico_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_analise_locales_locale_parent_id_unique" ON "page_analise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_orientacao_profissional_para_quem_cases_order_idx" ON "page_orientacao_profissional_para_quem_cases" USING btree ("_order");
  CREATE INDEX "page_orientacao_profissional_para_quem_cases_parent_id_idx" ON "page_orientacao_profissional_para_quem_cases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_orientacao_profissional_para_quem_cases_locales_locale_" ON "page_orientacao_profissional_para_quem_cases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_orientacao_profissional_o_percurso_steps_order_idx" ON "page_orientacao_profissional_o_percurso_steps" USING btree ("_order");
  CREATE INDEX "page_orientacao_profissional_o_percurso_steps_parent_id_idx" ON "page_orientacao_profissional_o_percurso_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_orientacao_profissional_o_percurso_steps_locales_locale" ON "page_orientacao_profissional_o_percurso_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_orientacao_profissional_nem_coaching_distinctions_order_idx" ON "page_orientacao_profissional_nem_coaching_distinctions" USING btree ("_order");
  CREATE INDEX "page_orientacao_profissional_nem_coaching_distinctions_parent_id_idx" ON "page_orientacao_profissional_nem_coaching_distinctions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_orientacao_profissional_nem_coaching_distinctions_local" ON "page_orientacao_profissional_nem_coaching_distinctions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_orientacao_profissional_pratico_items_order_idx" ON "page_orientacao_profissional_pratico_items" USING btree ("_order");
  CREATE INDEX "page_orientacao_profissional_pratico_items_parent_id_idx" ON "page_orientacao_profissional_pratico_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_orientacao_profissional_pratico_items_locales_locale_pa" ON "page_orientacao_profissional_pratico_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_orientacao_profissional_nem_coaching_nem_coaching_p_idx" ON "page_orientacao_profissional" USING btree ("nem_coaching_plate_id");
  CREATE UNIQUE INDEX "page_orientacao_profissional_locales_locale_parent_id_unique" ON "page_orientacao_profissional_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_sobre_credencial_items_order_idx" ON "page_sobre_credencial_items" USING btree ("_order");
  CREATE INDEX "page_sobre_credencial_items_parent_id_idx" ON "page_sobre_credencial_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_sobre_credencial_items_locales_locale_parent_id_unique" ON "page_sobre_credencial_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_sobre_formacao_items_order_idx" ON "page_sobre_formacao_items" USING btree ("_order");
  CREATE INDEX "page_sobre_formacao_items_parent_id_idx" ON "page_sobre_formacao_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_sobre_formacao_items_locales_locale_parent_id_unique" ON "page_sobre_formacao_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_sobre_quem_e_quem_e_portrait_idx" ON "page_sobre" USING btree ("quem_e_portrait_id");
  CREATE INDEX "page_sobre_assinatura_assinatura_image_idx" ON "page_sobre" USING btree ("assinatura_image_id");
  CREATE UNIQUE INDEX "page_sobre_locales_locale_parent_id_unique" ON "page_sobre_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_passo_a_passo_steps_order_idx" ON "page_primeira_conversa_passo_a_passo_steps" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_passo_a_passo_steps_parent_id_idx" ON "page_primeira_conversa_passo_a_passo_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_passo_a_passo_steps_locales_locale_pa" ON "page_primeira_conversa_passo_a_passo_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_permissoes_items_order_idx" ON "page_primeira_conversa_permissoes_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_permissoes_items_parent_id_idx" ON "page_primeira_conversa_permissoes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_permissoes_items_locales_locale_paren" ON "page_primeira_conversa_permissoes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_logistica_items_order_idx" ON "page_primeira_conversa_logistica_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_logistica_items_parent_id_idx" ON "page_primeira_conversa_logistica_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_logistica_items_locales_locale_parent" ON "page_primeira_conversa_logistica_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_mini_faq_items_order_idx" ON "page_primeira_conversa_mini_faq_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_mini_faq_items_parent_id_idx" ON "page_primeira_conversa_mini_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_mini_faq_items_locales_locale_parent_" ON "page_primeira_conversa_mini_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_locales_locale_parent_id_unique" ON "page_primeira_conversa_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_perguntas_locales_locale_parent_id_unique" ON "page_perguntas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_internacional_brasileiros_fora_cities_order_idx" ON "page_internacional_brasileiros_fora_cities" USING btree ("_order");
  CREATE INDEX "page_internacional_brasileiros_fora_cities_parent_id_idx" ON "page_internacional_brasileiros_fora_cities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_internacional_brasileiros_fora_cities_locales_locale_pa" ON "page_internacional_brasileiros_fora_cities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_internacional_pratico_items_order_idx" ON "page_internacional_pratico_items" USING btree ("_order");
  CREATE INDEX "page_internacional_pratico_items_parent_id_idx" ON "page_internacional_pratico_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_internacional_pratico_items_locales_locale_parent_id_un" ON "page_internacional_pratico_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_internacional_locales_locale_parent_id_unique" ON "page_internacional_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_privacidade_guarda_items_order_idx" ON "page_privacidade_guarda_items" USING btree ("_order");
  CREATE INDEX "page_privacidade_guarda_items_parent_id_idx" ON "page_privacidade_guarda_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_privacidade_guarda_items_locales_locale_parent_id_uniqu" ON "page_privacidade_guarda_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_privacidade_nunca_faz_items_order_idx" ON "page_privacidade_nunca_faz_items" USING btree ("_order");
  CREATE INDEX "page_privacidade_nunca_faz_items_parent_id_idx" ON "page_privacidade_nunca_faz_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_privacidade_nunca_faz_items_locales_locale_parent_id_un" ON "page_privacidade_nunca_faz_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_privacidade_locales_locale_parent_id_unique" ON "page_privacidade_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clinica_jung_passages_order_idx" ON "clinica_jung_passages" USING btree ("_order");
  CREATE INDEX "clinica_jung_passages_parent_id_idx" ON "clinica_jung_passages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "clinica_jung_passages_locales_locale_parent_id_unique" ON "clinica_jung_passages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "clinica_locales_locale_parent_id_unique" ON "clinica_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  ALTER TABLE "media" DROP COLUMN IF EXISTS "alt";
  ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "body";
  ALTER TABLE "_testimonials_v" DROP COLUMN IF EXISTS "version_body";
  ALTER TABLE "faq" DROP COLUMN IF EXISTS "question";
  ALTER TABLE "faq" DROP COLUMN IF EXISTS "answer";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";
  DROP TYPE IF EXISTS "public"."enum_posts_status";
  DROP TYPE IF EXISTS "public"."enum__posts_v_version_status";
  DROP TYPE IF EXISTS "public"."enum_home_sections_type";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_sections_type" AS ENUM('pillars', 'about', 'cosmos', 'symbols', 'voices', 'writing', 'contact');
  CREATE TABLE "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identity_full_name" varchar,
  	"identity_short_name" varchar,
  	"identity_role" varchar,
  	"identity_tradition" varchar,
  	"identity_credential" varchar,
  	"nap_city" varchar,
  	"nap_region" varchar,
  	"nap_country" varchar,
  	"nap_country_code" varchar,
  	"contact_phone_e164" varchar,
  	"contact_phone_display" varchar,
  	"contact_email" varchar,
  	"contact_instagram_url" varchar,
  	"contact_instagram_handle" varchar,
  	"availability_hours" varchar,
  	"availability_response_note" varchar,
  	"site_name" varchar NOT NULL,
  	"tagline" varchar,
  	"chrome_header_byline" varchar,
  	"chrome_footer_byline" varchar,
  	"description" varchar,
  	"og_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_home_sections_type" NOT NULL,
  	"enabled" boolean DEFAULT true
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
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
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
  
  CREATE TABLE "home_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar,
  	"title" varchar,
  	"paragraph" varchar
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
  
  CREATE TABLE "mandala" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"aries_paragraph" varchar DEFAULT 'Áries marca o impulso que rompe a inércia — a coragem de começar antes de ter certeza. Na escuta analítica, costuma aparecer quando algo na vida pede um ato, não mais uma reflexão.',
  	"aries_vedic_paragraph" varchar DEFAULT 'A faixa de Áries acolhe o impulso ardente das Ashwini Kumaras, a passagem grave de Bharani e a primeira centelha de Krittika — três modos de inaugurar, antes que Touro assente o que foi começado.',
  	"leo_paragraph" varchar DEFAULT 'Leão é o coração que pede para ser visto, e a coragem de se oferecer sem desculpas. Na análise, marca o ponto em que a vida íntima procura forma própria, voz própria, gesto próprio.',
  	"leo_vedic_paragraph" varchar DEFAULT 'Leão recebe a herança de Magha, o gozo de Purva Phalguni e o primeiro pacto de Uttara Phalguni — três tempos pelos quais o coração toma forma própria, antes que Virgem apare o que sobra.',
  	"sagittarius_paragraph" varchar DEFAULT 'Sagitário caminha em direção ao horizonte — o que dá sentido à travessia, o que faz a vida valer o gesto de levantar-se. Aparece quando a alma reclama um norte, mesmo que provisório.',
  	"sagittarius_vedic_paragraph" varchar DEFAULT 'Sagitário desentranha a raiz de Mula, conquista a passagem de Purva Ashadha e ergue o primeiro passo de Uttara Ashadha — três tempos da busca por sentido, antes que Capricórnio funde o que se descobriu.',
  	"taurus_paragraph" varchar DEFAULT 'Touro encarna a fidelidade ao corpo, ao tempo e àquilo que se faz com as mãos. Aparece quando é preciso lembrar que o sentido também mora no peso das coisas — na permanência, no gozo, na lentidão.',
  	"taurus_vedic_paragraph" varchar DEFAULT 'Em Touro a chama de Krittika ganha terra, Rohini desabrocha em forma e Mrigashira começa a procurar — três gestos pelos quais o impulso ariano se aquieta em corpo, antes que Gêmeos o transforme em pergunta.',
  	"virgo_paragraph" varchar DEFAULT 'Virgem é o cuidado exercido no detalhe — a paciência de aparar, ordenar, distinguir o que serve do que apenas pesa. Aparece quando o trabalho interno pede artesania, não impulso.',
  	"virgo_vedic_paragraph" varchar DEFAULT 'Virgem continua a aliança de Uttara Phalguni, ganha a mão de Hasta e começa a polir a joia de Chitra — três modos de cuidar do que existe, antes que Libra o leve ao encontro.',
  	"capricorn_paragraph" varchar DEFAULT 'Capricórnio constrói no tempo — o ofício, a estrutura, o que se sustenta quando o entusiasmo se cala. Aparece quando é preciso fundar, e não apenas imaginar.',
  	"capricorn_vedic_paragraph" varchar DEFAULT 'Capricórnio funda a vitória de Uttara Ashadha, escuta em Shravana e marca o passo em Dhanishta — três modos de erguer no tempo, antes que Aquário olhe tudo de longe.',
  	"gemini_paragraph" varchar DEFAULT 'Gêmeos é a inteligência que recolhe e devolve, a primeira a notar duas verdades onde se via apenas uma. Convida a sustentar a contradição em vez de resolvê-la depressa.',
  	"gemini_vedic_paragraph" varchar DEFAULT 'Gêmeos prolonga a busca de Mrigashira, atravessa a tempestade de Ardra e começa a refazer-se em Punarvasu — três tempos da inteligência que pergunta, perde e retorna, antes que Câncer recolha a resposta.',
  	"libra_paragraph" varchar DEFAULT 'Libra busca o ponto em que duas presenças cabem na mesma sala sem que nenhuma se anule. Sua escuta é a do encontro — o desejo de relação que não exige fusão.',
  	"libra_vedic_paragraph" varchar DEFAULT 'Libra desdobra o brilho de Chitra, abre o espaço de Swati e ergue o arco de Vishakha — três gestos pelos quais a relação se constitui, antes que Escorpião desça ao que ali pulsa.',
  	"aquarius_paragraph" varchar DEFAULT 'Aquário olha o coletivo a certa distância, e dessa distância nasce a originalidade. Aparece quando algo singular dentro de si precisa de ar para não ser domesticado.',
  	"aquarius_vedic_paragraph" varchar DEFAULT 'Aquário leva o tambor de Dhanishta ao coletivo, reúne os curadores de Shatabhisha e ergue a flama de Purva Bhadrapada — três modos de servir a um todo, antes que Peixes dissolva as bordas.',
  	"cancer_paragraph" varchar DEFAULT 'Câncer guarda a memória dos vínculos primeiros — o que nos foi dito, o que nos foi calado, a casa que carregamos por dentro. Surge quando há algo a recolher antes de seguir.',
  	"cancer_vedic_paragraph" varchar DEFAULT 'Em Câncer Punarvasu chega à casa, Pushya nutre o que ali habita e Ashlesha desce ao que mora abaixo — três modos de recolher, antes que Leão queira ser visto.',
  	"scorpio_paragraph" varchar DEFAULT 'Escorpião desce ao que costuma ficar fora da conversa — o desejo, a perda, o que arde sob a superfície. Aparece quando alguma verdade pede passagem e não admite mais rodeios.',
  	"scorpio_vedic_paragraph" varchar DEFAULT 'Escorpião herda o arco de Vishakha, sustenta a devoção de Anuradha e atravessa a noite de Jyeshtha — três tempos pelos quais a intimidade chega ao fundo, antes que Sagitário procure um horizonte.',
  	"pisces_paragraph" varchar DEFAULT 'Peixes dissolve as bordas para que algo maior atravesse — o sonho, a compaixão, o que não se diz em prosa. Aparece quando a vida psíquica pede entrega, não controle.',
  	"pisces_vedic_paragraph" varchar DEFAULT 'Peixes recolhe a chama de Purva Bhadrapada, mergulha com Uttara Bhadrapada e atravessa a margem com Revati — três tempos pelos quais o ciclo se entrega, antes que Áries recomece.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_testimonials_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_credencial_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_credencial_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_instagram_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_instagram_tiles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_cosmos_lamina_captions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_cosmos_lamina_captions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_como_comecar_beats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_como_comecar_beats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_inicio_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_o_metodo_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_o_metodo_tools_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_o_que_trazem_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_o_que_trazem_pillars_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_sonho_ampliado_parallels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_sonho_ampliado_parallels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_pratico_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_pratico_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_para_quem_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_o_percurso_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_o_percurso_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_nem_coaching_distinctions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_nem_coaching_distinctions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_pratico_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_pratico_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_orientacao_profissional_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre_credencial_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre_credencial_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre_formacao_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre_formacao_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_sobre_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_permissoes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_permissoes_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_logistica_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_logistica_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_mini_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_mini_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_perguntas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_perguntas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional_brasileiros_fora_cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional_brasileiros_fora_cities_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional_pratico_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional_pratico_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_internacional_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade_guarda_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade_guarda_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade_nunca_faz_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade_nunca_faz_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_privacidade_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinica_jung_passages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinica_jung_passages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinica" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinica_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "faq_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "page_inicio_credencial_items" CASCADE;
  DROP TABLE "page_inicio_credencial_items_locales" CASCADE;
  DROP TABLE "page_inicio_instagram_tiles" CASCADE;
  DROP TABLE "page_inicio_instagram_tiles_locales" CASCADE;
  DROP TABLE "page_inicio_cosmos_lamina_captions" CASCADE;
  DROP TABLE "page_inicio_cosmos_lamina_captions_locales" CASCADE;
  DROP TABLE "page_inicio_como_comecar_beats" CASCADE;
  DROP TABLE "page_inicio_como_comecar_beats_locales" CASCADE;
  DROP TABLE "page_inicio" CASCADE;
  DROP TABLE "page_inicio_locales" CASCADE;
  DROP TABLE "page_analise_o_metodo_tools" CASCADE;
  DROP TABLE "page_analise_o_metodo_tools_locales" CASCADE;
  DROP TABLE "page_analise_o_que_trazem_pillars" CASCADE;
  DROP TABLE "page_analise_o_que_trazem_pillars_locales" CASCADE;
  DROP TABLE "page_analise_sonho_ampliado_parallels" CASCADE;
  DROP TABLE "page_analise_sonho_ampliado_parallels_locales" CASCADE;
  DROP TABLE "page_analise_pratico_items" CASCADE;
  DROP TABLE "page_analise_pratico_items_locales" CASCADE;
  DROP TABLE "page_analise" CASCADE;
  DROP TABLE "page_analise_locales" CASCADE;
  DROP TABLE "page_orientacao_profissional_para_quem_cases" CASCADE;
  DROP TABLE "page_orientacao_profissional_para_quem_cases_locales" CASCADE;
  DROP TABLE "page_orientacao_profissional_o_percurso_steps" CASCADE;
  DROP TABLE "page_orientacao_profissional_o_percurso_steps_locales" CASCADE;
  DROP TABLE "page_orientacao_profissional_nem_coaching_distinctions" CASCADE;
  DROP TABLE "page_orientacao_profissional_nem_coaching_distinctions_locales" CASCADE;
  DROP TABLE "page_orientacao_profissional_pratico_items" CASCADE;
  DROP TABLE "page_orientacao_profissional_pratico_items_locales" CASCADE;
  DROP TABLE "page_orientacao_profissional" CASCADE;
  DROP TABLE "page_orientacao_profissional_locales" CASCADE;
  DROP TABLE "page_sobre_credencial_items" CASCADE;
  DROP TABLE "page_sobre_credencial_items_locales" CASCADE;
  DROP TABLE "page_sobre_formacao_items" CASCADE;
  DROP TABLE "page_sobre_formacao_items_locales" CASCADE;
  DROP TABLE "page_sobre" CASCADE;
  DROP TABLE "page_sobre_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_passo_a_passo_steps" CASCADE;
  DROP TABLE "page_primeira_conversa_passo_a_passo_steps_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_permissoes_items" CASCADE;
  DROP TABLE "page_primeira_conversa_permissoes_items_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_logistica_items" CASCADE;
  DROP TABLE "page_primeira_conversa_logistica_items_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_mini_faq_items" CASCADE;
  DROP TABLE "page_primeira_conversa_mini_faq_items_locales" CASCADE;
  DROP TABLE "page_primeira_conversa" CASCADE;
  DROP TABLE "page_primeira_conversa_locales" CASCADE;
  DROP TABLE "page_perguntas" CASCADE;
  DROP TABLE "page_perguntas_locales" CASCADE;
  DROP TABLE "page_internacional_brasileiros_fora_cities" CASCADE;
  DROP TABLE "page_internacional_brasileiros_fora_cities_locales" CASCADE;
  DROP TABLE "page_internacional_pratico_items" CASCADE;
  DROP TABLE "page_internacional_pratico_items_locales" CASCADE;
  DROP TABLE "page_internacional" CASCADE;
  DROP TABLE "page_internacional_locales" CASCADE;
  DROP TABLE "page_privacidade_guarda_items" CASCADE;
  DROP TABLE "page_privacidade_guarda_items_locales" CASCADE;
  DROP TABLE "page_privacidade_nunca_faz_items" CASCADE;
  DROP TABLE "page_privacidade_nunca_faz_items_locales" CASCADE;
  DROP TABLE "page_privacidade" CASCADE;
  DROP TABLE "page_privacidade_locales" CASCADE;
  DROP TABLE "clinica_jung_passages" CASCADE;
  DROP TABLE "clinica_jung_passages_locales" CASCADE;
  DROP TABLE "clinica" CASCADE;
  DROP TABLE "clinica_locales" CASCADE;
  DROP INDEX "_testimonials_v_snapshot_idx";
  DROP INDEX "_testimonials_v_published_locale_idx";
  ALTER TABLE "testimonials" ADD COLUMN "body" varchar;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_body" varchar;
  ALTER TABLE "faq" ADD COLUMN "question" varchar NOT NULL;
  ALTER TABLE "faq" ADD COLUMN "answer" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_social" ADD CONSTRAINT "settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_sections" ADD CONSTRAINT "home_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_nav_extra_links" ADD CONSTRAINT "home_nav_extra_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero" ADD CONSTRAINT "home_hero_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_pillars_items" ADD CONSTRAINT "home_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_pillars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_image_idx" ON "_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "settings_social_order_idx" ON "settings_social" USING btree ("_order");
  CREATE INDEX "settings_social_parent_id_idx" ON "settings_social" USING btree ("_parent_id");
  CREATE INDEX "settings_og_image_idx" ON "settings" USING btree ("og_image_id");
  CREATE INDEX "settings_seo_seo_og_image_idx" ON "settings" USING btree ("seo_og_image_id");
  CREATE INDEX "home_sections_order_idx" ON "home_sections" USING btree ("_order");
  CREATE INDEX "home_sections_parent_id_idx" ON "home_sections" USING btree ("_parent_id");
  CREATE INDEX "home_nav_extra_links_order_idx" ON "home_nav_extra_links" USING btree ("_order");
  CREATE INDEX "home_nav_extra_links_parent_id_idx" ON "home_nav_extra_links" USING btree ("_parent_id");
  CREATE INDEX "home_hero_portrait_idx" ON "home_hero" USING btree ("portrait_id");
  CREATE INDEX "home_pillars_items_order_idx" ON "home_pillars_items" USING btree ("_order");
  CREATE INDEX "home_pillars_items_parent_id_idx" ON "home_pillars_items" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  ALTER TABLE "testimonials" DROP COLUMN "service";
  ALTER TABLE "testimonials" DROP COLUMN "abroad";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_service";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_abroad";
  ALTER TABLE "_testimonials_v" DROP COLUMN "snapshot";
  ALTER TABLE "_testimonials_v" DROP COLUMN "published_locale";
  ALTER TABLE "faq" DROP COLUMN "category";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_testimonials_service";
  DROP TYPE "public"."enum__testimonials_v_version_service";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_faq_category";
  DROP TYPE "public"."enum_clinica_availability_state";`);
}
