import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DeepPartial, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { ApiBaseEntity } from '@entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// export type MsDocumentType<T> = OptionalId<T>;
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
  constructor(
    protected repository: R,
    private entity: E,
    private readonly logger: PinoLogger
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
  async create(dto: Partial<E>): Promise<E> {
    this.logger.info(`${this.constructor.name}.create props`, dto);

    dto.createUser = "FAKED USER";
    dto.revisionCount = 0;
    dto.updateUser = null;
    dto.updateTimestamp = null;

    const object = this.entity.factory(dto);

    const created = await this.repository.save(object);

    this.logger.info(`${this.constructor.name}.create result`, created);

    return created;
  }

  /**
   * Find a record by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof DataService
   */
  async findOne(id: number | string): Promise<E> {
    this.logger.info(`${this.constructor.name}findOne props`, id);

    try {
      const record = await this.repository.findOne(id);
      this.logger.info('${this.constructor.name}findOne result', record);
      return record;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findOne ${error}`);
    }
  }

  // async findByQuery( query: ) {

  //   try {
  //       const record = await this.repository.query
  //   } catch (error) {

  //   }
  // }

  /**
   * update a record by Id with deep  partial
   *
   * @param {string} id
   * @param {Partial<E>} dto
   * @return {*}
   * @memberof DataService
   */
  async update(id: number | string, dto: Partial<E>) {
    dto.updateUser = "FAKED USER";

    this.logger.info('update props', id, dto);
    try {
      let updated;
      // TODO: I don't like this hack, but it gets the types working...
      const record = await this.repository.findOne(id) as unknown as QueryDeepPartialEntity<Partial<E>>;
      if (record) {
        Object.keys(dto).map((k,idx) => {
          if (record.hasOwnProperty(k)) {
            record[k] = dto[k];
          }
        });
        await this.repository.update(id, record);
        updated = await this.repository.findOne(id);
      }

      this.logger.info('update result', updated);
      return updated;
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
      const removed = await this.repository.softDelete(id);
      return removed;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.remove ${error}`);
    }
  }

  /**
   * Findall records in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll(options?: FindManyOptions<E> | undefined): Promise<E[]> {
    this.logger.info(`${this.constructor.name}.findAll options = ` + JSON.stringify(options));

    try {
      const findAll = await this.repository.find(options);
      this.logger.info('findAll result', findAll);
      return findAll;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findAll ${error}`);
      throw new HttpException(
        'InternalServerErrorException',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Find record by any partial query of the entity.
   *
   * @param {Partial<E>} query
   * @return {*}
   * @memberof DataService
   */
  async findByQuery(query: Partial<E>): Promise<E> {
    this.logger.info(`${this.constructor.name}.findByQuery`);

    try {
      /* const findByQuery = await this.repository.findOne(query);

      return findByQuery; */
      return {} as E;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findAll ${error}`);
    }
  }
}
