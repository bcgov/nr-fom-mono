import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { PublicComment } from './entities/public-comment.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { DeepPartial } from '@entities';
import * as _ from "lodash";
import { PublicCommentAdminResponse } from './dto/public-comment.dto';

@Injectable()
export class PublicCommentService extends DataService<PublicComment, Repository<PublicComment>, PublicCommentAdminResponse> {
  
  private readonly key = process.env.DATA_ENCRYPTION_KEY || 'defaultkey'; 

  constructor(
    @InjectRepository(PublicComment)
    repository: Repository<PublicComment>,
    logger: PinoLogger
  ) {
    super(repository, new PublicComment(), logger);
  }

  protected async saveEntity(model: DeepPartial<PublicComment>): Promise<PublicComment> {
    const encryptColumns = ['name','location','email','phoneNumber'];// entity property names that need to be encrypted.
    const encrypColumntPicked = _.pick(model, encryptColumns);
    const encryptColumnsOmitted = _.omit(model, encryptColumns);
    let created = await super.saveEntity(encryptColumnsOmitted);
    created = {...created, ...encrypColumntPicked} as PublicComment;
    // TODO: Need to handle/check update result from encryptSensitiveColumns.
    await this.encryptSensitiveColumns(created);
    return created;
  }
  
  // We provide support for updating encrypted columns, although currently there's no use case where this will happen.
  protected async updateEntity(id: string | number, dto: any, entity: PublicComment): Promise<UpdateResult> {
    const updateResult = await super.updateEntity(id, dto, entity);
    // TODO: Need to handle/check update result from encryptSensitiveColumns.
    await this.encryptSensitiveColumns(entity);
    return updateResult;
  }

  protected async findEntity(id: string | number, options?: FindOneOptions<PublicComment> | undefined) {
    const found = await super.findEntity(id, this.addCommonRelationsToFindOptions(options));
    if (found == undefined) {
      return found;
    }
    return this.decryptSensitiveColumns(found);
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
    this.logger.trace('Encrypting sensitive columns for PublicComment...');
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

  private async decryptSensitiveColumns(entity: PublicComment) {
    this.logger.trace('Decrypting sensitive columns for PublicComment...');
    // using query builder for select back
    let decryptedSelectObj = await this.repository.createQueryBuilder('pc')
    .select('public_comment_id', 'id')
    .addSelect(`pgp_sym_decrypt(name::bytea, '${this.key}')`, 'name')
    .addSelect(`pgp_sym_decrypt(location::bytea, '${this.key}')`, 'location')
    .addSelect(`pgp_sym_decrypt(email::bytea, '${this.key}')`, 'email')
    .addSelect(`pgp_sym_decrypt(phone_number::bytea, '${this.key}')`, 'phoneNumber')
    .where('pc.id = :pId', {pId: entity.id})
    .getRawOne();
    Object.assign(entity, decryptedSelectObj);
    return entity;
  }

  isCreateAuthorized(user: User, dto: any): boolean {
    return user == null; // Only anonymous user is allowed to create comments.
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Partial<PublicComment>):boolean {
    if (!user || !user.isForestClient) {
      return false;
    }
    // TODO: Confirm that forest client is authorized for this project based on project's client id.
    //     const project: ProjectDto = await this.projectService.findOne(dto.projectId, user);

    // return user.clientIds.includes(project.forest_client_number));
    return true;
  }

  isDeleteAuthorized(user: User, id: number):boolean {
    return false; // Comments cannot be deleted.
  }

  isViewingAuthorized(user: User):boolean {
    // Public not allowed to view comments.
    return (user && user.isAuthorizedForAdminSite());
  }

  async findByProjectId(projectId: number, user: User): Promise<PublicCommentAdminResponse[]> {
    if (!this.isViewingAuthorized(user)) {
      throw new ForbiddenException();
    }
    const options = this.addCommonRelationsToFindOptions({ where: { projectId: projectId } });
    this.logger.trace(`${this.constructor.name}.findByProjectId options %o `, options);
    const records = await this.repository.find(options);
    return Promise.all(records.map(async (r) => {
      r = await this.decryptSensitiveColumns(r); 
      return this.convertEntity(r);
    }));
  }
}
