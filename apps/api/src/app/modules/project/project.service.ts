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
import { isNil } from 'lodash';
import { SubmissionTypeCodeEnum } from '../submission/submission-type-code.entity';
import { AttachmentTypeEnum } from '../attachment/attachment-type-code.entity';
import { PublicCommentService } from '../public-comment/public-comment.service';
import { AttachmentService } from '@api-modules/attachment/attachment.service';
import { MailService } from 'apps/api/src/core/mail/mail.service';

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
      // Case insensitive search
      query.andWhere("upper(forestClient.name) like :forestClientName", { forestClientName:`%${this.likeForestClientName.toUpperCase()}%`});
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
  readonly DATE_FORMAT = 'YYYY-MM-DD';

  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger,
    private districtService: DistrictService,
    private forestClientService: ForestClientService,
    private attachmentService: AttachmentService,
    private publicCommentService: PublicCommentService,
    private mailService: MailService
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
    // When commenting open, can change closed date but can't make it shorter.

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
    query.limit(2500); // Can't use take(). Limit # of results to avoid system strain in case a ministry user does an unlimited search.

    const result:Project[] = await query.getMany();

    return result.map(project => this.convertEntity(project));
  }

  convertEntity(entity: Project): ProjectResponse {
    const response = new ProjectResponse();
    if (entity.commentingClosedDate) {
      response.commentingClosedDate = dayjs(entity.commentingClosedDate).format(this.DATE_FORMAT);
    }
    if (entity.commentingOpenDate) {
      response.commentingOpenDate = dayjs(entity.commentingOpenDate).format(this.DATE_FORMAT);
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

    const options = {relations: []};
    options.relations.push('submissions'); // add this extra relation for later use.
    const entity:Project = await this.findEntityWithCommonRelations(projectId, options);
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
        if (entity.workflowStateCode != WorkflowStateEnum.INITIAL) {
          throw new BadRequestException("Can only publish if workflow state is Initial.");
        }

        await this.validateWorkflowTransitionRules(entity, WorkflowStateEnum.PUBLISHED, user);   
        break;

      case WorkflowStateEnum.COMMENT_OPEN:
        throw new BadRequestException("Requesting state change to COMMENT_OPEN is not permitted.");

      case WorkflowStateEnum.COMMENT_CLOSED:
        throw new BadRequestException("Requesting state change to COMMENT_CLOSED is not permitted.");

      case WorkflowStateEnum.FINALIZED:
        if (entity.workflowStateCode != WorkflowStateEnum.COMMENT_CLOSED) {
          throw new BadRequestException("Can only finalize if workflow state is Commenting Closed.");
        }

        await this.validateWorkflowTransitionRules(entity, WorkflowStateEnum.FINALIZED, user);
        break;

      case WorkflowStateEnum.EXPIRED:
        throw new BadRequestException("Requesting state change to EXPIRED is not permitted.");

      default:
        throw new InternalServerErrorException("Unrecognized requested workflow state " + request.workflowStateCode);
    }

    // Do not pass entity itself to repository.update(). Only pass the partial.
    const updatePartial = {revisionCount: entity.revisionCount + 1, 
                        updateUser: user.userName,
                        updateTimestamp: new Date(),
                        workflowStateCode: request.workflowStateCode
                      };
    const updateCount = (await this.repository.update(projectId, updatePartial)).affected;
    if (updateCount != 1) {
      throw new InternalServerErrorException("Error updating object");
    }

    const updatedEntity = await this.findEntityWithCommonRelations(projectId);
    this.logger.debug(`${this.constructor.name}.update result entity %o`, updatedEntity);

    if (request.workflowStateCode == WorkflowStateEnum.FINALIZED) {
      try {
        this.logger.info(`FOM ${updatedEntity.id} is finalized. Sending notification email to district ${updatedEntity.district.name}`);
        await this.mailService.sendDistrictNotification(updatedEntity);
        this.logger.info('FOM finalized notification mail Sent!');
      }
      catch (error) {
        this.logger.error(`Problem sending notification email: ${error}`);
        throw new InternalServerErrorException('Problem sending FOM finalized notification email.');
      }
    }

    return this.convertEntity(updatedEntity);
  }
  
  /**
   * The method validates business rules are met before FOM transitioning.
   * "manual/human-triggered" transition workflowStats only happens on "PUBLISH", "FINALIZED".
   * 
   * Business Rules:
   * Fields needed in general: FSP ID, District, FOM Holder.
   * 
   * INITIAL -> PUBLISH:
   *        - Proposed submission required.
   *        - COMMENTING_OPEN_DATE required: must be at least one day after publish is pushed
   * 
   * COMMENT_CLOSED -> FINALIZED
   *        - Public Notice attached
   *        - Final Submission submitted
   *        - All comments classified
   * 
   * @param entity current FOM the workflowState transition applies to
   * @param stateTransition WorkflowStateEnum transition to
   */
  async validateWorkflowTransitionRules(entity: Project, stateTransition: WorkflowStateEnum, user: User) {
    const fspId = entity.fspId;
    const districtId = entity.districtId;

    if (isNil(fspId) || isNaN(fspId)) {
      throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}. 
            Missing FSP ID.`);
    }

    if (!this.isDistrictExist(districtId)) {
      throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
            Missing District.`);
    }

    // validating PUBLISHED transitioning
    if (WorkflowStateEnum.PUBLISHED === stateTransition) {
      // Required COMMENTING_OPEN_DATE
      if (isNil(entity.commentingOpenDate) || !dayjs(entity.commentingOpenDate, this.DATE_FORMAT).isValid()) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Missing COMMENTING_OPEN_DATE.`);
      }

      // Required COMMENTING_OPEN_DATE: must be at least one day after publish is pushed
      const publishDate = dayjs().startOf('day');
      const commentingOpenDate = dayjs(entity.commentingOpenDate).startOf('day');
      const dayDiff = commentingOpenDate.diff(publishDate, "day");
      if (dayDiff < 1) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        COMMENTING_OPEN_DATE: must be at least one day after publish is pushed.`);
      }

      // Required: COMMENTING_CLOSED_DATE
      if (isNil(entity.commentingClosedDate) || !dayjs(entity.commentingClosedDate, this.DATE_FORMAT).isValid()) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Missing COMMENTING_CLOSED_DATE.`);
      }

      // Required: COMMENTING_CLOSED_DATE at least 30 days after commenting open
      const commentingClosedDate = dayjs(entity.commentingClosedDate).startOf('day');
      const openClosedDatesDiff = commentingClosedDate.diff(commentingOpenDate, "day");
      if (openClosedDatesDiff < 30) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        COMMENTING_CLOSED_DATE: must be at least 30 days after COMMENTING_OPEN_DATE.`);
      }

      // Required proposed submission
      const submissions = entity.submissions;
      if (!submissions || submissions.length == 0) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Proposed submission is required.`);
      }
      const proposed = submissions.filter(s => s.submissionTypeCode == SubmissionTypeCodeEnum.PROPOSED);
      if (!proposed) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Proposed submission is required.`);
      }
    } // end validating PUBLISHED transitioning

    // validating FINALIZED transitioning
    if (WorkflowStateEnum.FINALIZED === stateTransition) {
      // Final Submission submitted
      const submissions = entity.submissions;
      if (!submissions || submissions.length == 0) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Final Submission is required.`);
      }
      const final = submissions.filter(s => s.submissionTypeCode == SubmissionTypeCodeEnum.FINAL);
      if (!final || final.length == 0) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Final Submission is required.`);
      }

      // Public Notice attached
      const publicNotices = await this.attachmentService.findByProjectIdAndAttachmentTypes(entity.id, 
                            [AttachmentTypeEnum.PUBLIC_NOTICE]);
      if (!publicNotices || publicNotices.length == 0) {
        throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
        Public Notice is required.`);
      }

      // All comments classified
      const publicComments = await this.publicCommentService.findByProjectId(entity.id, user);
      if (publicComments && publicComments.length > 0) {
        const unClassifiedComments = publicComments.filter(p => p.response == null);
        if (unClassifiedComments && unClassifiedComments.length > 0) {
          throw new BadRequestException(`Not a valid request for FOM ${entity.id} transiting to ${stateTransition}.  
          All comments must be classified.`);
        }
      }

    }

  }

  async isDistrictExist(districtId: number): Promise<boolean> {
    if (isNil(districtId) || isNaN(districtId)) {
      return false;
    }

    try {
      await this.districtService.findOne(districtId);
      return true;
    }
    catch (error) {
      return false;
    }
  }

  // Batch process to check for projects that need to either move to comment open (from published), or move to comment closed (from comment open)
  // based on commenting open/closed dates. This needs to be idempotent - multiple executions within the same day should be safe.
  async batchDateBasedWorkflowStateChange(): Promise<any> {
      this.logger.info("Starting batch process for date-based workflow state changes...");
      // We query for projects with dates not only equal but also before the current date in case the batch process happens to not run one day, the subsequent day's 
      // execution will set everything to the proper state.

      const today = dayjs().startOf('day');

      // Query for projects with workflowState = PUBLISHED and COMMENT_OPEN_DATE equal to or before today: update to have workflow state = COMMENT_OPEN
      const currentPublishedFomIds = await this.findFomIds(WorkflowStateEnum.PUBLISHED, dayjs(today).format(this.DATE_FORMAT), false);
      await this.updateProjectsState(WorkflowStateEnum.COMMENT_OPEN, currentPublishedFomIds);

      // Query for projects with workflowState = COMMENT_OPEN and 'COMMENT_CLOSED_DATE' equal to or before today:  update to have workflow state = COMMENT_CLOSED
      const currentCommentOpenFomIds = await this.findFomIds(WorkflowStateEnum.COMMENT_OPEN, dayjs(today).format(this.DATE_FORMAT), true);
      await this.updateProjectsState(WorkflowStateEnum.COMMENT_CLOSED, currentCommentOpenFomIds);

      // Query for projects with workflowState = FINALIZED and COMMENT_OPEN_DATE more than 3 years ago (need to check regarding exact business rule): update to have workflow state = EXPIRED
      const past = today.add(-3, 'year');
      const currentFinalizedFomIds = await this.findFomIds(WorkflowStateEnum.FINALIZED, past.format(this.DATE_FORMAT), false);
      await this.updateProjectsState(WorkflowStateEnum.EXPIRED, currentFinalizedFomIds);

      this.logger.info("Completed batch process for date-based workflow state changes...");
  }
  
  /**
   * Find FOM Ids by 'workflowStateCode' and 'commentingOpenDate'/'commenting_closed_date' equal or before the 'date' passed for search.
   * @param workflowStateCode 
   * @param date a date string as 'YYYY-MM-DD' for query.
   * @param forCommentCloseDate indicates the 'date' is for 'commenting_closed_date' or 'commenting_open_date'
   * @returns array of FOM Ids or empty
   */
  private async findFomIds(workflowStateCode: WorkflowStateEnum, date: string, forCommentCloseDate: boolean): Promise<number[]> {
    this.logger.info(`Find FOM with workflowState ${workflowStateCode} and ${forCommentCloseDate? 'commenting_closed_date'
                      : 'commenting_open_date'} equal or before: ${date}`);
    const queryResults = await this
            .repository
            .createQueryBuilder()
            .select('project_id')
            .where('workflow_state_code = :workflowStateCode', {workflowStateCode: workflowStateCode})
            .andWhere( !forCommentCloseDate? 'commenting_open_date <= :date' : 'commenting_closed_date <= :date', {date: date})
            .orderBy('project_id')
            .getRawMany();
    if (queryResults && queryResults.length > 0) {
      this.logger.info(`${queryResults.length} found.`);
      return queryResults.map(result => result['project_id']);
    }
    this.logger.info(`No result found.`);
    return [];
  }

  /**
   * Update FOM for 'projectIds' to 'workflowStateCode'
   * @param workflowStateCode 
   * @param projectIds
   */
  private async updateProjectsState(workflowStateCode: WorkflowStateEnum, projectIds: number[]): Promise<void> {
    if (!projectIds || projectIds.length == 0) {
      return;
    }

    this.logger.info(`Updating FOM for ${projectIds} to ${workflowStateCode}`);
    const updateFields = 
      {
        workflowStateCode: workflowStateCode,
        updateUser: 'system',
        updateTimestamp: new Date(),
        revisionCount: () => "revision_count + 1"
      }

    if (workflowStateCode === WorkflowStateEnum.COMMENT_OPEN) {
      updateFields['commentingClosedDate']= () => `CASE WHEN commenting_closed_date IS NULL THEN commenting_open_date + integer '30' 
                                                        ELSE commenting_closed_date END`; // default to commenting_open_date + 30
    }
    
    const updatedCounts = (await this.repository
            .createQueryBuilder()
            .update(Project)
            .set(updateFields)
            .where('project_id IN (:...ids)', {ids: projectIds})
            .execute()).affected;
    this.logger.info(`${updatedCounts} FOM(s) for ${projectIds} were updated to ${workflowStateCode}`);
  }

}

