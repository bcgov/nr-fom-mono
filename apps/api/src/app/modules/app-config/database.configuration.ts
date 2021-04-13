import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // This changes the DB schema to match changes to entities, which we do not want even in development.
  database: process.env.DB_NAME || 'api-db',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  type: process.env.DB_TYPE || 'postgres',
  port: process.env.DB_PORT || '5432',
  schema: 'app_fom',
  ssl: false, 
}));
