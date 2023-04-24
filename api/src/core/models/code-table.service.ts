import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindOneOptions, Repository } from 'typeorm';
import { ApiCodeTableEntity } from '@entities';

import { mapFromEntity } from '@core';

/**
 * Base class to extend for interacting with the database through a repository pattern.
 * 
 * No user authorization is done as all code tables are assumed to be publically accessible.
 *
 * Add new standard database interaction methods here. Abstract away complex & nonstandard ones
 * @export
 * @class DataService
 * @template E - Model extends MsBaseEntity
 * @template R - repository extends Repository<Model>
 */
@Injectable()
export abstract class CodeTableService<E extends ApiCodeTableEntity<E>, R extends Repository<E>> {
  protected constructor(
    protected repository: R,
    private entity: E,
    private readonly logger: PinoLogger
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
  async findOne<C>(id: number | string): Promise<C> {

    const record = await this.repository.findOne({ where: { id } } as FindOneOptions);
    const dto = {} as C;
    return mapFromEntity(record, dto);
  }

  /**
   * Findall documents in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll<C>(): Promise<C[]> {
    const findAll = await this.repository.find();
    return findAll.map((r) => mapFromEntity(r, {} as C));
  }
}
