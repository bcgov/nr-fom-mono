import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './district.entity';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly.service';
import { PinoLogger } from 'nestjs-pino';
import { DistrictResponse } from './district.dto';

@Injectable()
export class DistrictService extends DataReadOnlyService<District, Repository<District>> {
  constructor(
    @InjectRepository(District)
    repository: Repository<District>,
    logger: PinoLogger
  ) {
    super(repository, new District(), logger);
  }
  
  convertEntity(entity: District):DistrictResponse {
    var dto = new DistrictResponse();
    dto.id = entity.id;
    dto.name = entity.name;
    // Do not return email - keep it within API back-end.
    return dto;
  }
}
