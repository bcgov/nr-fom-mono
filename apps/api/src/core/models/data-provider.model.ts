import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ApiBaseEntity } from '@entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { mapToEntity, mapFromEntity } from '@core';

/**
 * Base class to extend for interacting with the database through a repository pattern.
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
   * Create a repository item
   *
   * @param {E} dto
   * @return {*}
   * @memberof DataService
   */
  async create<C>(dto: Partial<any>): Promise<C> {
    this.logger.info(`${this.constructor.name}.create props`, dto);

    // TODO: Pass in user.
    // TODO: Assign these to entity after it is created (to avoid overwrites?)
    dto.createUser = 'TODO: user';
    dto.revisionCount = 0;
    dto.updateUser = null;
    dto.updateTimestamp = null;

    const model = this.entity.factory(mapToEntity(dto as C, {} as E));

    const created = await this.repository.save(model);

    this.logger.info(`${this.constructor.name}.create result`, created);

    const createdDto = {} as C;
    return mapFromEntity(created, createdDto);
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
    id: number | string,
    options?: FindOneOptions<E> | undefined
  ): Promise<C> {
    this.logger.info(`${this.constructor.name}findOne props`, id);

    try {
      const record = await this.repository.findOne(id, options);
      this.logger.info('${this.constructor.name}findOne result', record);

      const dto = {} as C;
      return mapFromEntity(record, dto);
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findOne ${error}`);
    }
  }

  /**
   * Update a record by Id with deep partial
   *
   * @param {string} id
   * @param {Partial<E>} dto
   * @return {*}
   * @memberof DataService
   */
  async update<U>(id: number | string, dto: Partial<any>): Promise<U> {
    dto.updateUser = 'FAKED USER';

    this.logger.info('update props', id, dto);
    try {
      let updated;
      // TODO: I don't like this hack, but it gets the types working...
      const model = ((await this.repository.findOne(
        id
      )) as unknown) as QueryDeepPartialEntity<Partial<E>>;
      if (model) {
        await this.repository.update(id, mapToEntity(dto, model));
        updated = await this.repository.findOne(id);
      }

      this.logger.info('update result', updated);

      const updatedDto = {} as U;
      return mapFromEntity(updated, updatedDto);
    } catch (error) {
      this.logger.error(`${this.constructor.name}.update ${error}`);
    }
  }

  /**
   * Remove record by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof DataService
   */
  async remove(id: number | string) {
    try {
      this.logger.info('remove props', id);
      const removed = await this.repository.delete(id);
      return removed;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.remove ${error}`);
    }
  }

  /**
   * Find all records in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll<C>(options?: FindManyOptions<E> | undefined): Promise<C[]> {
    this.logger.info(
      `${this.constructor.name}.findAll options = ` + JSON.stringify(options)
    );

    try {
      const findAll = await this.repository.find(options);
      return findAll.map((r) => mapFromEntity(r, {} as C));
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findAll ${error}`);
      throw new HttpException(
        'InternalServerErrorException',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
