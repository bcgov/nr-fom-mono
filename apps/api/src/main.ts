import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { createConnection, ConnectionOptions } from 'typeorm';
import * as ormConfigMain from './migrations/ormconfig-migration-main';
import * as ormConfigTest from './migrations/ormconfig-migration-test';

async function dbmigrate(config: ConnectionOptions) {
    const connection = await createConnection(config);
    try {
      await connection.runMigrations({ transaction: "each"});
    } finally {
      await connection.close();
    }
}

async function bootstrap() {

  try {
    console.log("Running DB Main Migrations...");
    await dbmigrate(ormConfigMain as ConnectionOptions);
    if (process.env.DB_TESTDATA  == "true") {
      console.log("Running DB Test Data Migrations...");
      await dbmigrate(ormConfigTest as ConnectionOptions);
    }
  } catch (error) {
    console.log('Error during database migration', error);
    return error;
  }

  const app = await NestFactory.create(AppModule);
  const appConfig = app.get('AppConfigService');

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('FOM API')
    .setDescription('API for FOM backend')
    .setVersion('1.0')
    .build();
  const port = appConfig.get('port') || 3333;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    credentials: false,
  });

  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
