import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetentionArea } from './entities/retention-area.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RetentionAreaService extends DataService<RetentionArea, Repository<RetentionArea>> {
  constructor(
    @InjectRepository(RetentionArea)
    repository: Repository<RetentionArea>,
    logger: PinoLogger
  ) {
    super(repository, new RetentionArea(), logger);
  }
}
