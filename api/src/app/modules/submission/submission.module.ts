import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

import { ProjectModule } from '../project/project.module';
import { SubmissionTypeCode } from './submission-type-code.entity';
import { SubmissionTypeCodeController } from './submission-type-code.controller';
import { SubmissionTypeCodeService } from './submission-type-code.service';
import { CutBlock } from './cut-block.entity';
import { RetentionArea } from './retention-area.entity';
import { RoadSection } from './road-section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, SubmissionTypeCode, CutBlock, RetentionArea, RoadSection]),
    ProjectModule,
  ],
  controllers: [SubmissionController, SubmissionTypeCodeController],
  providers: [SubmissionService, SubmissionTypeCodeService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
