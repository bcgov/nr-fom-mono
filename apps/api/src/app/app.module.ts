import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Core Modules
import { AttachmentModule } from './modules/attachment/attachment.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { DistrictModule } from './modules/district/district.module';
import { ForestClientModule } from './modules/forest-client/forest-client.module';
import { ProjectModule } from './modules/project/project.module';
import { PublicCommentModule } from './modules/public-comment/public-comment.module';
import { SubmissionModule } from './modules/submission/submission.module';
// Other Modules
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.provider';
import { SecurityModule } from '../core/security/security.module'

function getLogLevel():string {
  return process.env.LOG_LEVEL || 'info';
}

@Module({
  imports: [
    // Config
    AppConfigModule,
    SecurityModule,
    LoggerModule.forRoot({ pinoHttp: {
        level: getLogLevel(),
        formatters: {
          level: (label) => { return { level: label }; }
        }
      }}),
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
    PublicCommentModule,
    SubmissionModule,
  ],
})
export class AppModule {
  constructor(private appConfigService: AppConfigService) {}
}
