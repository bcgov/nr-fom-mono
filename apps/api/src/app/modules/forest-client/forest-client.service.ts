import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  // Return ForestClients matching the specified numbers. If no numbers are specified, nothing is returned.
  async find(forestClientNumbers: string[]): Promise<ForestClientDto[]> {   
    this.logger.trace(`Find criteria: ${JSON.stringify(forestClientNumbers)}`);

    if (!forestClientNumbers || forestClientNumbers.length == 0) {
      return Promise.resolve([]);
    }
    try {
      const query = this.repository.createQueryBuilder("fc")
        .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: Use constant
        .addOrderBy('fc.name', 'ASC') // Newest first
        ;
      query.andWhere("fc.forest_client_number IN (:...forestClientNumbers)", { forestClientNumbers: forestClientNumbers});
    
      const result:ForestClient[] = await query.getMany();

      return result.map(forestClient => this.convertEntity(forestClient));

    } catch (error) {
      // TODO: Review this error handling...
      this.logger.error(`${this.constructor.name}.find ${error}`);
      throw new HttpException('InternalServerErrorException', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  convertEntity(entity: ForestClient):ForestClientDto {
    var dto = new ForestClientDto();
    // Read-only so don't bother returning audit columns
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }

}
