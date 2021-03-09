import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FspDistrictXref } from './entities/fsp-district-xref.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class FspDistrictXrefService extends DataService<FspDistrictXref, Repository<FspDistrictXref>> {
  constructor(
    @InjectRepository(FspDistrictXref)
    repository: Repository<FspDistrictXref>,
    logger: PinoLogger
  ) {
    super(repository, new FspDistrictXref(), logger);
  }
}
