import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  type: process.env.DB_TYPE,
  database: process.env.DB,
  // schema: 'APP_FOM',
  ssl: false, // process.env.DB_SSL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
}));
