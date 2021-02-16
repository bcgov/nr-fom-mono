import { registerAs } from '@nestjs/config';

const configuration = () => ({
  type: process.env.DATABASE_TYPE,
  url: process.env.DB_URL,
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ssl: process.env.DATABASE_SSL,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

export default registerAs('database', () => configuration);

export type ConfigurationType = ReturnType<typeof configuration>;
