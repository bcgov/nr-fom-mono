import { config } from 'dotenv';
// config({ path: __dirname + '/../../.env.development' });
config();

const ormConfig = {
  synchronize: !process.env.production,
  autoLoadEntities: true,
  type: 'mongodb',
  url: process.env.DB_URL,
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ssl: false, // process.env.DATABASE_SSL,
  useUnifiedTopology: true,
  useNewUrlParser: true
}

export { ormConfig as config };
