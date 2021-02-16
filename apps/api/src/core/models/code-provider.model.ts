import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OptionalId } from 'mongodb';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ApiCodeTableEntity } from '../entities/code.entity';

export type MsDocumentType<T> = OptionalId<T>;
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

    try {
      const object = this.entity.factory(dto);
      const created = await this.repository.save(object);

      this.logger.info(`${this.constructor.name}.create result`, created);

      return created;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.create ${error}`);
    }
  }

  /**
   * Find a document by Id
   *
   * @param {string} id
   * @return {*}
   * @memberof DataService
   */
  async findOne(id: number | string): Promise<E> {
    this.logger.info(`${this.constructor.name}findOne props`, id);

    try {
      const document = await this.repository.findOne(id);
      this.logger.info('${this.constructor.name}findOne result', document);
      return document;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findOne ${error}`);
    }
  }

  // async findByQuery( query: ) {

  //   try {
  //       const document = await this.repository.query
  //   } catch (error) {

  //   }
  // }

  /**
   * update a document by Id with deep partial
   *
   * @param {string} id
   * @param {Partial<E>} dto
   * @return {*}
   * @memberof DataService
   */
  async update(id: number | string, dto: Partial<E>) {
    this.logger.info('update props', id, dto);
    /* try {
      const update = await this.repository.findOneAndUpdate({ _id: id }, dto);
      this.logger.info('update result', update);
      return update;
    } catch (error) {
      this.logger.error(`${this.constructor.name}.update ${error}`);
    } */
  }

  /**
   * Remove document by Id
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
   * Findall documents in collection
   *
   * @return {*}
   * @memberof DataService
   */
  async findAll(): Promise<E[]> {
    this.logger.info(`${this.constructor.name}.findAll`);

    try {
      const findAll = await this.repository.find();
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
   * Find document by any partial query of the entity.
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
