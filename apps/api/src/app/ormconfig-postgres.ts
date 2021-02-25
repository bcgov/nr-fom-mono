import { config } from 'dotenv';
// config({ path: __dirname + '/../../.env.development' });
config();

const ormConfig = {
  autoLoadEntities: true,
  type: process.env.DATABASE_TYPE,
  host: process.env.POSTGRES_DB_HOST,
  port: process.env.POSTGRES_DB_PORT,
  database: process.env.POSTGRES_DB_NAME,
  ssl: false, //process.env.POSTGRES_DB_SSL,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  entities: [__dirname + '**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: ['./migrations/*{.ts,.js}'],
  cli: {
    'migrationsDir': 'migrations'
  }
}

export { ormConfig as config };
