import * as migration_20260607_160428_add_settings_identity_fields from "./20260607_160428_add_settings_identity_fields";

export const migrations = [
  {
    up: migration_20260607_160428_add_settings_identity_fields.up,
    down: migration_20260607_160428_add_settings_identity_fields.down,
    name: "20260607_160428_add_settings_identity_fields",
  },
];
