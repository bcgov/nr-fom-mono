import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubmissionTypeCode } from './entities/submission-type-code.entity';
import { SubmissionTypeCodeService } from './submission-type-code.service';
import { SubmissionTypeCodeController } from './submission-type-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionTypeCode])],
  controllers: [SubmissionTypeCodeController],
  providers: [SubmissionTypeCodeService],
  exports: []
})
export class SubmissionTypeCodeModule {}
