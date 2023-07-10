import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Core Modules
import { AttachmentModule } from '@api-modules/attachment/attachment.module';
import { DistrictModule } from '@api-modules/district/district.module';
import { ForestClientModule } from '@api-modules/forest-client/forest-client.module';
import { InteractionModule } from '@api-modules/interaction/interaction.module';
import { ProjectAuthModule } from '@api-modules/project/project-auth.module';
import { ProjectModule } from '@api-modules/project/project.module';
import { PublicCommentModule } from '@api-modules/public-comment/public-comment.module';
import { SpatialFeatureModule } from '@api-modules/spatial-feature/spatial-feature.module';
import { SubmissionModule } from '@api-modules/submission/submission.module';

// Other Modules
import { LoggerModule, Params } from 'nestjs-pino';
import pino from 'pino';
import { SecurityModule } from '@api-core/security/security.module';
import { AppConfigModule } from '@api-modules/app-config/app-config.module';
import { AppConfigService } from '@api-modules/app-config/app-config.provider';
import ecsFormat = require('@elastic/ecs-pino-format')
import rfs = require("rotating-file-stream");

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // Config
    AppConfigModule,
    SecurityModule,
    LoggerModule.forRoot(configureLogParam()),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        autoLoadEntities: true,
        type: configService.db('type'),
        username: configService.db('username'),
        password: configService.db('password'),
        database: configService.db('database'),
        host: configService.db('host'),
        entities: configService.db('entities'),
        synchronize: configService.db('synchronize'),
        ssl: configService.db('ssl'),
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }),
      inject: [AppConfigService],
    }),
    // Core Modules
    AttachmentModule,
    InteractionModule,
    DistrictModule,
    ForestClientModule,
    ProjectModule,
    ProjectAuthModule,
    PublicCommentModule,
    SubmissionModule,
    SpatialFeatureModule,
  ],
})
export class AppModule {
  constructor(private appConfigService: AppConfigService) {}
}

function getLogLevel(): string {
  return process.env.LOG_LEVEL || 'info';
}

function configureLogParam(): Params {
  const rotationOptions = {
    size: process.env.LOG_ROTATE_FILESIZE || '10M',
    path: process.env.LOG_BASEPATH || "logs", // path to the logs folder
    compress: "gzip",
    maxFiles: process.env.LOG_ROTATE_MAXFILES ? Number(process.env.LOG_ROTATE_MAXFILES) : 5
  }

  process.env.LOG_ROTATE_INTERVAL? rotationOptions["interval"]=process.env.LOG_ROTATE_INTERVAL : undefined;

  const fileRotateStream = rfs.createStream(process.env.LOG_FILENAME || "app.log", /*filename can be a function(time,index)*/ 
    rotationOptions);

  const streams = [
    { stream: pino.destination(1) }, // terminal stdout.
    // { stream: pino.destination({ dest: process.env.LOG_PATH || './logs/app.log' }) } // deafult pino file stream
    { stream: fileRotateStream }
  ]

  const logParams: Params = {
    pinoHttp: [{
        // {convertReqRes: true } does log http:{response} but not the request for some reason.
      ...ecsFormat({convertReqRes: true }), // default ecs options
      customAttributeKeys: {
          req: 'http.request',
          responseTime: 'event.duration',
      },
      level: getLogLevel(),
    },
    pino.multistream(streams)] // multistream so can have stdout & file
  }

  return logParams;
}