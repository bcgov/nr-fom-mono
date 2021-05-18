import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForestClient } from './entities/forest-client.entity';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly-provider.model';
import { PinoLogger } from 'nestjs-pino';
import { ForestClientDto } from './dto/forest-client.dto';

export class ProjectFindCriteria {
  includeWorkflowStateCodes: string[] = [];
  likeForestClientName?: string;
  commentingOpenedOnOrAfter?: string; // format YYYY-MM-DD
  fspId?: number;
  districtId?: number;
  includeForestClientNumbers: string[] = [];

  applyFindCriteria(query: SelectQueryBuilder<Project>) {
    if (this.fspId) {
      query.andWhere("p.fsp_id = :fspId", {fspId: `${this.fspId}`});
    }
    if (this.districtId) {
      query.andWhere("p.district_id = :districtId", {districtId: `${this.districtId}`});
    }
    if (this.includeWorkflowStateCodes && this.includeWorkflowStateCodes.length > 0) {
      query.andWhere("p.workflow_state_code IN (:...workflowStateCodes)", { workflowStateCodes: this.includeWorkflowStateCodes});
    }
    if (this.likeForestClientName) {
      query.andWhere("forest_client.name like :forestClientName", { forestClientName:`%${this.likeForestClientName}%`});
    }
    if (this.commentingOpenedOnOrAfter) {
      query.andWhere("p.commenting_open_date >= :openDate", {openDate: `${this.commentingOpenedOnOrAfter}`});
    }
    if (this.includeForestClientNumbers && this.includeForestClientNumbers.length > 0) {
      query.andWhere("p.forest_client_number IN (:...forestClientNumbers)", { forestClientNumbers: this.includeForestClientNumbers});
    }
  }
}

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
        .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
        .addOrderBy('fc.name', 'ASC') // Newest first
        ;
      query.andWhere("fc.forest_client_number IN (:...forestClientNumbers)", { forestClientNumbers: forestClientNumbers});
    
      const result:ForestClient[] = await query.getMany();

      return result.map(forestClient => this.convertEntity(forestClient));

    } catch (error) {
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
