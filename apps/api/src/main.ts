import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
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

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips unknown properties not listed in input DTOs.
  }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  if (process.env.BYPASS_CORS) {
    // For local development only, leave env var undefined within OpenShift deployments.
    app.enableCors({
      origin: '*',
      credentials: false,
    });
  }

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.disable("x-powered-by");
  httpAdapter.use(helmet({ 
    crossOriginResourcePolicy: true, 
    crossOriginOpenerPolicy: true,
    crossOriginEmbedderPolicy: true,
    originAgentCluster: false,
    contentSecurityPolicy: true
  }));

  let cacheMiddleware = (req, res, next) => {
    // Disable caching entirely by default for all APIs.
    res.set('Cache-control', 'no-store, max-age=0');
    res.set('Pragma', 'no-cache');
    next();
  }
  httpAdapter.use(cacheMiddleware);

  // Only meant for running locally, not accessible via /api route.
  httpAdapter.get('/health-check', (req, res) => {
    res.send('Health check passed');
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
  try {
    const app = await bootstrap();
    app.get(Logger).log("Done regular startup.");
    // Don't await so non-blocking - allows OpenShift container (pod) to be marked ready for traffic.
    postStartup(app).catch((postError) => {
      console.log('Error during post startup: ' + JSON.stringify(postError));
    });
  } catch (error) {
    console.log('Error during application startup: ' + JSON.stringify(error));
  }  
}

if (process.argv.length > 2 && '-batch' == process.argv[2]) {
  console.log("Running batch process...");
  // Do batch
  console.log("Batch process completed.");
  process.exit(0);
} else {
  start();
}
