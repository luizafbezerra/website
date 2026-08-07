import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_jobs_workflow_slug" AS ENUM('refreshInstagramToken');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  ALTER TABLE "payload_jobs" ADD COLUMN "workflow_slug" "enum_payload_jobs_workflow_slug";
  ALTER TABLE "payload_jobs" ADD COLUMN "concurrency_key" varchar;
  CREATE INDEX "payload_jobs_workflow_slug_idx" ON "payload_jobs" USING btree ("workflow_slug");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'refreshInstagramToken';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'refreshInstagramToken';
  DROP INDEX "payload_jobs_workflow_slug_idx";
  DROP INDEX "payload_jobs_concurrency_key_idx";
  ALTER TABLE "payload_jobs" DROP COLUMN "workflow_slug";
  ALTER TABLE "payload_jobs" DROP COLUMN "concurrency_key";
  DROP TYPE "public"."enum_payload_jobs_workflow_slug";`);
}
