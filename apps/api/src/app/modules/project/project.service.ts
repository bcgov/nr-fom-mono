import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from './entities/project.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';
import { ProjectDto } from './dto/project.dto';
import { ProjectPublicSummaryDto } from './dto/project-public.dto.';
import * as dayjs from 'dayjs';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';


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
export class ProjectService extends DataService<Project, Repository<Project>> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger,
    private districtService: DistrictService,
    private forestClientService: ForestClientService,
  ) {
    super(repository, new Project(), logger);
  }

  async find(findCriteria: ProjectFindCriteria):Promise<ProjectDto[]> {
    this.logger.trace(`Find criteria: ${JSON.stringify(findCriteria)}`);
    try {
      const query = this.repository.createQueryBuilder("p")
        .leftJoinAndSelect("p.forest_client", "forest_client")
        .leftJoinAndSelect("p.workflow_state", "workflow_state")
        .leftJoinAndSelect("p.district", "district")
        .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
        .addOrderBy('p.project_id', 'DESC') // Newest first
        ;
      findCriteria.applyFindCriteria(query);

      const result:Project[] = await query.getMany();

      return result.map(project => this.convertEntity(project));

    } catch (error) {
      this.logger.error(`${this.constructor.name}.find ${error}`);
      throw new HttpException('InternalServerErrorException', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  convertEntity(entity: Project): ProjectDto {
    var dto = super.convertEntity(entity);
    if (entity.district != null) {
      dto.district = this.districtService.convertEntity(entity.district);
    }
    if (entity.forest_client != null) {
      dto.forestClient = this.forestClientService.convertEntity(entity.forest_client);
    }
    return dto;
  }
  
  async findPublicSummaries(findCriteria: ProjectFindCriteria):Promise<ProjectPublicSummaryDto[]> {

    this.logger.trace(`Find public summaries criteria: ${JSON.stringify(findCriteria)}`);

    try {
      const query = this.repository.createQueryBuilder("p")
        .leftJoinAndSelect("p.forest_client", "forest_client")
        .leftJoinAndSelect("p.workflow_state", "workflow_state")
        .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
        .addOrderBy('p.project_id', 'DESC') // Newest first
        ;
      findCriteria.applyFindCriteria(query);

      const result:Project[] = await query.getMany();

      return result.map(project => {
        var summary = new ProjectPublicSummaryDto();
        summary.id = project.id;
        summary.name = project.name;
        summary.workflowStateName = project.workflow_state.description;
        summary.forestClientName = project.forest_client.name;
        summary.geojson = project.geojson;
        summary.fspId = project.fsp_id;
        summary.commentingOpenDate = dayjs(project.commenting_open_date).format('YYYY-MM-DD');
        return summary;
      });
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findPublicSummaries ${error}`);
      throw new HttpException('InternalServerErrorException', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
