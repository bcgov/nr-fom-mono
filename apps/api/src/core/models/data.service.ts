import { ForbiddenException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ApiBaseEntity } from '@entities';
import * as dayjs from 'dayjs';

import { mapToEntity, mapFromEntity } from '@core';
import { User } from '../security/user';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Base class to extend for interacting with the database through a repository pattern.
 * Provides standard CRUD services with conversion between entity and DTO objects. This may not be appropriate in all use cases, in which case
 * it is perfectly acceptable to use a completely custom service. See e.g. SubmissionService.
 * 
 * Conversions between DTOs and entity are done automatically, copying all the fields from the source into the target. If different behavior is desired
 * convertDto() and convertEntity() can be overridden.
 * 
 * Data modification methods (create, update, delete) include handling of user authorization and metadata columns (create/update user/timestamp + revision count)
 * View methods (findAll, findOne) include handling of user authorization.
 * Default implementations of user authorization methods reject all users (which is the safest from a security standpoint) 
 * but will therefore most likely need to be overridden.
 *
 * @class DataService
 * @template E - Model extends MsBaseEntity
 * @template R - repository extends Repository<Model>
 */
@Injectable()
export abstract class DataService<
  E extends ApiBaseEntity<E>,
  R extends Repository<E>
> {
  protected constructor(
    protected repository: R,
    private entity: E,
    protected readonly logger: PinoLogger
  ) {
    logger.setContext(this.constructor.name);
  }

  /**
   * 
   * @param user May be null if anonymous. 
   * @param dto 
   */
  isCreateAuthorized(user: User, dto: unknown): boolean {
    return false;
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Partial<E>): boolean {
    return false;
  }

  isDeleteAuthorized(user: User, id: number | string): boolean {
    return false;
  }

  isViewingAuthorized(user: User): boolean {
    return false;
  }

  /**
   * Create a repository item
   *
   * @param {E} dto
   * @return {*}
   * @memberof DataService
   */
  async create<C>(dto: Partial<any>, user: User): Promise<C> {
    this.logger.trace(`${this.constructor.name}.create dto %o`, dto);

    if (!this.isCreateAuthorized(user, dto)) {
      throw new ForbiddenException();
    }

    dto.createUser = user ? user.userName : 'Anonymous';

    const model = this.entity.factory(this.convertDto(dto));
    const created = await this.repository.save(model);

    this.logger.trace(`${this.constructor.name}.create result entity %o`, created);

    return this.convertEntity(created);
  }

  protected convertDto(dto: any, existingEntity?: Partial<E>): QueryDeepPartialEntity<E> {
    const entity = existingEntity ? existingEntity : {} as E;
    return mapToEntity(dto, entity);
  }

  protected convertEntity(entity: E): any {
    return mapFromEntity(entity, {});
  }

  /**
   * Update a record by Id with deep partial
   *
   * @param {string} id
   * @param {Partial<E>} dto
   * @return {*}
   * @memberof DataService
   */
  async update<U>(id: number | string, dto: Partial<any>, user: User): Promise<U> {
    dto.updateUser = user ? user.userName : 'Anonymous';
    dto.updateTimestamp = dayjs().format();

    this.logger.trace(`${this.constructor.name}.update dto %o`, dto);

    const entity = await this.repository.findOne(id);
    if (! entity) {
      throw new UnprocessableEntityException("Entity not found.");
    }
    if (!this.isUpdateAuthorized(user, dto, entity)) {
      throw new ForbiddenException();
    }
    if (entity.revision_count != dto.revisionCount) {
      this.logger.info("Entity revision count " + entity.revision_count + " dto revision count = " + dto.revisionCount);
      throw new UnprocessableEntityException("Entity has been modified since you retrieved it for editing. Please reload and try again.");
    }
    dto.revisionCount += 1;

    const updateCount = (await this.repository.update(id, this.convertDto(dto, entity))).affected;
    if (updateCount != 1) {
      throw new InternalServerErrorException("Error updating object");
    }

    const updatedEntity = await this.repository.findOne(id);
    this.logger.trace(`${this.constructor.name}.update result entity %o`, updatedEntity);

    return this.convertEntity(updatedEntity);
  }

  /**
   * Remove record by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof DataService
   */
  async remove(id: number | string, user: User): Promise<void> {
    this.logger.trace(`${this.constructor.name}.delete id %o`, id);

    if (!this.isDeleteAuthorized(user, id )) {
      throw new ForbiddenException();
    }

    const deleteCount = await (await this.repository.delete(id)).affected;
    if (deleteCount != 1) {
      throw new UnprocessableEntityException("No entity to delete");
    }
  }

  /**
   * Find a record by Id
   *
   * @param {string} id
   * @param {FindOneOptions} options
   * @return {*}
   * @memberof DataService
   */
   async findOne<C>(
    id: number | string, user: User, 
    options?: FindOneOptions<E> | undefined
  ): Promise<C> {
    this.logger.trace(`${this.constructor.name}findOne id %o`, id);

    if (!this.isViewingAuthorized(user)) {
      throw new ForbiddenException();
    }

    const record = await this.repository.findOne(id, options);
    return this.convertEntity(record) as C;
  }

  /**
   * Find all records in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll<C>(user: User, options?: FindManyOptions<E> | undefined): Promise<C[]> {
    this.logger.trace(`${this.constructor.name}.findAll options %o ` + options);

    if (!this.isViewingAuthorized(user)) {
      throw new ForbiddenException();
    }

    const findAll = await this.repository.find(options);
    return findAll.map((r) => this.convertEntity(r) as C);
  }

}
