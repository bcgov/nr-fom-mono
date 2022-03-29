import { User } from "@api-core/security/user";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import * as R from 'remeda';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { 
  PublicNoticeCreateRequest, PublicNoticePublicFrontEndResponse, 
  PublicNoticeResponse, PublicNoticeUpdateRequest 
} from './public-notice.dto';
import { PublicNotice } from './public-notice.entity';
import { WorkflowStateEnum } from './workflow-state-code.entity';

import NodeCache = require('node-cache');


@Injectable()
export class PublicNoticeService extends DataService<PublicNotice, Repository<PublicNotice>, PublicNoticeResponse> {

  constructor(
    @InjectRepository(PublicNotice)
    repository: Repository<PublicNotice>,
    logger: PinoLogger,
    private projectService: ProjectService
  ) {
    super(repository, new PublicNotice(), logger);
  }

  private cache = new NodeCache({ useClones: false});

  // TODO: Use Cache for public front end list

  async isCreateAuthorized(dto: PublicNoticeCreateRequest, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }
    const projectResponse = await this.projectService.findOne(dto.projectId, user);
     // If a public notice already exists for a project then prevent a new one from being created.
    if (projectResponse.publicNoticeId) {
      return false;
    }

    if (WorkflowStateEnum.INITIAL == projectResponse.workflowState.code) {
      return user.isForestClient && user.isAuthorizedForClientId(projectResponse.forestClient.id);
    }
  }
  
  async isUpdateAuthorized(dto: PublicNoticeUpdateRequest, entity: PublicNotice, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    // TODO: Use dto or entity here?
    const projectResponse = await this.projectService.findOne(entity.projectId, user);

    if (!user.isForestClient || !user.isAuthorizedForClientId(projectResponse.forestClient.id)) {
      return false;
    }

    if (![WorkflowStateEnum.INITIAL].includes(projectResponse.workflowState.code as WorkflowStateEnum)) {
      return false;
    }

    // If isReceiveCommentsSameAsReview indicator is true, should not update 'receive' fields.
    if (dto.isReceiveCommentsSameAsReview && 
      (dto.receiveCommentsAddress || dto.receiveCommentsBusinessHours)) {
        return false;
    }

    return true;
  }

  async isDeleteAuthorized(entity: PublicNotice, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    // TODO: set up cascade delete from project.

    // Only scenario when forest client user can delete.
    const projectResponse = await this.projectService.findOne(entity.projectId, user);
    if (projectResponse.workflowState.code == WorkflowStateEnum.INITIAL) {
      return user.isForestClient && user.isAuthorizedForClientId(projectResponse.forestClient.id);
    }

    // TODO: Can ministry users ever delete?
    return false;
  }

  async isViewAuthorized(entity: PublicNotice, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    const projectResponse = await this.projectService.findOne(entity.projectId, user);
    return user.isMinistry || (user.isForestClient && 
      user.isAuthorizedForClientId(projectResponse.forestClient.id));
  }

  async findForPublicFrontEnd():Promise<PublicNoticePublicFrontEndResponse[]> {
    const query = this.repository.createQueryBuilder("pn")
      .leftJoinAndSelect("pn.project", "p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .leftJoinAndSelect("p.district", "district")
      .andWhere("p.workflow_state_code IN (:...workflowStateCodes)", { workflowStateCodes: [WorkflowStateEnum.COMMENT_OPEN]})
      .addOrderBy('p.project_id', 'DESC'); // Newest first

    const entityResult: PublicNotice[] = await query.getMany();
    const results = entityResult.map(entity => {
      const response = new PublicNoticePublicFrontEndResponse();
      const pnr = this.convertEntity(entity);
      Object.assign(response, R.pick(pnr, 
        [
          'projectId',
          'reviewAddress',
          'reviewBusinessHours',
          'receiveCommentsAddress',
          'receiveCommentsBusinessHours',
          'isReceiveCommentsSameAsReview',
          'mailingAddress',
          'email'
        ]
      ));
      response.project = this.projectService.convertEntity(entity.project);
      return response;
    });
    return results;
  }

  convertEntity(entity: PublicNotice): PublicNoticeResponse {
    const response = new PublicNoticeResponse();
    response.id = entity.id;
    response.projectId = entity.projectId;
    response.reviewAddress = entity.reviewAddress;
    response.reviewBusinessHours = entity.reviewBusinessHours;
    response.receiveCommentsAddress = entity.receiveCommentsAddress;
    response.receiveCommentsBusinessHours = entity.receiveCommentsBusinessHours;
    response.isReceiveCommentsSameAsReview = entity.isReceiveCommentsSameAsReview;
    response.mailingAddress = entity.mailingAddress;
    response.email = entity.email;
    response.revisionCount = entity.revisionCount;
    return response;
  }

  // TODO: Evaluate
  // protected getCommonRelations(): string[] {
  //   return ['district', 'forestClient', 'workflowState'];
  // }

  /*
  @Cron('45 9 * * * ') // Run at 9:45am UTC each day, shortly after the batch which runs at 9:00am UTC
  async resetCache() {
    this.logger.info("Reseting cache for public summaries...");
    this.cache.flushAll();
    await this.refreshCache();
  }

  async refreshCache():Promise<any> {
    let findCriteria: ProjectFindCriteria = new ProjectFindCriteria();

    // Pre-populate cache with default / common searches in order from most likely to least likely searches

    // Commenting Open only
    findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.COMMENT_OPEN);
    await this.findPublicSummaries(findCriteria);

    // Commenting open & closed
    findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.COMMENT_CLOSED);
    findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.FINALIZED);
    await this.findPublicSummaries(findCriteria);

    // Commenting closed only
    findCriteria = new ProjectFindCriteria();
    findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.COMMENT_CLOSED);
    findCriteria.includeWorkflowStateCodes.push(WorkflowStateEnum.FINALIZED);
    await this.findPublicSummaries(findCriteria);
  }
*/

/*
  async findPublicSummaries(findCriteria: ProjectFindCriteria):Promise<ProjectPublicSummaryResponse[]> {
    this.logger.debug('Find public summaries criteria: %o', findCriteria);

    const cacheKey = 'PublicSummary-' + findCriteria.getCacheKey();
    const cacheResult = this.cache.get(cacheKey);
    if (cacheResult != undefined) {
      this.logger.debug('findPublicSummaries - Using cached result');
      return cacheResult as ProjectPublicSummaryResponse[];
    }

    // Use reduced select to optimize performance. 
    this.logger.info('findPublicSummaries - Querying database with criteria %o', findCriteria.getCacheKey());
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

    // Public summary data only changes daily with batch update process, so we let cached data persist for 24 hours, and have scheduled logic
    // to reset the cache shortly after the batch runs.
    const ttl = 24*60*60; // 24 hours
    this.cache.set(cacheKey, result, ttl);

    return result;
  }
*/

  


}

