import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectController, ProjectsController } from './project.controller';

import { DistrictModule } from '../district/district.module';
import { ForestClientModule } from '../forest-client/forest-client.module';
import { WorkflowStateCodeModule } from '../workflow-state-code/workflow-state-code.module';
import { ProjectSpatialDetailService } from './project-spatial-detail.service';
import { ProjectSpatialDetail } from './entities/project-spatial-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectSpatialDetail]),
    DistrictModule,
    ForestClientModule,
    WorkflowStateCodeModule,
  ],
  controllers: [ProjectController, ProjectsController],
  providers: [ProjectService, ProjectSpatialDetailService],
  exports: [ProjectService],
})
export class ProjectModule {}
