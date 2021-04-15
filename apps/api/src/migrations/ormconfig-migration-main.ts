import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "../ormconfig";

var ormConfig = { 
    ...config, 
    schema: '', // Use default (public) schema for migration table to avoid bootstrapping error where the app_fom schema doesn't exist yet to check the migration table.
    migrations: [
      // Docker-installed migration files
      '/app/apps/api/migrations/main/*.js',
      // Local post-build  migration files
      './migrations/main/*.js',
      // Source migration files used in development
      './apps/api/src/migrations/main/*{.ts,.js}',
    ],
    migrationsTableName: 'migration_main', 
    cli: {
        'migrationsDir': './apps/api/src/migrations/main'
      }      
} as TypeOrmModuleOptions;

module.exports = ormConfig;

