import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStateCode } from './entities/workflow-state-code.entity';
import { CodeTableService } from 'apps/api/src/core/models/code-table.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class WorkflowStateCodeService extends CodeTableService<WorkflowStateCode, Repository<WorkflowStateCode>> {
  constructor(
    @InjectRepository(WorkflowStateCode)
    repository: Repository<WorkflowStateCode>,
    logger: PinoLogger
  ) {
    super(repository, new WorkflowStateCode(), logger);
  }
}
