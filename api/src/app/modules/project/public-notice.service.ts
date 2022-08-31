import { DataService } from '@core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "@utility/security/user";
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
  readonly cacheKey = 'PublicNotices';

  @Cron('55 9 * * * ') // Run at 09:55 UTC each day, after the batch to update states at 09:00 UTC, and shortly after the project cache refresh at 09:45 UTC.
  async resetCache() {
    this.logger.info("Refresh cache for public notices...");
    this.cache.flushAll();
    await this.refreshCache();
  }

  async refreshCache():Promise<any> {
    await this.findForPublicFrontEnd();
  }

  async isCreateAuthorized(dto: PublicNoticeCreateRequest, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }
    const projectResponse = await this.projectService.findOne(dto.projectId, user);
     // If a public notice already exists for a project then prevent a new one from being created.
    if (projectResponse.publicNoticeId) {
      return false;
    }

    return (WorkflowStateEnum.INITIAL == projectResponse.workflowState.code) &&
            user.isForestClient && 
            user.isAuthorizedForClientId(projectResponse.forestClient.id);
  }
  
  async isUpdateAuthorized(_dto: PublicNoticeUpdateRequest, entity: PublicNotice, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    const projectResponse = await this.projectService.findOne(entity.projectId, user);

    if (!user.isForestClient || !user.isAuthorizedForClientId(projectResponse.forestClient.id)) {
      return false;
    }

    if (![WorkflowStateEnum.INITIAL].includes(projectResponse.workflowState.code as WorkflowStateEnum)) {
      return false;
    }

    return true;
  }

  async isDeleteAuthorized(entity: PublicNotice, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    // Only scenario when forest client user can delete.
    const projectResponse = await this.projectService.findOne(entity.projectId, user);
    if (projectResponse.workflowState.code == WorkflowStateEnum.INITIAL) {
      return user.isForestClient && user.isAuthorizedForClientId(projectResponse.forestClient.id);
    }

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

    const cacheResult = this.cache.get(this.cacheKey);
    if (cacheResult != undefined) {
      return cacheResult as PublicNoticePublicFrontEndResponse[];
    }

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
          'email',
          'operationStartYear',
          'operationEndYear'
        ]
      ));
      response.project = this.projectService.convertEntity(entity.project);
      return response;
    });

    // Public notice data visible to public only changes daily with batch update process, so we let cached data persist for 24 hours, and have scheduled logic
    // to reset the cache shortly after the batch runs.
    const ttl = 24*60*60; // 24 hours
    this.cache.set(this.cacheKey, results, ttl);
    
    return results;
  }

  async findLatestPublicNotice(forestClientId: string, user: User): Promise<PublicNoticeResponse> {
    if (!user || !user.isAuthorizedForAdminSite() || !user.isAuthorizedForClientId(forestClientId)) {
      throw new ForbiddenException();
    }

    const qResult = await this.repository.createQueryBuilder('pn')
    .select('pn')
    .addSelect(`greatest(pn.createTimestamp, pn.updateTimestamp)`, 'pn_timestamp')
    .innerJoin('Project', 'pj', 'pj.id = pn.projectId')
    .where('pj.forestClientId = :forestClientId ', {forestClientId})
    .addOrderBy('pn_timestamp', 'DESC')
    .limit(1)
    .getOne() as Partial<PublicNotice>;

    if (!qResult) {
      return null;
    }

    return this.convertEntity(qResult as PublicNotice);
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
    response.operationStartYear = entity.operationStartYear;
    response.operationEndYear = entity.operationEndYear;
    return response;
  }

}

