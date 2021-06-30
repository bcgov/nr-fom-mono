import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import { DistrictModule } from '../district/district.module';
import { ForestClientModule } from '../forest-client/forest-client.module';
import { SecurityModule } from 'apps/api/src/core/security/security.module';
import { WorkflowStateCodeController } from './workflow-state-code.controller';
import { WorkflowStateCodeService } from './workflow-state-code.service';
import { WorkflowStateCode } from './workflow-state-code.entity';
import { ProjectAuthService } from './project-auth.service';
import { AttachmentModule } from '@api-modules/attachment/attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, WorkflowStateCode]),
    DistrictModule,
    ForestClientModule,
    SecurityModule,
    AttachmentModule,
  ],
  controllers: [ProjectController, WorkflowStateCodeController],
  providers: [ProjectService, ProjectAuthService, WorkflowStateCodeService],
  exports: [ProjectService, ProjectAuthService],
})
export class ProjectModule {}
