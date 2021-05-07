import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForestClient } from './entities/forest-client.entity';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly-provider.model';
import { PinoLogger } from 'nestjs-pino';
import { ForestClientDto } from './dto/forest-client.dto';

@Injectable()
export class ForestClientService extends DataReadOnlyService<ForestClient, Repository<ForestClient>> {
  constructor(
    @InjectRepository(ForestClient)
    repository: Repository<ForestClient>,
    logger: PinoLogger
  ) {
    super(repository, new ForestClient(), logger);
  }

  convertEntity(entity: ForestClient):ForestClientDto {
    var dto = new ForestClientDto();
    // Read-only so don't bother returning audit columns
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }

}
