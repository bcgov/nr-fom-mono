import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ApiBaseEntity } from '@entities';

import { mapFromEntity } from '../utils';

/**
 * Base class to extend for interacting with the database through a repository pattern.
 * 
 * Methods do NOT include handling of security as the read-only entities are assumed to be publically viewable.
 *
 * Add new standard database interaction methods here. Abstract away complex & nonstandard ones
 * @export
 * @class DataService
 * @template E - Model extends MsBaseEntity
 * @template R - repository extends Repository<Model>
 */
@Injectable()
export abstract class DataReadOnlyService<E extends ApiBaseEntity<E>, R extends Repository<E>> {
  protected constructor(
    protected repository: R,
    private entity: E,
    protected readonly logger: PinoLogger
  ) {
    logger.setContext(this.constructor.name);
  }

  /**
   * Find a document by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof DataService
   */
  async findOne<C>(id: number): Promise<C> {
    this.logger.trace(`${this.constructor.name}.findOne id %o`, id);

    const record = await this.repository.findOne(id);

    return this.convertEntity(record) as C;
  }

  protected convertEntity(entity: E):any {
      return mapFromEntity(entity, {});
  }

  /**
   * Find all records in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll<C>(): Promise<C[]> {
    this.logger.trace(`${this.constructor.name}.findAll`);

    const findAll = await this.repository.find();
    return findAll.map((r) => this.convertEntity(r));
  }
}
