import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ApiCodeTableEntity } from '@entities';

import { mapFromEntity } from '@core';

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
export abstract class CodeTableService<
  E extends ApiCodeTableEntity<E>,
  R extends Repository<E>
> {
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
    this.logger.info(`${this.constructor.name}findOne props`, id);

    try {
      const record = await this.repository.findOne(id);
      this.logger.info('${this.constructor.name}findOne result', document);

      const dto = {} as C;
      return mapFromEntity(record, dto);
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findOne ${error}`);
    }
  }

  /**
   * Findall documents in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll<C>(): Promise<C[]> {
    this.logger.info(`${this.constructor.name}.findAll`);

    try {
      const findAll = await this.repository.find();
      this.logger.info('findAll result', findAll);
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
