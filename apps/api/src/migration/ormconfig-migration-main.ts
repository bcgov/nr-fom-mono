import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "../ormconfig";

var ormConfig = { 
    ...config, 
    schema: '', // Use default (public) schema for migration table to avoid bootstrapping error where the app_fom schema doesn't exist yet to check the migration table.
    migrations: ['./apps/api/src/migration/main/*{.ts,.js}'],
    migrationsTableName: 'migration_main', 
    cli: {
        'migrationsDir': './apps/api/src/migration/main'
      }      
} as TypeOrmModuleOptions;

module.exports = ormConfig;

