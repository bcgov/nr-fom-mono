import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "../ormconfig";

var ormConfig = { 
    ...config, 
    schema: '', // Use default (public) schema for migration table to avoid bootstrapping error where the app_fom schema doesn't exist yet to check the migration table.
    migrations: [
      // Production migration files
      './migration/test/*.js',
      // Source migration files used in development    
      './apps/api/src/migration/test/*{.ts,.js}'
    ],
    migrationsTableName: 'migration_test', 
    cli: {
        'migrationsDir': './apps/api/src/migration/test'
      }      
} as TypeOrmModuleOptions;

module.exports = ormConfig;

