import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './interaction.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { ProjectAuthService } from '../project/project-auth.service';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';
import { InteractionCreateRequest, InteractionResponse } from './interaction.dto';
import _ = require('lodash');
import { AttachmentService } from '../attachment/attachment.service';
import { AttachmentCreateRequest } from '../attachment/attachment.dto';
import { AttachmentTypeEnum } from '../attachment/attachment-type-code.entity';

@Injectable()
export class InteractionService extends DataService<Interaction, Repository<Interaction>, InteractionResponse> {
  constructor(
    @InjectRepository(Interaction)
    repository: Repository<Interaction>,
    logger: PinoLogger,
    private projectAuthService: ProjectAuthService,
    private attachmentService: AttachmentService
  ) {
    super(repository, new Interaction(), logger);
  }

  async create(request: InteractionCreateRequest, user: User): Promise<InteractionResponse> {
    const {file, fileName} = request;
    // save attachment first.
    if (!_.isEmpty(fileName)) {
      const attachmentCreateRequest = new AttachmentCreateRequest();
      attachmentCreateRequest.projectId = request.projectId;
      attachmentCreateRequest.fileName = fileName;
      attachmentCreateRequest.fileContents = file;
      attachmentCreateRequest.attachmentTypeCode = AttachmentTypeEnum.INTERACTION;
      const attachmentId = (await this.attachmentService.create(attachmentCreateRequest, user)).id;
      request.attachmentId = attachmentId;
    }

    const response = await super.create(request, user) as InteractionResponse;
    return response;
  }

  async isCreateAuthorized(dto: InteractionCreateRequest, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, 
      [WorkflowStateEnum.COMMENT_OPEN, WorkflowStateEnum.COMMENT_CLOSED], user);
  }
  
  async isUpdateAuthorized(dto: InteractionCreateRequest, entity: Interaction, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, 
      [WorkflowStateEnum.COMMENT_OPEN, WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isDeleteAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(entity.projectId, [WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isViewAuthorized(entity: Interaction, user?: User): Promise<boolean> {
    if (!user) {
      return false;
    }

    if (user.isMinistry) {
      return true;
    }

    // We ignore workflow state for viewing.
    return this.projectAuthService.isForestClientUserAccess(entity.projectId, user);
  }

  protected convertEntity(entity: Interaction): InteractionResponse {
    const response = new InteractionResponse();
    response.projectId = entity.projectId;
    response.stakeholder = entity.stakeholder;
    response.communicationDate = entity.communicationDate;
    response.communicationDetails = entity.communicationDetails;
    response.attachmentId = entity.attachmentId;
    response.createTimestamp = entity.createTimestamp.toISOString();
    response.revisionCount = entity.revisionCount;
    response.id = entity.id;
    return response;
  }

}
