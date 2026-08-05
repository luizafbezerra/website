import * as migration_20260607_160428_add_settings_identity_fields from "./20260607_160428_add_settings_identity_fields";
import * as migration_20260607_171928_add_testimonials_and_home from "./20260607_171928_add_testimonials_and_home";
import * as migration_20260609_165038_add_symbols_section from "./20260609_165038_add_symbols_section";
import * as migration_20260609_205309_mandala_global from "./20260609_205309_mandala_global";
import * as migration_20260618_030435_restructure_home_globals from "./20260618_030435_restructure_home_globals";
import * as migration_20260805_013127_concept_v3_cms from "./20260805_013127_concept_v3_cms";
import * as migration_20260805_020046_concept_v3_credential_line from "./20260805_020046_concept_v3_credential_line";
import * as migration_20260805_031704_concept_v3_inicio_credencial_drop from "./20260805_031704_concept_v3_inicio_credencial_drop";
import * as migration_20260805_041259_concept_v3_primeira_conversa from "./20260805_041259_concept_v3_primeira_conversa";

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
];
