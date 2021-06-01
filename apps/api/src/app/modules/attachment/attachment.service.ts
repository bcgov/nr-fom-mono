import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { ProjectAuthService } from '../project/project-auth.service';
import { AttachmentCreateRequest, AttachmentResponse } from './attachment.dto';
import { User } from 'apps/api/src/core/security/user';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';
import { AttachmentTypeEnum } from './attachment-type-code.entity';

@Injectable()
export class AttachmentService extends DataService<Attachment, Repository<Attachment>, AttachmentResponse> {
  constructor(
    @InjectRepository(Attachment)
    repository: Repository<Attachment>,
    logger: PinoLogger,
    private projectAuthService: ProjectAuthService
  ) {
    super(repository, new Attachment(), logger);
  }

  async isCreateAuthorized(dto: AttachmentCreateRequest, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, [WorkflowStateEnum.INITIAL, WorkflowStateEnum.COMMENT_CLOSED], user);
  }
  // TODO: Need to override create to replace a public notice.
  // TOOD: Need to check for maximum file name length and maximum file contents size.
  
  async isUpdateAuthorized(dto: any, entity: Attachment, user?: User):Promise<boolean> {
    return false; // Updates not allowed.
  }

  async isDeleteAuthorized(entity: Attachment, user?: User):Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(entity.projectId, [WorkflowStateEnum.INITIAL, WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isViewAuthorized(entity: Attachment, user?: User): Promise<boolean> {

    if (entity.attachmentTypeCode == AttachmentTypeEnum.PUBLIC_NOTICE || entity.attachmentTypeCode == AttachmentTypeEnum.SUPPORTING_DOC) {
      // These document types are viewable by the public.
      return true;
    }

    if (user.isMinistry) {
      return true;
    }

    // Forest client users can access irregardless of the workflow state.
    return this.projectAuthService.isForestClientUserAccess(entity.projectId, user);
  }

  protected getCommonRelations(): string[] {
    return ['attachmentType'];
  }

  protected convertEntity(entity: Attachment): AttachmentResponse { 
    const response = new AttachmentResponse();
    response.projectId = entity.projectId;
    response.attachmentType = entity.attachmentType;
    response.fileName = entity.fileName;
    response.id = entity.id;

    return response;
  }


}
