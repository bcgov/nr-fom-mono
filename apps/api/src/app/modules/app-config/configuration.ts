import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Do not log full environment - security issue.
// console.log(process.env.NODE_ENV);

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
  DB_HOST: Joi.string().default('localhost'),
  DB_TYPE: Joi.string().default('postgres'),
  DB_NAME: Joi.string().default('api-db'),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default(''),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  globalPrefix: process.env.APP_PREFIX,
  title: process.env.APP_TITLE,
}));
