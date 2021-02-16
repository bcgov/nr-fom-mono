import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './controllers/user/user.module';
import { LoggerModule } from 'nestjs-pino';

/* TODO: custom variable for loading this from */
const envFilePath = '.env.development';
import { config } from 'dotenv';
// config({ path: __dirname + '/../../.env.development' });
config();

const mongoTypeOrmConfig = {
  synchronize: !process.env.production,
  autoLoadEntities: true,
  type: 'mongodb',
  url: process.env.DB_URL,
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  ssl: false, // process.env.DATABASE_SSL,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const pgTypeOrmConfig = {
  autoLoadEntities: true,
  type: process.env.DATABASE_TYPE,
  host: process.env.POSTGRES_DB_HOST,
  port: process.env.POSTGRES_DB_PORT,
  database: process.env.POSTGRES_DB_NAME,
  ssl: false, //process.env.POSTGRES_DB_SSL,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  entities: [__dirname + '**/*.entity{.ts,.js}']
};

console.log(process.env);

const typeOrmConfig = (() => {
  switch (process.env.DATABASE_TYPE) {
    case 'postgres':
      return pgTypeOrmConfig as TypeOrmModuleOptions;
    case 'mongodb':
      return mongoTypeOrmConfig as TypeOrmModuleOptions;
  }
})();

console.log(typeOrmConfig);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
    /* TODO: @bcdevlucas change this to the PostGres settings */
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    LoggerModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('started');
    console.log(typeOrmConfig);
  }
}
