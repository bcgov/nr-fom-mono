import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { createConnection, ConnectionOptions } from 'typeorm';
import * as ormConfigMain from './migrations/ormconfig-migration-main';
import * as ormConfigTest from './migrations/ormconfig-migration-test';
import { ProjectController } from './app/modules/project/project.controller';
import helmet = require('helmet');

async function dbmigrate(config: ConnectionOptions) {
    const connection = await createConnection(config);
    try {
      await connection.runMigrations({ transaction: "each"});
    } finally {
      await connection.close();
    }
}

async function bootstrap():Promise<INestApplication> {

  try {
    console.log("Running DB Main Migrations...");
    await dbmigrate(ormConfigMain as ConnectionOptions);
    console.log("Done DB Migrations.");
  } catch (error) {
    console.log('Error during database migration: ' + JSON.stringify(error));
    return null;
  }

  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(Logger));

  app.getHttpAdapter().getInstance().use(helmet({ 
    crossOriginResourcePolicy: true, 
    crossOriginOpenerPolicy: true,
    crossOriginEmbedderPolicy: true,
    originAgentCluster: true,
    contentSecurityPolicy: false 
  }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips unknown properties not listed in input DTOs.
  }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Only meant for running locally, not accessible via /api route.
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

  if (process.env.BYPASS_CORS) {
    // For local development only, leave env var undefined within OpenShift deployments.
    app.enableCors({
      origin: '*',
      credentials: false,
    });
  }
/*
// CORS setup
app.use(
  cors({
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
    origin: process.env.REACT_APP_CLIENT_POINT,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
  })
);
*/
  await app.listen(port, () => {
    app.get(Logger).log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

  return app;
}

async function postStartup(app: INestApplication) {
  try {
    const logger = app.get(Logger);
    logger.log("Starting postStartup...");

    if (process.env.DB_TESTDATA  == "true") {
      logger.log("Running DB Test Data Migrations...");
      // Need different name from default connection that is already active.
      // We don't change ormConfigTest's actual definition because when run via 'npm run' needs to use default connection.
      ormConfigTest['name'] = 'test-migration'; 
      await dbmigrate(ormConfigTest as ConnectionOptions);
    }

    // Preload cache for public summary default data.
    logger.log("Starting public summary cache pre-load...");
    await app.get(ProjectController).findPublicSummary();

    logger.log("Done postStartup.");
  } catch (error) {
    console.log('Error during post startup: ' + JSON.stringify(error));
  }
}

async function start() {
  const app = await bootstrap();
  app.get(Logger).log("Done regular startup.");
  postStartup(app); // Don't await so non-blocking - allows OpenShift container (pod) to be marked ready for traffic.
}

try {
  start();
} catch (error) {
  console.log('Error during application startup: ' + JSON.stringify(error));
}
