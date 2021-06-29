import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule } from '@api-modules/app-config/app-config.module';
import { AppConfigService } from '@api-modules/app-config/app-config.provider';
import { ProjectModule } from '@api-modules/project/project.module';
import { SubmissionModule } from '@api-modules/submission/submission.module';

function getLogLevel():string {
  return process.env.LOG_LEVEL || 'info';
}

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRoot({ pinoHttp: {
      level: getLogLevel(),
      formatters: {
        level: (label) => { return { level: label }; }
      }
    }}),
    ScheduleModule.forRoot(),
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

    // TODO: Don't want to import controllers into batch.
    // TypeOrmModule.forFeature([Project, WorkflowStateCode]),

    ProjectModule,
    SubmissionModule,


  ],
  // controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
