import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SubmissionService extends DataService<Submission, Repository<Submission>> {
  constructor(
    @InjectRepository(Submission)
    repository: Repository<Submission>,
    logger: PinoLogger
  ) {
    super(repository, new Submission(), logger);
  }
}
