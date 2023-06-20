import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Core Modules
import { AttachmentModule } from './modules/attachment/attachment.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { DistrictModule } from './modules/district/district.module';
import { ForestClientModule } from './modules/forest-client/forest-client.module';
import { ProjectModule } from './modules/project/project.module';
import { ProjectAuthModule } from './modules/project/project-auth.module';
import { PublicCommentModule } from './modules/public-comment/public-comment.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { SpatialFeatureModule } from './modules/spatial-feature/spatial-feature.module';

// Other Modules
import { LoggerModule, Params } from 'nestjs-pino';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.provider';
import { SecurityModule } from '../core/security/security.module'

function getLogLevel():string {
  return process.env.LOG_LEVEL || 'info';
}

const logParams: Params = { 
    pinoHttp: {
        // level: getLogLevel(),
        // timestamp: () => { 
        //     const time = new Date().toISOString();
        //     return `,"time": ${time}`;
        // },
        // formatters: {
        //     level: (label) => { return { level: label }; }
        // },

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
