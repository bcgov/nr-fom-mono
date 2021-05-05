import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionService } from './submission.service';
import {
  SubmissionController,
  SubmissionsController,
} from './submission.controller';

import { ProjectModule } from '../project/project.module';
import { SubmissionTypeCodeModule } from '../submission-type-code/submission-type-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    ProjectModule,
    SubmissionTypeCodeModule,
  ],
  controllers: [SubmissionController, SubmissionsController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
