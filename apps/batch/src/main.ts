/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); 

  const httpAdapter = app.getHttpAdapter().getInstance();

  // Only meant for running locally, not accessible via a route.
  httpAdapter.get('/health-check', (req, res) => {
    res.send('Health check passed');
  });

  const globalPrefix = 'batch';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3332;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
