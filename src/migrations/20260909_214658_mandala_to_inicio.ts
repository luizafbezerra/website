import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

/**
 * A mandala moves from `page-analise` to `page-inicio`: the painted wheel now
 * renders on Início, just above the Cosmos, and its tab moved with it.
 *
 * **The copy step between the ADDs and the DROPs is the point of this file.**
 * `migrate:create` generates the two halves and nothing between them, which
 * would drop whatever she has written in the admin — the heading and the intro
 * are stored values on production, so the generated migration alone would
 * silently reset them to the code defaults. Both globals keep one row per
 * locale, so `_locale` is the whole join.
 *
 * `down` copies back the same way before dropping, so the migration is
 * reversible without losing her text either.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_heading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_intro" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_aries_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_aries_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_leo_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_leo_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_sagittarius_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_sagittarius_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_taurus_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_taurus_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_virgo_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_virgo_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_capricorn_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_capricorn_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_gemini_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_gemini_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_libra_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_libra_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_aquarius_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_aquarius_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_cancer_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_cancer_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_scorpio_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_scorpio_vedic_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_pisces_reading" varchar;
  ALTER TABLE "page_inicio_locales" ADD COLUMN "mandala_pisces_vedic_reading" varchar;`);

  await db.execute(sql`
  UPDATE "page_inicio_locales" AS dest
     SET "mandala_heading" = src."mandala_heading",
      "mandala_intro" = src."mandala_intro",
      "mandala_aries_reading" = src."mandala_aries_reading",
      "mandala_aries_vedic_reading" = src."mandala_aries_vedic_reading",
      "mandala_leo_reading" = src."mandala_leo_reading",
      "mandala_leo_vedic_reading" = src."mandala_leo_vedic_reading",
      "mandala_sagittarius_reading" = src."mandala_sagittarius_reading",
      "mandala_sagittarius_vedic_reading" = src."mandala_sagittarius_vedic_reading",
      "mandala_taurus_reading" = src."mandala_taurus_reading",
      "mandala_taurus_vedic_reading" = src."mandala_taurus_vedic_reading",
      "mandala_virgo_reading" = src."mandala_virgo_reading",
      "mandala_virgo_vedic_reading" = src."mandala_virgo_vedic_reading",
      "mandala_capricorn_reading" = src."mandala_capricorn_reading",
      "mandala_capricorn_vedic_reading" = src."mandala_capricorn_vedic_reading",
      "mandala_gemini_reading" = src."mandala_gemini_reading",
      "mandala_gemini_vedic_reading" = src."mandala_gemini_vedic_reading",
      "mandala_libra_reading" = src."mandala_libra_reading",
      "mandala_libra_vedic_reading" = src."mandala_libra_vedic_reading",
      "mandala_aquarius_reading" = src."mandala_aquarius_reading",
      "mandala_aquarius_vedic_reading" = src."mandala_aquarius_vedic_reading",
      "mandala_cancer_reading" = src."mandala_cancer_reading",
      "mandala_cancer_vedic_reading" = src."mandala_cancer_vedic_reading",
      "mandala_scorpio_reading" = src."mandala_scorpio_reading",
      "mandala_scorpio_vedic_reading" = src."mandala_scorpio_vedic_reading",
      "mandala_pisces_reading" = src."mandala_pisces_reading",
      "mandala_pisces_vedic_reading" = src."mandala_pisces_vedic_reading"
    FROM "page_analise_locales" AS src
   WHERE src."_locale" = dest."_locale";
`);

  await db.execute(sql`
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_heading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_intro";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_aries_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_aries_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_leo_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_leo_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_sagittarius_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_sagittarius_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_taurus_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_taurus_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_virgo_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_virgo_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_capricorn_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_capricorn_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_gemini_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_gemini_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_libra_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_libra_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_aquarius_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_aquarius_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_cancer_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_cancer_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_scorpio_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_scorpio_vedic_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_pisces_reading";
  ALTER TABLE "page_analise_locales" DROP COLUMN "mandala_pisces_vedic_reading";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_heading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_intro" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_aries_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_aries_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_leo_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_leo_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_sagittarius_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_sagittarius_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_taurus_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_taurus_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_virgo_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_virgo_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_capricorn_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_capricorn_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_gemini_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_gemini_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_libra_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_libra_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_aquarius_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_aquarius_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_cancer_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_cancer_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_scorpio_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_scorpio_vedic_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_pisces_reading" varchar;
  ALTER TABLE "page_analise_locales" ADD COLUMN "mandala_pisces_vedic_reading" varchar;`);

  await db.execute(sql`
  UPDATE "page_analise_locales" AS dest
     SET "mandala_heading" = src."mandala_heading",
      "mandala_intro" = src."mandala_intro",
      "mandala_aries_reading" = src."mandala_aries_reading",
      "mandala_aries_vedic_reading" = src."mandala_aries_vedic_reading",
      "mandala_leo_reading" = src."mandala_leo_reading",
      "mandala_leo_vedic_reading" = src."mandala_leo_vedic_reading",
      "mandala_sagittarius_reading" = src."mandala_sagittarius_reading",
      "mandala_sagittarius_vedic_reading" = src."mandala_sagittarius_vedic_reading",
      "mandala_taurus_reading" = src."mandala_taurus_reading",
      "mandala_taurus_vedic_reading" = src."mandala_taurus_vedic_reading",
      "mandala_virgo_reading" = src."mandala_virgo_reading",
      "mandala_virgo_vedic_reading" = src."mandala_virgo_vedic_reading",
      "mandala_capricorn_reading" = src."mandala_capricorn_reading",
      "mandala_capricorn_vedic_reading" = src."mandala_capricorn_vedic_reading",
      "mandala_gemini_reading" = src."mandala_gemini_reading",
      "mandala_gemini_vedic_reading" = src."mandala_gemini_vedic_reading",
      "mandala_libra_reading" = src."mandala_libra_reading",
      "mandala_libra_vedic_reading" = src."mandala_libra_vedic_reading",
      "mandala_aquarius_reading" = src."mandala_aquarius_reading",
      "mandala_aquarius_vedic_reading" = src."mandala_aquarius_vedic_reading",
      "mandala_cancer_reading" = src."mandala_cancer_reading",
      "mandala_cancer_vedic_reading" = src."mandala_cancer_vedic_reading",
      "mandala_scorpio_reading" = src."mandala_scorpio_reading",
      "mandala_scorpio_vedic_reading" = src."mandala_scorpio_vedic_reading",
      "mandala_pisces_reading" = src."mandala_pisces_reading",
      "mandala_pisces_vedic_reading" = src."mandala_pisces_vedic_reading"
    FROM "page_inicio_locales" AS src
   WHERE src."_locale" = dest."_locale";
`);

  await db.execute(sql`
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_heading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_intro";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_aries_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_aries_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_leo_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_leo_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_sagittarius_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_sagittarius_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_taurus_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_taurus_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_virgo_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_virgo_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_capricorn_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_capricorn_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_gemini_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_gemini_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_libra_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_libra_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_aquarius_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_aquarius_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_cancer_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_cancer_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_scorpio_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_scorpio_vedic_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_pisces_reading";
  ALTER TABLE "page_inicio_locales" DROP COLUMN "mandala_pisces_vedic_reading";`);
}
