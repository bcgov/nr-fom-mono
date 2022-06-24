import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionTypeCode } from './submission-type-code.entity';
import { CodeTableService } from '@core';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SubmissionTypeCodeService extends CodeTableService<SubmissionTypeCode, Repository<SubmissionTypeCode>> {
  constructor(
    @InjectRepository(SubmissionTypeCode)
    repository: Repository<SubmissionTypeCode>,
    logger: PinoLogger
  ) {
    super(repository, new SubmissionTypeCode(), logger);
  }
}
