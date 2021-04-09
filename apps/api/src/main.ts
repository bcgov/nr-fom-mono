/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get('AppConfigService');

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  /* TODO: abstract this out */
  const config = new DocumentBuilder()
    .setTitle('FOM API')
    .setDescription('API for FOM backend')
    .setVersion('1.0')
    .addTag('api')
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
