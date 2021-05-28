import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import { DistrictModule } from '../district/district.module';
import { ForestClientModule } from '../forest-client/forest-client.module';
import { ProjectSpatialDetailService } from './project-spatial-detail.service';
import { ProjectSpatialDetail } from './project-spatial-detail.entity';
import { SecurityModule } from 'apps/api/src/core/security/security.module';
import { WorkflowStateCodeController } from './workflow-state-code.controller';
import { WorkflowStateCodeService } from './workflow-state-code.service';
import { WorkflowStateCode } from './workflow-state-code.entity';
import { ProjectAuthService } from './project-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectSpatialDetail, WorkflowStateCode]),
    DistrictModule,
    ForestClientModule,
    SecurityModule,
  ],
  controllers: [ProjectController, WorkflowStateCodeController],
  providers: [ProjectService, ProjectAuthService, ProjectSpatialDetailService, WorkflowStateCodeService],
  exports: [ProjectService, ProjectAuthService],
})
export class ProjectModule {}
