import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as dayjs from 'dayjs';
import { Project } from './project.entity';
import { PinoLogger } from 'nestjs-pino';
import { DataService } from 'apps/api/src/core/models/data.service';
import { ProjectCreateRequest, ProjectPublicSummaryResponse, ProjectResponse, ProjectUpdateRequest, ProjectWorkflowStateChangeRequest } from './project.dto';
import { DistrictService } from '../district/district.service';
import { ForestClientService } from '../forest-client/forest-client.service';
import { User } from 'apps/api/src/core/security/user';
import { WorkflowStateEnum } from './workflow-state-code.entity';
import NodeCache = require('node-cache');

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

  getCacheKey(): string {
    return JSON.stringify(this);
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

  private cache = new NodeCache({ useClones: false});

  async isCreateAuthorized(dto: ProjectCreateRequest, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }
    return user.isForestClient && dto.forestClientNumber != null && user.isAuthorizedForClientId(dto.forestClientNumber);
  }
  
  async isUpdateAuthorized(dto: ProjectUpdateRequest, entity: Project, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    // TODO: Enforce rules around changing commenting open/closed dates?
    // WHen commenting open or later, can't change commenting open date
    // When commenting open, can change closed date. Forest client can't make it shorter
    // When after commenting open, cannot change closed date.

    if (user.isMinistry && !user.isForestClient) {
      // As ministry user can only update when commenting open, and only to change the commenting closed date.
      // TODO: Confirm that only commenting closed date is changing.
      return WorkflowStateEnum.COMMENT_OPEN == entity.workflowStateCode;
    }

    if (!user.isForestClient || !user.isAuthorizedForClientId(entity.forestClientId)) {
      return false;
    }
    // Workflow states that forest client user is allowed to edit in. 
    return [WorkflowStateEnum.INITIAL, WorkflowStateEnum.COMMENT_OPEN, WorkflowStateEnum.COMMENT_CLOSED].includes(entity.workflowStateCode as WorkflowStateEnum);
  }

  async isDeleteAuthorized(entity: Project, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    // Only scenario when forest client user can delete.
    if (entity.workflowStateCode == WorkflowStateEnum.INITIAL) {
      return user.isForestClient && user.isAuthorizedForClientId(entity.forestClientId);
    }

    // All other scenarios only ministry user can delete.
    if (!user.isMinistry) {
      return false; 
    }

    // Workflows states that the ministry user can delete in.
    return [WorkflowStateEnum.COMMENT_CLOSED, WorkflowStateEnum.FINALIZED, WorkflowStateEnum.EXPIRED].includes(entity.workflowStateCode as WorkflowStateEnum);
  }

  async isViewAuthorized(entity: Project, user?: User): Promise<boolean> {
    if (!user) {
      return true;
    }
    if (user.isMinistry) {
      return true;
    }

    return user.isForestClient && user.isAuthorizedForClientId(entity.forestClientId);
  }

  async create(request: any, user: User): Promise<ProjectResponse> {
    request.workflowStateCode = WorkflowStateEnum.INITIAL;
    request.forestClientId = request.forestClientNumber;
    return super.create(request, user);
  }

  async find(findCriteria: ProjectFindCriteria):Promise<ProjectResponse[]> {
    this.logger.debug('Find criteria: %o', findCriteria);

    const query = this.repository.createQueryBuilder("p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .leftJoinAndSelect("p.workflowState", "workflowState")
      .leftJoinAndSelect("p.district", "district")
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

    this.logger.debug('Find public summaries criteria: %o', findCriteria);

    const cacheKey = 'PublicSummary-' + findCriteria.getCacheKey();
    const cacheResult = this.cache.get(cacheKey);
    if (cacheResult != undefined) {
      this.logger.info('findPublicSummaries - Using cached result');
      return cacheResult as ProjectPublicSummaryResponse[];
    }

    // Use reduced select to optimize performance. 
    this.logger.info('findPublicSummaries - Querying database');
    const query = this.repository.createQueryBuilder("p")
      .select(['p.id', 'p.geojson', 'p.fspId', 'p.name', 'forestClient.name', 'workflowState.description']) 
      .leftJoin('p.forestClient', 'forestClient')
      .leftJoin("p.workflowState", "workflowState")
      ;
    findCriteria.applyFindCriteria(query);

    const entityResult:Project[] = await query.getMany();
    
    const result = entityResult.map(project => {
      // Avoid creating new object to optimize performance.
      const response = project as (ProjectPublicSummaryResponse & Project);
      response.forestClientName = project.forestClient.name;
      response.workflowStateName = project.workflowState.description;
      delete response.forestClient;
      delete response.workflowState;
      return response;
    });

    // Public summary data only changes daily with batch update process, but we don't want to assume we know when it runs, 
    // so just use 1 hour cache for the default (most common scenario). We don't want other searches to clog the cache so just use 10 minutes for those.
    const defaultCacheKey = 'PublicSummary-{"includeWorkflowStateCodes":["COMMENT_OPEN","COMMENT_CLOSED","FINALIZED"],"includeForestClientNumbers":[]}';
    const ttl = cacheKey == defaultCacheKey ? 60*60 : 10*60;
    this.cache.set(cacheKey, result, ttl);

    return result;
  }

  async workflowStateChange(projectId: number, request: ProjectWorkflowStateChangeRequest, user: User): Promise<ProjectResponse> {

    this.logger.debug(`${this.constructor.name}.workflowStateChange projectId %o request %o`, projectId, request);

    const entity:Project = await this.findEntityForUpdate(projectId);
    if (! entity) {
      throw new UnprocessableEntityException("Entity not found.");
    }

    if (!user || !user.isForestClient || !user.isAuthorizedForClientId(entity.forestClientId)) {
      throw new ForbiddenException();
    }

    if (entity.revisionCount != request.revisionCount) {
      this.logger.debug("Entity revision count " + entity.revisionCount + " dto revision count = " + request.revisionCount);
      throw new UnprocessableEntityException("Entity has been modified since you retrieved it for editing. Please reload and try again.");
    }

    if (request.workflowStateCode == entity.workflowStateCode) {
      throw new BadRequestException("Requested state is equal to the current state.");
    }

    switch(request.workflowStateCode) {
      case WorkflowStateEnum.INITIAL:
        throw new BadRequestException("Changing state back to INITIAL not permitted.");

      case WorkflowStateEnum.PUBLISHED:
        this.logger.info("Published state change."); // TODO: REMOVE

        if (entity.workflowStateCode != WorkflowStateEnum.INITIAL) {
          throw new BadRequestException("Can only publish if workflow state is Initial.");
        }

        // TODO: Check busines rules.
        
        break;

      case WorkflowStateEnum.COMMENT_OPEN:
        throw new BadRequestException("Requesting state change to COMMENT_CLOSED is not permitted.");

      case WorkflowStateEnum.COMMENT_CLOSED:
        throw new BadRequestException("Requesting state change to COMMENT_CLOSED is not permitted.");

      case WorkflowStateEnum.FINALIZED:
        this.logger.info("Finalized state change."); // TODO: REMOVE
        if (entity.workflowStateCode != WorkflowStateEnum.COMMENT_CLOSED) {
          throw new BadRequestException("Can only finalize if workflow state is Commenting Closed.");
        }

        // TODO: Check busines rules.

        break;

      case WorkflowStateEnum.EXPIRED:
        throw new BadRequestException("Requesting state change to EXPIRED is not permitted.");

      default:
        throw new InternalServerErrorException("Unrecognized requested workflow state " + request.workflowStateCode);
    }
    // TODO: Check that the state change is permitted based on
    // 1. Current workflow state
    // 2. Business rules.

    entity.revisionCount +=1;
    entity.updateUser = user.userName;
    entity.updateTimestamp = new Date();  
    entity.workflowStateCode = request.workflowStateCode;

    const updateCount = (await this.repository.update(projectId, entity)).affected;
    if (updateCount != 1) {
      throw new InternalServerErrorException("Error updating object");
    }

    const updatedEntity = await this.findEntityWithCommonRelations(projectId);
    this.logger.debug(`${this.constructor.name}.update result entity %o`, updatedEntity);

    return this.convertEntity(updatedEntity);

  }  
}
