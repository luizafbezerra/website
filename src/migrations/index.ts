import * as migration_20260607_160428_add_settings_identity_fields from "./20260607_160428_add_settings_identity_fields";
import * as migration_20260607_171928_add_testimonials_and_home from "./20260607_171928_add_testimonials_and_home";
import * as migration_20260609_165038_add_symbols_section from "./20260609_165038_add_symbols_section";
import * as migration_20260609_205309_mandala_global from "./20260609_205309_mandala_global";
import * as migration_20260618_030435_restructure_home_globals from "./20260618_030435_restructure_home_globals";
import * as migration_20260805_013127_concept_v3_cms from "./20260805_013127_concept_v3_cms";
import * as migration_20260805_020046_concept_v3_credential_line from "./20260805_020046_concept_v3_credential_line";
import * as migration_20260805_031704_concept_v3_inicio_credencial_drop from "./20260805_031704_concept_v3_inicio_credencial_drop";
import * as migration_20260805_041259_concept_v3_primeira_conversa from "./20260805_041259_concept_v3_primeira_conversa";
import * as migration_20260805_055245_concept_v3_phase6_pages from "./20260805_055245_concept_v3_phase6_pages";
import * as migration_20260805_153311_instagram_auth_and_jobs from "./20260805_153311_instagram_auth_and_jobs";
import * as migration_20260805_153332_inicio_instagram_tiles_drop from "./20260805_153332_inicio_instagram_tiles_drop";
import * as migration_20260805_213941_instagram_refresh_workflow from "./20260805_213941_instagram_refresh_workflow";
import * as migration_20260806_030430_concept_v3_condense_service_pages from "./20260806_030430_concept_v3_condense_service_pages";
import * as migration_20260806_222852_concept_v3_sobre_signature_drop from "./20260806_222852_concept_v3_sobre_signature_drop";

export const migrations = [
  {
    up: migration_20260607_160428_add_settings_identity_fields.up,
    down: migration_20260607_160428_add_settings_identity_fields.down,
    name: "20260607_160428_add_settings_identity_fields",
  },
  {
    up: migration_20260607_171928_add_testimonials_and_home.up,
    down: migration_20260607_171928_add_testimonials_and_home.down,
    name: "20260607_171928_add_testimonials_and_home",
  },
  {
    up: migration_20260609_165038_add_symbols_section.up,
    down: migration_20260609_165038_add_symbols_section.down,
    name: "20260609_165038_add_symbols_section",
  },
  {
    up: migration_20260609_205309_mandala_global.up,
    down: migration_20260609_205309_mandala_global.down,
    name: "20260609_205309_mandala_global",
  },
  {
    up: migration_20260618_030435_restructure_home_globals.up,
    down: migration_20260618_030435_restructure_home_globals.down,
    name: "20260618_030435_restructure_home_globals",
  },
  {
    up: migration_20260805_013127_concept_v3_cms.up,
    down: migration_20260805_013127_concept_v3_cms.down,
    name: "20260805_013127_concept_v3_cms",
  },
  {
    up: migration_20260805_020046_concept_v3_credential_line.up,
    down: migration_20260805_020046_concept_v3_credential_line.down,
    name: "20260805_020046_concept_v3_credential_line",
  },
  {
    up: migration_20260805_031704_concept_v3_inicio_credencial_drop.up,
    down: migration_20260805_031704_concept_v3_inicio_credencial_drop.down,
    name: "20260805_031704_concept_v3_inicio_credencial_drop",
  },
  {
    up: migration_20260805_041259_concept_v3_primeira_conversa.up,
    down: migration_20260805_041259_concept_v3_primeira_conversa.down,
    name: "20260805_041259_concept_v3_primeira_conversa",
  },
  {
    up: migration_20260805_055245_concept_v3_phase6_pages.up,
    down: migration_20260805_055245_concept_v3_phase6_pages.down,
    name: "20260805_055245_concept_v3_phase6_pages",
  },
  {
    up: migration_20260805_153311_instagram_auth_and_jobs.up,
    down: migration_20260805_153311_instagram_auth_and_jobs.down,
    name: "20260805_153311_instagram_auth_and_jobs",
  },
  {
    up: migration_20260805_153332_inicio_instagram_tiles_drop.up,
    down: migration_20260805_153332_inicio_instagram_tiles_drop.down,
    name: "20260805_153332_inicio_instagram_tiles_drop",
  },
  {
    up: migration_20260805_213941_instagram_refresh_workflow.up,
    down: migration_20260805_213941_instagram_refresh_workflow.down,
    name: "20260805_213941_instagram_refresh_workflow",
  },
  {
    up: migration_20260806_030430_concept_v3_condense_service_pages.up,
    down: migration_20260806_030430_concept_v3_condense_service_pages.down,
    name: "20260806_030430_concept_v3_condense_service_pages",
  },
  {
    up: migration_20260806_222852_concept_v3_sobre_signature_drop.up,
    down: migration_20260806_222852_concept_v3_sobre_signature_drop.down,
    name: "20260806_222852_concept_v3_sobre_signature_drop",
  },
];
