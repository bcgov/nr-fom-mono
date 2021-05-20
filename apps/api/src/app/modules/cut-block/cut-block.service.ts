import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CutBlock } from './entities/cut-block.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CutBlockService extends DataService<CutBlock, Repository<CutBlock>> {
  constructor(
    @InjectRepository(CutBlock)
    repository: Repository<CutBlock>,
    logger: PinoLogger
  ) {
    super(repository, new CutBlock(), logger);
  }
}
