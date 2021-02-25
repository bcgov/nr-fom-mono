import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// Core Modules
import { AttachmentModule } from './controllers/attachment/attachment.module';
import { CutBlockModule } from './controllers/cut-block/cut-block.module';
import { ForestStewardshipPlanModule } from './controllers/forest-stewardship-plan/forest-stewardship-plan.module';
import { FspDistrictXrefModule } from './controllers/fsp-district-xref/fsp-district-xref.module';
import { InteractionModule } from './controllers/interaction/interaction.module';
import { ProjectModule } from './controllers/project/project.module';
import { PublicCommentModule } from './controllers/public-comment/public-comment.module';
import { RetentionAreaModule } from './controllers/retention-area/retention-area.module';
import { RoadSectionModule } from './controllers/road-section/road-section.module';
import { SubmissionModule } from './controllers/submission/submission.module';
// Code Table Modules
import { AttachmentTypeCodeModule } from './controllers/attachment-type-code/attachment-type-code.module';
import { ResponseCodeModule } from './controllers/response-code/response-code.module';
import { SubmissionTypeCodeModule } from './controllers/submission-type-code/submission-type-code.module';
import { WorkflowStateCodeModule } from './controllers/workflow-state-code/workflow-state-code.module';
// User & Auth Modules
import { UserModule } from './controllers/user/user.module';
// Other Modules
import { LoggerModule } from 'nestjs-pino';

/* TODO: custom variable for loading this from */
const envFilePath = '.env.development';
import { config as mongoTypeOrmConfig } from './ormconfig-mongo';
import { config as pgTypeOrmConfig } from './ormconfig-postgres';

console.log(process.env);

const typeOrmConfig = (() => {
  switch (process.env.DATABASE_TYPE) {
    case 'postgres':
      return pgTypeOrmConfig as TypeOrmModuleOptions;
    case 'mongodb':
      return mongoTypeOrmConfig as TypeOrmModuleOptions;
  }
})();

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
    /* TODO: @bcdevlucas change this to the PostGres settings */
    TypeOrmModule.forRoot(typeOrmConfig),
    // Core Modules
    AttachmentModule,
    CutBlockModule,
    ForestStewardshipPlanModule,
    FspDistrictXrefModule,
    InteractionModule,
    ProjectModule,
    PublicCommentModule,
    RetentionAreaModule,
    RoadSectionModule,
    SubmissionModule,
    // Code Table Modules
    AttachmentTypeCodeModule,
    ResponseCodeModule,
    SubmissionTypeCodeModule,
    WorkflowStateCodeModule,
    // User & Auth Modules
    UserModule,
    // Other Modules
    LoggerModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('started');
    console.log(typeOrmConfig);
  }
}
