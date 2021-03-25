import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  APP_HOST: Joi.string().default('localhost'),
  APP_NAME: Joi.string().default('Api'),
  APP_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision', 'docker')
    .default('development'),
  APP_PORT: Joi.number().default(3333),
  APP_PREFIX: Joi.string().default('api'),
  APP_TITLE: Joi.string().default('Api'),
  SESSION_DB_NAME: Joi.string().default('api-session'),
  SESSION_DB_COLLECTION: Joi.string().default('session'),
  SESSION_SECRET: Joi.string().default('this-is-my-secret-key'),
  DB_URL: Joi.string().default('localhost'),
  DB_TYPE: Joi.string().default('postgres'),
  DB: Joi.string().default('api-db'),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default(''),
  MS_AUTH_PORT: Joi.number().default(4000),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

export default registerAs('app', () => {
  const config = {
    host: process.env.APP_HOST,
    env: process.env.APP_ENV,
    name: process.env.APP_NAME,
    port: process.env.APP_PORT,
    globalPrefix: process.env.APP_PREFIX,
    title: process.env.APP_TITLE,
    sessionDb: process.env.DB_URL,
    sessionDbName: process.env.SESSION_DB,
    sessionSecret: process.env.SESSION_SECRET,
    sessionCollection: process.env.SESSION_DB_COLLECTION,
    msAuthPort: process.env.MS_AUTH_PORT,
  };

  console.log(`Starting app using configuration:\n${JSON.stringify(config, null, 4)}`);
  return config;
});
