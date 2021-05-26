import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import * as dayjs from 'dayjs';
import { Project } from './project.entity';
import { PinoLogger } from 'nestjs-pino';
import { DataService } from 'apps/api/src/core/models/data.service';
import { ProjectCreateRequest, ProjectPublicSummaryResponse, ProjectResponse, ProjectUpdateRequest } from './project.dto';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';
import { User } from 'apps/api/src/core/security/user';
import { WorkflowStateCode, WorkflowStateEnum } from './workflow-state-code.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';


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

@Injectable()
export class ProjectService extends DataService<Project, Repository<Project>, ProjectResponse> { 
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger,
    private districtService: DistrictService,
    private forestClientService: ForestClientService,
  ) {
    super(repository, new Project(), logger);
  }

  isCreateAuthorized(user: User, dto: Partial<ProjectCreateRequest>): boolean {
    
    return (user && user.isForestClient && dto.forestClientNumber && user.isAuthorizedForClientId(dto.forestClientNumber) );
  }
  
  isUpdateAuthorized(user: User, dto: ProjectUpdateRequest, entity: Partial<Project>): boolean {
    return (user && user.isForestClient && user.isAuthorizedForClientId(entity.forestClientId));
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

  async create(request: any, user: User): Promise<ProjectResponse> {
    request.workflowStateCode = WorkflowStateEnum.INITIAL;
    request.forestClientId = request.forestClientNumber;
    return await super.create(request, user);
  }

  async find(findCriteria: ProjectFindCriteria):Promise<ProjectResponse[]> {
    this.logger.debug(`Find criteria: ${JSON.stringify(findCriteria)}`);

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

  convertEntity(entity: Project): ProjectResponse {
    const response = new ProjectResponse();
    if (entity.commentingClosedDate) {
      response.commentingClosedDate = dayjs(entity.commentingClosedDate).format('YYYY-MM-DD');
    }
    if (entity.commentingOpenDate) {
      response.commentingOpenDate = dayjs(entity.commentingOpenDate).format('YYYY-MM-DD');
    }
    response.createTimestamp = entity.createTimestamp.toISOString();
    response.description = entity.description;
    if (entity.district != null) {
      response.district = this.districtService.convertEntity(entity.district);
    }
    if (entity.forestClient != null) {
      response.forestClient = this.forestClientService.convertEntity(entity.forestClient);
    }
    response.fspId = entity.fspId;
    response.id = entity.id;
    response.name = entity.name;
    response.revisionCount = entity.revisionCount;
    response.workflowState = entity.workflowState;

    return response;
  }

  protected getCommonRelations(): string[] {
    return ['district', 'forestClient', 'workflowState'];
  }

  async findPublicSummaries(findCriteria: ProjectFindCriteria):Promise<ProjectPublicSummaryResponse[]> {

    this.logger.debug(`Find public summaries criteria: ${JSON.stringify(findCriteria)}`);

    const query = this.repository.createQueryBuilder("p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .leftJoinAndSelect("p.workflowState", "workflowState")
      .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
      .addOrderBy('p.project_id', 'DESC') // Newest first
      ;
    findCriteria.applyFindCriteria(query);

    const result:Project[] = await query.getMany();

    return result.map(project => {
      var summary = new ProjectPublicSummaryResponse();

      summary.forestClientName = project.forestClient.name;
      summary.fspId = project.fspId;
      summary.geojson = project.geojson;
      summary.id = project.id;
      summary.name = project.name;
      summary.workflowStateName = project.workflowState.description;
      return summary;
    });
  }
}
