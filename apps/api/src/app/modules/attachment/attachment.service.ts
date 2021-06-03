import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { ProjectAuthService } from '../project/project-auth.service';
import { AttachmentCreateRequest, AttachmentFileResponse, AttachmentResponse } from './attachment.dto';
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

  async create(request: AttachmentCreateRequest, user: User): Promise<AttachmentResponse> {

    const allowedExtensionsForPublicNotice: string[] = ['jpg', 'jpeg', 'png', 'tif', 'pdf'];
    const allowedExtensionsForOthers: string[] = ['doc', 'docx', 'pdf', 'jpg', 'jpeg', 'xls', 'xlsx', 'csv', 'msg', 'png', 'txt', 'rtf', 'tif'];

    let allowedExtensions: string[] = allowedExtensionsForOthers;
    if (request.attachmentTypeCode == AttachmentTypeEnum.PUBLIC_NOTICE) {
      allowedExtensions = allowedExtensionsForPublicNotice;
    }

    const fileExtension:string = request.fileName.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException("Attachment of that extension not permitted.");
    }

    // Only one public notice can exist per project
    if (request.attachmentTypeCode == AttachmentTypeEnum.PUBLIC_NOTICE) {

      const publicNotices:Attachment[] = await this.repository.find({where: { projectId: request.projectId, attachmentTypeCode: AttachmentTypeEnum.PUBLIC_NOTICE } });
      if (publicNotices.length > 0) {
        // Need to do a security check before we actually delete the existing public notice. In this case, create permission implies delete permission.
        if (!this.isCreateAuthorized(request, user)) {
          throw new ForbiddenException();
        }
        await this.repository.delete(publicNotices[0].id);

        // Now that the public notice is deleted, we can proceed with the regular creation.
      }
    }

    return super.create(request, user);
  }

  async isCreateAuthorized(dto: AttachmentCreateRequest, user?: User): Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, [WorkflowStateEnum.INITIAL, WorkflowStateEnum.COMMENT_CLOSED], user);
  }
  
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

    if (user && user.isMinistry) {
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

  async getFileContent(id: number, user?: User): Promise<AttachmentFileResponse> {

    // Works, but fileContents being treated as a Buffer...
    const entity:Attachment = await this.repository.findOne(id, this.addCommonRelationsToFindOptions(
      { select: [ 'id', 'projectId', 'fileContents', 'fileName', 'attachmentType' ] }));

    if (!entity) {
      throw new BadRequestException("No entity for the specified id.");
    }

    if (!this.isViewAuthorized(entity, user)) {
      throw new ForbiddenException();
    }

    const attachmentResponse = this.convertEntity(entity);
    const attachmentFileResponse = { ...attachmentResponse} as AttachmentFileResponse;
    attachmentFileResponse.fileContents = Buffer.from(entity.fileContents);
    
    return attachmentFileResponse;
  }

  async findByProjectId(projectId: number, user?: User): Promise<AttachmentResponse[]> {
    const criteria = { where: { projectId: projectId } };

    if (user && !user.isMinistry) {
      // Don't check workflow states for viewing the comments.
      if (! await this.projectAuthService.isForestClientUserAccess(projectId, user)) {
        throw new ForbiddenException();
      }
    }
    
    const query = this.repository.createQueryBuilder("a")
      .leftJoinAndSelect("a.attachmentType", "attachmentType")
      .andWhere("a.project_id = :projectId", {projectId: `${projectId}`})
      .addOrderBy('a.attachment_id', 'DESC') // Newest first
      ;
    if (!user) {
      // Anonymous users can only see public notices and supporting documents (not interactions).
      query.andWhere('a.attachment_type_code IN (:...attachmentTypeCodes)', { attachmentTypeCodes: [AttachmentTypeEnum.PUBLIC_NOTICE, AttachmentTypeEnum.SUPPORTING_DOC] });
    }

    const records:Attachment[] = await query.getMany();
    return records.map(attachment => this.convertEntity(attachment));
  }


}
