import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { BatchService } from './batch.service';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule } from '@api-modules/app-config/app-config.module';
import { AppConfigService } from '@api-modules/app-config/app-config.provider';
import { Project } from '@api-modules/project/project.entity';
import { WorkflowStateCode } from '@api-modules/project/workflow-state-code.entity';
import { ProjectService } from '@api-modules/project/project.service';
import { DistrictService } from '@api-modules/district/district.service';
import { District } from '@api-modules/district/district.entity';
import { ForestClientService } from '@api-modules/forest-client/forest-client.service';
import { ForestClient } from '@api-modules/forest-client/forest-client.entity';

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
    TypeOrmModule.forFeature([Project, WorkflowStateCode, District, ForestClient]),

  ],
  providers: [BatchService, ProjectService, DistrictService, ForestClientService],
  
})
export class AppModule {}
