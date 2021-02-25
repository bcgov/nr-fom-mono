// import { config } from 'dotenv';
// config({ path: __dirname + '/../../.env.development' });
// config();

const ormConfig = {
  autoLoadEntities: true,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'bcgov-fom',
  ssl: false, //process.env.POSTGRES_DB_SSL,
  username: 'postgres',
  password: '',
  entities: [__dirname + '**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    'migrationsDir': 'migrations'
  }
}

module.exports = ormConfig;
