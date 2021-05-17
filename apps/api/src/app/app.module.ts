import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Core Modules
import { AttachmentModule } from './modules/attachment/attachment.module';
import { CutBlockModule } from './modules/cut-block/cut-block.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { DistrictModule } from './modules/district/district.module';
import { ForestClientModule } from './modules/forest-client/forest-client.module';
import { ProjectModule } from './modules/project/project.module';
import { PublicCommentModule } from './modules/public-comment/public-comment.module';
import { RetentionAreaModule } from './modules/retention-area/retention-area.module';
import { RoadSectionModule } from './modules/road-section/road-section.module';
import { SubmissionModule } from './modules/submission/submission.module';
// Code Table Modules
import { AttachmentTypeCodeModule } from './modules/attachment-type-code/attachment-type-code.module';
import { CommentScopeCodeModule } from './modules/comment-scope-code/comment-scope-code.module';
import { ResponseCodeModule } from './modules/response-code/response-code.module';
import { SubmissionTypeCodeModule } from './modules/submission-type-code/submission-type-code.module';
import { WorkflowStateCodeModule } from './modules/workflow-state-code/workflow-state-code.module';
// Other Modules
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/app-config.provider';
import { SecurityModule } from '../core/security/security.module'

@Module({
  imports: [
    // Config
    AppConfigModule,
    SecurityModule,
    LoggerModule.forRoot(),
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
  ],
})
export class AppModule {
  constructor(private appConfigService: AppConfigService) {}
}
