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
import { DistrictModule } from './controllers/district/district.module';
import { ForestClientModule } from './controllers/forest-client/forest-client.module';
import { ProjectModule } from './controllers/project/project.module';
import { PublicCommentModule } from './controllers/public-comment/public-comment.module';
import { RetentionAreaModule } from './controllers/retention-area/retention-area.module';
import { RoadSectionModule } from './controllers/road-section/road-section.module';
import { SubmissionModule } from './controllers/submission/submission.module';
// Code Table Modules
import { AttachmentTypeCodeModule } from './controllers/attachment-type-code/attachment-type-code.module';
import { CommentScopeCodeModule } from './controllers/comment-scope-code/comment-scope-code.module';
import { ResponseCodeModule } from './controllers/response-code/response-code.module';
import { SubmissionTypeCodeModule } from './controllers/submission-type-code/submission-type-code.module';
import { WorkflowStateCodeModule } from './controllers/workflow-state-code/workflow-state-code.module';
// User & Auth Modules
import { UserModule } from './controllers/user/user.module';
// Other Modules
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.provider';

@Module({
  imports: [
    // Config
    AppConfigModule,
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
    CutBlockModule,
    ForestStewardshipPlanModule,
    FspDistrictXrefModule,
    InteractionModule,
    DistrictModule,
    ForestClientModule,
    ProjectModule,
    PublicCommentModule,
    RetentionAreaModule,
    RoadSectionModule,
    SubmissionModule,
    // Code Table Modules
    AttachmentTypeCodeModule,
    CommentScopeCodeModule,
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
  constructor(private appConfigService: AppConfigService) {}
}
