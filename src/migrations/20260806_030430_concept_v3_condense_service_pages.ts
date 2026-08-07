import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_primeira_conversa_passo_a_passo_permissoes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_passo_a_passo_permissoes_items_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_logistica_doubts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "page_primeira_conversa_logistica_doubts_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "page_analise_o_metodo_tools" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_analise_o_metodo_tools_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_permissoes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_permissoes_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_mini_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_mini_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_analise_o_metodo_tools" CASCADE;
  DROP TABLE "page_analise_o_metodo_tools_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_permissoes_items" CASCADE;
  DROP TABLE "page_primeira_conversa_permissoes_items_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_mini_faq_items" CASCADE;
  DROP TABLE "page_primeira_conversa_mini_faq_items_locales" CASCADE;
  ALTER TABLE "page_analise" DROP CONSTRAINT "page_analise_a_visao_plate_image_id_media_id_fk";
  
  ALTER TABLE "page_primeira_conversa" DROP CONSTRAINT "page_primeira_conversa_permissoes_plate_image_id_media_id_fk";
  
  DROP INDEX "page_analise_a_visao_plate_a_visao_plate_image_idx";
  DROP INDEX "page_primeira_conversa_permissoes_plate_permissoes_plate_idx";
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "page_analise" ADD COLUMN "o_metodo_plate_image_id" integer;
  ALTER TABLE "page_analise" ADD COLUMN "o_metodo_plate_painter" varchar;
  ALTER TABLE "page_analise" ADD COLUMN "o_metodo_plate_year" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "o_metodo_tools_line" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "o_metodo_individuacao" jsonb;
  ALTER TABLE "page_analise_locales" ADD COLUMN "o_metodo_plate_work_title" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "pratico_comecar_body" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "pratico_comecar_link_label" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "nem_coaching_bridge_body" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "nem_coaching_bridge_link_label" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "pratico_comecar_body" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "pratico_comecar_link_label" varchar;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "passo_a_passo_permissoes_plate_image_id" integer;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "passo_a_passo_permissoes_plate_painter" varchar;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "passo_a_passo_permissoes_plate_year" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "passo_a_passo_permissoes_plate_work_title" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "logistica_link_label" varchar;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_permissoes_items" ADD CONSTRAINT "page_primeira_conversa_passo_a_passo_permissoes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_permissoes_items_locales" ADD CONSTRAINT "page_primeira_conversa_passo_a_passo_permissoes_items_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_passo_a_passo_permissoes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_logistica_doubts" ADD CONSTRAINT "page_primeira_conversa_logistica_doubts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_logistica_doubts_locales" ADD CONSTRAINT "page_primeira_conversa_logistica_doubts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_logistica_doubts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_primeira_conversa_passo_a_passo_permissoes_items_order_idx" ON "page_primeira_conversa_passo_a_passo_permissoes_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_passo_a_passo_permissoes_items_parent_id_idx" ON "page_primeira_conversa_passo_a_passo_permissoes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_passo_a_passo_permissoes_items_locale" ON "page_primeira_conversa_passo_a_passo_permissoes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_logistica_doubts_order_idx" ON "page_primeira_conversa_logistica_doubts" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_logistica_doubts_parent_id_idx" ON "page_primeira_conversa_logistica_doubts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_logistica_doubts_locales_locale_paren" ON "page_primeira_conversa_logistica_doubts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "page_analise" ADD CONSTRAINT "page_analise_o_metodo_plate_image_id_media_id_fk" FOREIGN KEY ("o_metodo_plate_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa" ADD CONSTRAINT "page_primeira_conversa_passo_a_passo_permissoes_plate_image_id_media_id_fk" FOREIGN KEY ("passo_a_passo_permissoes_plate_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_analise_o_metodo_plate_o_metodo_plate_image_idx" ON "page_analise" USING btree ("o_metodo_plate_image_id");
  CREATE INDEX "page_primeira_conversa_passo_a_passo_permissoes_plate_pa_idx" ON "page_primeira_conversa" USING btree ("passo_a_passo_permissoes_plate_image_id");
  ALTER TABLE "page_analise" DROP COLUMN "a_visao_plate_image_id";
  ALTER TABLE "page_analise" DROP COLUMN "a_visao_plate_painter";
  ALTER TABLE "page_analise" DROP COLUMN "a_visao_plate_year";
  ALTER TABLE "page_analise_locales" DROP COLUMN "a_visao_heading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "a_visao_body";
  ALTER TABLE "page_analise_locales" DROP COLUMN "a_visao_plate_work_title";
  ALTER TABLE "page_analise_locales" DROP COLUMN "o_que_trazem_intro";
  ALTER TABLE "page_analise_locales" DROP COLUMN "para_comecar_heading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "para_comecar_body";
  ALTER TABLE "page_analise_locales" DROP COLUMN "para_comecar_link_label";
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" DROP COLUMN "title";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "pergunta_mais_funda_heading";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "pergunta_mais_funda_body";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "pergunta_mais_funda_link_label";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "comecar_heading";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "comecar_body";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "comecar_link_label";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "permissoes_plate_image_id";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "permissoes_plate_painter";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "permissoes_plate_year";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "permissoes_heading";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "permissoes_plate_work_title";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "mini_faq_heading";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "mini_faq_link_label";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "page_primeira_conversa_passo_a_passo_permissoes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_passo_a_passo_permissoes_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_logistica_doubts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_primeira_conversa_logistica_doubts_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_primeira_conversa_passo_a_passo_permissoes_items" CASCADE;
  DROP TABLE "page_primeira_conversa_passo_a_passo_permissoes_items_locales" CASCADE;
  DROP TABLE "page_primeira_conversa_logistica_doubts" CASCADE;
  DROP TABLE "page_primeira_conversa_logistica_doubts_locales" CASCADE;
  ALTER TABLE "page_analise" DROP CONSTRAINT "page_analise_o_metodo_plate_image_id_media_id_fk";
  
  ALTER TABLE "page_primeira_conversa" DROP CONSTRAINT "page_primeira_conversa_passo_a_passo_permissoes_plate_image_id_media_id_fk";
  
  DROP INDEX "page_analise_o_metodo_plate_o_metodo_plate_image_idx";
  DROP INDEX "page_primeira_conversa_passo_a_passo_permissoes_plate_pa_idx";
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "page_analise" ADD COLUMN "a_visao_plate_image_id" integer;
  ALTER TABLE "page_analise" ADD COLUMN "a_visao_plate_painter" varchar;
  ALTER TABLE "page_analise" ADD COLUMN "a_visao_plate_year" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "a_visao_heading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "a_visao_body" jsonb;
  ALTER TABLE "page_analise_locales" ADD COLUMN "a_visao_plate_work_title" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "o_que_trazem_intro" jsonb;
  ALTER TABLE "page_analise_locales" ADD COLUMN "para_comecar_heading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "para_comecar_body" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "para_comecar_link_label" varchar;
  ALTER TABLE "page_orientacao_profissional_para_quem_cases_locales" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "pergunta_mais_funda_heading" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "pergunta_mais_funda_body" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "pergunta_mais_funda_link_label" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "comecar_heading" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "comecar_body" varchar;
  ALTER TABLE "page_orientacao_profissional_locales" ADD COLUMN "comecar_link_label" varchar;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_image_id" integer;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_painter" varchar;
  ALTER TABLE "page_primeira_conversa" ADD COLUMN "permissoes_plate_year" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "permissoes_heading" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "permissoes_plate_work_title" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "mini_faq_heading" varchar;
  ALTER TABLE "page_primeira_conversa_locales" ADD COLUMN "mini_faq_link_label" varchar;
  ALTER TABLE "page_analise_o_metodo_tools" ADD CONSTRAINT "page_analise_o_metodo_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_analise_o_metodo_tools_locales" ADD CONSTRAINT "page_analise_o_metodo_tools_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_analise_o_metodo_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_permissoes_items" ADD CONSTRAINT "page_primeira_conversa_permissoes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_permissoes_items_locales" ADD CONSTRAINT "page_primeira_conversa_permissoes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_permissoes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_mini_faq_items" ADD CONSTRAINT "page_primeira_conversa_mini_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa_mini_faq_items_locales" ADD CONSTRAINT "page_primeira_conversa_mini_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_primeira_conversa_mini_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_analise_o_metodo_tools_order_idx" ON "page_analise_o_metodo_tools" USING btree ("_order");
  CREATE INDEX "page_analise_o_metodo_tools_parent_id_idx" ON "page_analise_o_metodo_tools" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_analise_o_metodo_tools_locales_locale_parent_id_unique" ON "page_analise_o_metodo_tools_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_permissoes_items_order_idx" ON "page_primeira_conversa_permissoes_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_permissoes_items_parent_id_idx" ON "page_primeira_conversa_permissoes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_permissoes_items_locales_locale_paren" ON "page_primeira_conversa_permissoes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_primeira_conversa_mini_faq_items_order_idx" ON "page_primeira_conversa_mini_faq_items" USING btree ("_order");
  CREATE INDEX "page_primeira_conversa_mini_faq_items_parent_id_idx" ON "page_primeira_conversa_mini_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_primeira_conversa_mini_faq_items_locales_locale_parent_" ON "page_primeira_conversa_mini_faq_items_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "page_analise" ADD CONSTRAINT "page_analise_a_visao_plate_image_id_media_id_fk" FOREIGN KEY ("a_visao_plate_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_primeira_conversa" ADD CONSTRAINT "page_primeira_conversa_permissoes_plate_image_id_media_id_fk" FOREIGN KEY ("permissoes_plate_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "page_analise_a_visao_plate_a_visao_plate_image_idx" ON "page_analise" USING btree ("a_visao_plate_image_id");
  CREATE INDEX "page_primeira_conversa_permissoes_plate_permissoes_plate_idx" ON "page_primeira_conversa" USING btree ("permissoes_plate_image_id");
  ALTER TABLE "page_analise" DROP COLUMN "o_metodo_plate_image_id";
  ALTER TABLE "page_analise" DROP COLUMN "o_metodo_plate_painter";
  ALTER TABLE "page_analise" DROP COLUMN "o_metodo_plate_year";
  ALTER TABLE "page_analise_locales" DROP COLUMN "o_metodo_tools_line";
  ALTER TABLE "page_analise_locales" DROP COLUMN "o_metodo_individuacao";
  ALTER TABLE "page_analise_locales" DROP COLUMN "o_metodo_plate_work_title";
  ALTER TABLE "page_analise_locales" DROP COLUMN "pratico_comecar_body";
  ALTER TABLE "page_analise_locales" DROP COLUMN "pratico_comecar_link_label";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "nem_coaching_bridge_body";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "nem_coaching_bridge_link_label";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "pratico_comecar_body";
  ALTER TABLE "page_orientacao_profissional_locales" DROP COLUMN "pratico_comecar_link_label";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "passo_a_passo_permissoes_plate_image_id";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "passo_a_passo_permissoes_plate_painter";
  ALTER TABLE "page_primeira_conversa" DROP COLUMN "passo_a_passo_permissoes_plate_year";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "passo_a_passo_permissoes_plate_work_title";
  ALTER TABLE "page_primeira_conversa_locales" DROP COLUMN "logistica_link_label";`);
}
