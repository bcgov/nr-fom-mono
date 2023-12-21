import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Do not log full environment - security issue.

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
  DB_NAME: Joi.string().default('fom'),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default(''),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  CLIENT_API_BASE_URL: Joi.string().default('https://nr-forest-client-api-test.api.gov.bc.ca/'),
  CLIENT_API_TOKEN: Joi.string().default('thisisasecret'),
  CLIENT_API_REQ_TIMEOUT: Joi.number().default(5000), //Milliseconds
  CLIENT_API_BTH_PAGE_SIZE: Joi.number().default(1000)
});

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  globalPrefix: process.env.APP_PREFIX,
  title: process.env.APP_TITLE,

  // Forest Client APP Integration
  fcApiBaseUrl: process.env.CLIENT_API_BASE_URL,
  fcApiApiToken: process.env.CLIENT_API_TOKEN,
  fcApiReqTimeOut: process.env.CLIENT_API_REQ_TIMEOUT,
  fcApiBatchSerchPageSize: process.env.CLIENT_API_BTH_PAGE_SIZE,
}));