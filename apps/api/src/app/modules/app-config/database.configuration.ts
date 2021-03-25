import { registerAs } from '@nestjs/config';

export default registerAs('db', () => {
  const config = {
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
  };

  console.log(`Starting db using configuration:\n${JSON.stringify(config, null, 4)}`);
  return config;
});
