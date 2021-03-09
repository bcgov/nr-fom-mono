import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForestStewardshipPlan } from './entities/forest-stewardship-plan.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ForestStewardshipPlanService extends DataService<ForestStewardshipPlan, Repository<ForestStewardshipPlan>> {
  constructor(
    @InjectRepository(ForestStewardshipPlan)
    repository: Repository<ForestStewardshipPlan>,
    logger: PinoLogger
  ) {
    super(repository, new ForestStewardshipPlan(), logger);
  }
}
