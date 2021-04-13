// import { config } from 'dotenv';
// config({ path: __dirname + '/../../.env.development' });
// config();

const ormConfig = {
  autoLoadEntities: true,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'api-db',
  username: 'postgres',
  password: '',
  ssl: false, //process.env.POSTGRES_DB_SSL,
  entities: [__dirname + '**/*.entity{.ts,.js}'],
  migrations: ['migration/*{.ts,.js}'],
  migrationsTableName: 'migration', // Will be located in public schema, couldn't figure out a way to get it into app_fom schema.
  cli: {
    'migrationsDir': 'migration'
  }
}

module.exports = ormConfig;
