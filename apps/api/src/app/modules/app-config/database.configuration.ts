import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('db', () => ({
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // process.env.NODE_ENV !== 'production',
  type: process.env.DB_TYPE,
  database: process.env.DB,
  schema: 'app_fom',
  ssl: false, // process.env.DB_SSL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  // namingStrategy: new SnakeNamingStrategy()
}));
