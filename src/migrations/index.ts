import * as migration_20260607_160428_add_settings_identity_fields from "./20260607_160428_add_settings_identity_fields";
import * as migration_20260607_171928_add_testimonials_and_home from "./20260607_171928_add_testimonials_and_home";

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
];
