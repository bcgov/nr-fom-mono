import 'dotenv/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// Duplicated with database.configuration.ts
const config: TypeOrmModuleOptions = {
  type: 'postgres',
  database: process.env.DB_NAME || 'api-db',
  schema: 'app_fom',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  ssl: false, 

  autoLoadEntities: false,
  synchronize: false, // This changes the DB schema to match changes to entities, which we do NOT want even in development.
  logging: false,
  entities: [__dirname + '**/*.entity{.ts,.js}'],
};

module.exports = config;
