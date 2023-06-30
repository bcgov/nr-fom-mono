import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Core Modules
import { AttachmentModule } from './modules/attachment/attachment.module';
import { DistrictModule } from './modules/district/district.module';
import { ForestClientModule } from './modules/forest-client/forest-client.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { ProjectAuthModule } from './modules/project/project-auth.module';
import { ProjectModule } from './modules/project/project.module';
import { PublicCommentModule } from './modules/public-comment/public-comment.module';
import { SpatialFeatureModule } from './modules/spatial-feature/spatial-feature.module';
import { SubmissionModule } from './modules/submission/submission.module';

// Other Modules
import { LoggerModule, Params } from 'nestjs-pino';
import pino from 'pino';
import { SecurityModule } from '../core/security/security.module';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.provider';
import ecsFormat = require('@elastic/ecs-pino-format')

function getLogLevel():string {
  return process.env.LOG_LEVEL || 'info';
}

const ecsOptions = ecsFormat();
const streams = [
  { stream: pino.destination(1) }, // terminal stdout.
  { stream: pino.destination({ dest: './logs/app.log' }) }
]

const logParams: Params = { 
  pinoHttp: [{
    ...ecsOptions, // default options
    customAttributeKeys: { // some other ecs format using custom override.
        req: 'http.request',
        res: 'http.response',
        responseTime: 'event.duration',
    },
    level: getLogLevel(),
  },
  pino.multistream(streams)] // multistream so can have stdout & file
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // Config
    AppConfigModule,
    SecurityModule,
    LoggerModule.forRoot(logParams),
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

/*
// Using transport with target(pion/file, pino-pretty), not ecs format.
{
  pinoHttp: {
    transport: {
      targets: [
          {
              target: 'pino/file',
              options: {
                  destination: process.env.LOG_PATH || './logs/app.log',
                  mkdir: true,
                  // timestamp: stdTimeFunctions.isoTime // does not work
              },
              level: getLogLevel()
          },
          {
              target: 'pino-pretty',
              options: {
                  translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
                  colorize: false,
                  singleLine: true
              },
              level: getLogLevel()
          },
      ]
    }
  }
}
*/

/*
  // originnal pino setup.
  {
    pinoHttp: {
      level: getLogLevel(),
      timestamp: () => { 
          const time = new Date().toISOString();
          return `,"time": ${time}`;
      },
      formatters: {
          level: (label) => { return { level: label }; }
      },
    }
  }
*/