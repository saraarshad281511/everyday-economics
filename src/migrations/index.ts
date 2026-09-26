import * as migration_20260923_181000_initial from './20260923_181000_initial';
import * as migration_20260925_124414_storage_fields from './20260925_124414_storage_fields';
import * as migration_20260926_112220_interactive_features from './20260926_112220_interactive_features';

export const migrations = [
  {
    up: migration_20260923_181000_initial.up,
    down: migration_20260923_181000_initial.down,
    name: '20260923_181000_initial',
  },
  {
    up: migration_20260925_124414_storage_fields.up,
    down: migration_20260925_124414_storage_fields.down,
    name: '20260925_124414_storage_fields',
  },
  {
    up: migration_20260926_112220_interactive_features.up,
    down: migration_20260926_112220_interactive_features.down,
    name: '20260926_112220_interactive_features'
  },
];
