import * as migration_20260923_181000_initial from './20260923_181000_initial';

export const migrations = [
  {
    up: migration_20260923_181000_initial.up,
    down: migration_20260923_181000_initial.down,
    name: '20260923_181000_initial'
  },
];
