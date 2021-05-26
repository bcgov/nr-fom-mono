import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as dayjs from 'dayjs';
import { Project } from './project.entity';
import { PinoLogger } from 'nestjs-pino';
import { DataService } from 'apps/api/src/core/models/data.service';
import { ProjectDto, ProjectPublicSummaryDto } from './project.dto';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';
import { User } from 'apps/api/src/core/security/user';


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
      query.andWhere("forestClient.name like :forestClientName", { forestClientName:`%${this.likeForestClientName}%`});
    }
    if (this.commentingOpenedOnOrAfter) {
      query.andWhere("p.commenting_open_date >= :openDate", {openDate: `${this.commentingOpenedOnOrAfter}`});
    }
    if (this.includeForestClientNumbers && this.includeForestClientNumbers.length > 0) {
      query.andWhere("p.forest_client_number IN (:...forestClientNumbers)", { forestClientNumbers: this.includeForestClientNumbers});
    }
  }
}

// TODO: Implement standard relations and mapping to DTO.
@Injectable()
export class ProjectService extends DataService<Project, Repository<Project>, ProjectDto> { 
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger,
    private districtService: DistrictService,
    private forestClientService: ForestClientService,
  ) {
    super(repository, new Project(), logger);
  }

  isCreateAuthorized(user: User, dto: Partial<ProjectDto>): boolean {
    return (user && user.isForestClient && dto.forestClientNumber && user.clientIds.includes(dto.forestClientNumber));
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Partial<Project>): boolean {
    return (user && user.isForestClient && user.clientIds.includes(entity.forestClientId));
  }

  isDeleteAuthorized(user: User, id: number): boolean {
    if (!user) {
      return false;
    }
    // TODO: Logic depends on workflow state and type of user.
    // forest client user can delete only when workflow = initial.
    // workflow = ???, ministry can delete
    return true;
  }

  isViewingAuthorized(user: User): boolean {
    // Public can view project details and project public summaries.
    return true;
  }

  async find(findCriteria: ProjectFindCriteria):Promise<ProjectDto[]> {
    this.logger.trace(`Find criteria: ${JSON.stringify(findCriteria)}`);

    const query = this.repository.createQueryBuilder("p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .leftJoinAndSelect("p.workflowState", "workflowState")
      .leftJoinAndSelect("p.district", "district")
      .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
      .addOrderBy('p.project_id', 'DESC') // Newest first
      ;
    findCriteria.applyFindCriteria(query);

    const result:Project[] = await query.getMany();

    return result.map(project => this.convertEntity(project));
  }

  convertEntity(entity: Project): ProjectDto {
    var dto = super.convertEntity(entity);
    if (entity.district != null) {
      dto.district = this.districtService.convertEntity(entity.district);
    }
    if (entity.forestClient != null) {
      dto.forestClient = this.forestClientService.convertEntity(entity.forestClient);
    }
    return dto;
  }
  
  async findPublicSummaries(findCriteria: ProjectFindCriteria):Promise<ProjectPublicSummaryDto[]> {

    this.logger.trace(`Find public summaries criteria: ${JSON.stringify(findCriteria)}`);

    const query = this.repository.createQueryBuilder("p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .leftJoinAndSelect("p.workflowState", "workflowState")
      .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
      .addOrderBy('p.project_id', 'DESC') // Newest first
      ;
    findCriteria.applyFindCriteria(query);

    const result:Project[] = await query.getMany();

    return result.map(project => {
      var summary = new ProjectPublicSummaryDto();
      summary.id = project.id;
      summary.name = project.name;
      summary.workflowStateName = project.workflowState.description;
      summary.forestClientName = project.forestClient.name;
      summary.geojson = project.geojson;
      summary.fspId = project.fspId;
      summary.commentingOpenDate = dayjs(project.commentingOpenDate).format('YYYY-MM-DD');
      return summary;
    });
  }
}
