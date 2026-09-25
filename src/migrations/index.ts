import * as migration_20260923_181000_initial from './20260923_181000_initial';
import * as migration_20260925_124414_storage_fields from './20260925_124414_storage_fields';

export const migrations = [
  {
    up: migration_20260923_181000_initial.up,
    down: migration_20260923_181000_initial.down,
    name: '20260923_181000_initial',
  },
  {
    up: migration_20260925_124414_storage_fields.up,
    down: migration_20260925_124414_storage_fields.down,
    name: '20260925_124414_storage_fields'
  },
];
