import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PublicComment } from './entities/public-comment.entity';
import { DataService } from 'apps/api/src/core/models/data.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from 'apps/api/src/core/security/user';
import { PublicCommentDto } from './dto/public-comment.dto';
import { DeepPartial } from '@entities';

@Injectable()
export class PublicCommentService extends DataService<PublicComment, Repository<PublicComment>> {
  
  readonly key = process.env.DATA_ENCRYPTION_KEY || 'defaultkey'; // TODO, where to get this key from the NEST framework (than process.env)?

  constructor(
    @InjectRepository(PublicComment)
    repository: Repository<PublicComment>,
    logger: PinoLogger
  ) {
    super(repository, new PublicComment(), logger);
  }

  protected async saveEntity(model: DeepPartial<PublicComment>) {
    let created = await super.saveEntity(model);
    await this.encryptSensitiveColumns(created);
    return created;
  }
  
  protected async updateEntity(id: string | number, dto: Partial<any>, entity: PublicComment) {
    let updated = await super.updateEntity(id, dto, entity);
    await this.encryptSensitiveColumns(entity);
    return updated;
  }

  protected async findEntity(id: string | number, options?: FindOneOptions<PublicComment> | undefined) {
    let found = await super.findEntity(id, options);
    return this.decryptSensitiveColumns(found);
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
    .addSelect(`pgp_sym_decrypt(phone_number::bytea, '${this.key}')`, 'phone_number')
    .where('pc.id = :pId', {pId: entity.id})
    .getRawOne();
    Object.assign(entity, decryptedSelectObj);
    return entity;
  }

  isCreateAuthorized(user: User, dto: Partial<PublicCommentDto>): boolean {
    return user == null; // Only anonymous user is allowed to create comments.
  }
  
  isUpdateAuthorized(user: User, dto: Partial<PublicCommentDto>, entity: Partial<PublicComment>):boolean {
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


}
