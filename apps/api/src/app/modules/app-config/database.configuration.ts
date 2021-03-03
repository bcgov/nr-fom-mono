import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  useUnifiedTopology: true,
  useNewUrlParser: true,
  url: process.env.DB_URL,
  type: process.env.DB_TYPE,
  database: process.env.DB,
  ssl: false, // process.env.DB_SSL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}));
