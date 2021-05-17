import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoadSection } from './entities/road-section.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RoadSectionService extends DataService<RoadSection, Repository<RoadSection>> {
  constructor(
    @InjectRepository(RoadSection)
    repository: Repository<RoadSection>,
    logger: PinoLogger
  ) {
    super(repository, new RoadSection(), logger);
  }
}
