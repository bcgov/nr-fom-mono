import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { PublicComment } from './public-comment.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { DeepPartial } from '@entities';
import * as _ from "lodash";
import { PublicCommentAdminResponse, PublicCommentAdminUpdateRequest, PublicCommentCreateRequest } from './public-comment.dto';
import { ProjectAuthService } from '../project/project-auth.service';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';

@Injectable()
export class PublicCommentService extends DataService<PublicComment, Repository<PublicComment>, PublicCommentAdminResponse> {
  
  private readonly key = process.env.DATA_ENCRYPTION_KEY || 'defaultkey'; 

  constructor(
    @InjectRepository(PublicComment)
    repository: Repository<PublicComment>,
    logger: PinoLogger,
    private projectAuthService: ProjectAuthService
  ) {
    super(repository, new PublicComment(), logger);
  }

  protected async saveEntity(model: DeepPartial<PublicComment>): Promise<PublicComment> {
    const encryptColumns = ['name','location','email','phoneNumber'];// entity property names that need to be encrypted.
    const encrypColumntPicked = _.pick(model, encryptColumns);
    const encryptColumnsOmitted = _.omit(model, encryptColumns);
    let created = await super.saveEntity(encryptColumnsOmitted);
    created = {...created, ...encrypColumntPicked} as PublicComment;
    await this.encryptSensitiveColumns(created);
    return created;
  }
  
  protected async updateEntity(id: string | number, dto: any, entity: PublicComment): Promise<UpdateResult> {
    // There's no use case to update encrypted columns, so we don't touch them - they'll be loaded as encrypted, and resaved as encrypted.
    return super.updateEntity(id, dto, entity);
  }

  protected async findEntityWithCommonRelations(id: string | number, options?: FindOneOptions<PublicComment> | undefined) {
    const found = await super.findEntityWithCommonRelations(id);
    if (found == undefined) {
      return found;
    }
    const decryptedPartials = await this.obtainDecryptedColumns([found.id]);
    if (decryptedPartials) {
      Object.assign(found, decryptedPartials[0]);
    }
    return found;
  }

  protected convertEntity(entity: PublicComment): PublicCommentAdminResponse {
    const response = new PublicCommentAdminResponse();
    response.commentScope = entity.commentScope;
    response.createTimestamp = entity.createTimestamp.toISOString();
    response.email = entity.email;
    response.feedback = entity.feedback;
    response.id = entity.id;
    response.location = entity.location;
    response.name = entity.name;
    response.phoneNumber = entity.phoneNumber;
    response.projectId = entity.projectId;
    response.response = entity.response; 
    response.responseDetails = entity.responseDetails
    response.revisionCount = entity.revisionCount;
    response.scopeCutBlockId = entity.scopeCutBlockId;
    response.scopeRoadSectionId = entity.scopeRoadSectionId;

    return response;
  }

  protected getCommonRelations(): string[] {
    return ['commentScope', 'response'];
  }

  private async encryptSensitiveColumns(entity: PublicComment) {
    this.logger.debug('Encrypting sensitive columns for PublicComment...');
    // Do update: pgp encrypt sensitive column values
    await this.repository
      .update(entity.id,
        {
          ...entity.name && { name: () => `pgp_sym_encrypt('${entity.name}', '${this.key}')` },
          ...entity.location && { location: () => `pgp_sym_encrypt('${entity.location}', '${this.key}')` },
          ...entity.email && { email: () => `pgp_sym_encrypt('${entity.email}', '${this.key}')` },
          ...entity.phoneNumber && { phoneNumber: () => `pgp_sym_encrypt('${entity.phoneNumber}', '${this.key}')` }
        }
      );
  }

  private async obtainDecryptedColumns(id: number[]): Promise<Partial<PublicComment>[]> {
    this.logger.debug('Decrypting sensitive columns for PublicComment...');
    // using query builder for select back
    return await this.repository.createQueryBuilder('pc')
    .select('public_comment_id', 'id')
    .addSelect(`pgp_sym_decrypt(name::bytea, '${this.key}')`, 'name')
    .addSelect(`pgp_sym_decrypt(location::bytea, '${this.key}')`, 'location')
    .addSelect(`pgp_sym_decrypt(email::bytea, '${this.key}')`, 'email')
    .addSelect(`pgp_sym_decrypt(phone_number::bytea, '${this.key}')`, 'phoneNumber')
    .where('pc.id IN (:...pId)', {pId: id})
    .getRawMany() as Partial<PublicComment>[];
  }

  async isCreateAuthorized(dto: PublicCommentCreateRequest, user?: User): Promise<boolean> {
    return this.projectAuthService.isAnonymousUserAllowedStateAccess(dto.projectId, [WorkflowStateEnum.COMMENT_OPEN], user);
  }
  
  async isUpdateAuthorized(dto: PublicCommentAdminUpdateRequest, entity: PublicComment, user?: User):Promise<boolean> {
    return this.projectAuthService.isForestClientUserAllowedStateAccess(entity.projectId, 
      [WorkflowStateEnum.COMMENT_OPEN, WorkflowStateEnum.COMMENT_CLOSED], user);
  }

  async isDeleteAuthorized(entity: PublicComment, user?: User):Promise<boolean> {
    return false; // Comments cannot be deleted.
  }

  async isViewAuthorized(entity: PublicComment, user?: User): Promise<boolean> {

    if (!user) { 
      return false; // Public not allowed to view comments.
    }
    if (user.isMinistry) {
      return true;
    }

    // Forest client users can access irregardless of the workflow state.
    return this.projectAuthService.isForestClientUserAccess(entity.projectId, user);
  }

  async findByProjectId(projectId: number, user: User): Promise<PublicCommentAdminResponse[]> {
    if (!user.isMinistry) {
      // Don't check workflow states for viewing the comments.
      if (! await this.projectAuthService.isForestClientUserAccess(projectId, user)) {
        throw new ForbiddenException();
      }
    }
    
    const options = this.addCommonRelationsToFindOptions({ where: { projectId: projectId } });
    const records = await this.repository.find(options);
    if (!records || records.length == 0) {
      return [];
    }

    const recordIds = _.map(records, 'id');
    const decryptedColumnCollection = await this.obtainDecryptedColumns(recordIds);
    return records.map((r) => {
      const decryptedPartial = _.find(decryptedColumnCollection, {'id': r.id});
      Object.assign(r, decryptedPartial);
      return this.convertEntity(r);
    });
  }
}
