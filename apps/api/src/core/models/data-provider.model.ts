import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ApiBaseEntity } from '@entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import * as dayjs from 'dayjs';

import { mapToEntity, mapFromEntity } from '@core';
import { User } from '../security/user';

/**
 * Base class to extend for interacting with the database through a repository pattern.
 * 
 * Data modification methods (create, update, delete) include handling of user authorization and metadata columns (create/update user/timestamp + revision count)
 * View methods (findAll, findOne) include handling of user authorization.
 * Default implementations of user authorization checks reject all users.
 *
 * Add new standard database interaction methods here. Abstract away complex & nonstandard ones
 * @export
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
      throw this.createNotAuthorizedException();      
    }

    dto.createUser = user ? user.userName : 'Anonymous';

    const model = this.entity.factory(mapToEntity(dto as C, {} as E));
    const created = await this.repository.save(model);

    this.logger.trace(`${this.constructor.name}.create result entity %o`, created);

    return this.convertEntity(created);
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
      throw new HttpException("Entity not found", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!this.isUpdateAuthorized(user, dto, entity)) {
      throw this.createNotAuthorizedException();
    }
    if (entity.revision_count != dto.revisionCount) {
      this.logger.info("Entity revision count " + entity.revision_count + " dto revision count = " + dto.revisionCount);
      throw new HttpException("Entity has been modified since you retrieved it for editing. Please reload and try again.", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    dto.revisionCount += 1;

    const updateCount = (await this.repository.update(id, mapToEntity(dto, entity))).affected;
    if (updateCount != 1) {
      throw new HttpException("Error updating object", HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw this.createNotAuthorizedException();
    }

    const deleteCount = await (await this.repository.delete(id)).affected;
    if (deleteCount != 1) {
      throw new HttpException("No entity to delete", HttpStatus.UNPROCESSABLE_ENTITY);
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
      throw this.createNotAuthorizedException();
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
      throw this.createNotAuthorizedException();
    }

    const findAll = await this.repository.find(options);
    return findAll.map((r) => this.convertEntity(r) as C);
  }

  private createNotAuthorizedException() {
    return new HttpException("Not authorized", HttpStatus.FORBIDDEN);
  }


}
