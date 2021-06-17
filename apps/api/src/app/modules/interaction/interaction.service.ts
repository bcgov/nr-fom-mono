import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './interaction.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { ProjectAuthService } from '../project/project-auth.service';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';
import { InteractionCreateRequest, InteractionResponse, InteractionUpdateRequest } from './interaction.dto';
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
      request.attachmentId = await this.addNewAttachment(request.projectId, fileName, file, user);
    }

    const response = await super.create(request, user) as InteractionResponse;
    return response;
  }

  async update(id: number, updateRequest: InteractionUpdateRequest, user: User): Promise<InteractionResponse> {
    const {file, fileName} = updateRequest;

    // Attachment update
    if (!_.isEmpty(fileName)) {
      const entity = await super.findEntityForUpdate(id);
      await super.updateEntity(id, {attachmentId: null}, entity); // remove previous attachment from Interaction first.
      updateRequest.attachmentId = await this.addNewAttachment(updateRequest.projectId, fileName, file, user);
    }

    // update interaction.
    updateRequest = _.omit(updateRequest, ['fileName', 'file']) as InteractionUpdateRequest;
    return super.update(id, updateRequest, user);
  }

  private async addNewAttachment(projectId: number, fileName: string, file: Buffer, user: User): Promise<number> {
    const attachmentCreateRequest = new AttachmentCreateRequest();
    attachmentCreateRequest.projectId = projectId;
    attachmentCreateRequest.fileName = fileName;
    attachmentCreateRequest.fileContents = file;
    attachmentCreateRequest.attachmentTypeCode = AttachmentTypeEnum.INTERACTION;
    const attachmentId = (await this.attachmentService.create(attachmentCreateRequest, user)).id;
    return attachmentId;
  }

  async findByProjectId(projectId: number, user: User): Promise<InteractionResponse[]> {
    if (!user.isMinistry) {
      if (! await this.projectAuthService.isForestClientUserAccess(projectId, user)) {
        throw new ForbiddenException();
      }
    }
    
    const options = this.addCommonRelationsToFindOptions({
      where: { projectId: projectId }, 
      order: {id: 'DESC'}});

    const records = await this.repository.find(options);

    if (!records || records.length == 0) {
      return [];
    }

    return records.map((r) => {
      return this.convertEntity(r);
    });
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
