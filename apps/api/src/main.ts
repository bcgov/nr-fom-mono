import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { createConnection, ConnectionOptions } from 'typeorm';
import * as ormConfigMain from './migrations/ormconfig-migration-main';
import * as ormConfigTest from './migrations/ormconfig-migration-test';
import { ProjectController } from './app/modules/project/project.controller';

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
    console.log("process.env.DB_TESTDATA: ", process.env.DB_TESTDATA)
    if (process.env.DB_TESTDATA  == "true") {
      console.log("Running DB Test Data Migrations...");
      await dbmigrate(ormConfigTest as ConnectionOptions);
    }
  } catch (error) {
    console.log('Error during database migration', error);
    return error;
  }
  console.log("Done DB Migrations.");

  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(Logger));
  app.getHttpAdapter().getInstance().disable('x-powered-by'); // Poor security to report the technology used, so disable this response header.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips unknown properties not listed in input DTOs.
  }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Redirect root to /api
  app.getHttpAdapter().getInstance().get('/', (req, res) => {
    res.redirect('/'+globalPrefix);
  });

  app.getHttpAdapter().getInstance().get('/health-check',(req,res)=> {
    res.send ('Health check passed');
  });

  const config = new DocumentBuilder()
    .setTitle('FOM API')
    .setDescription('API for FOM backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const appConfig = app.get('AppConfigService');
  const port = appConfig.get('port') || 3333;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    credentials: false,
  });

  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);

    // Preload cache for public summary default data.
    app.get(ProjectController).findPublicSummary().then( () => {
      app.get(Logger).log('Finished cache pre-load.');
    });
      
  });
}

bootstrap();
