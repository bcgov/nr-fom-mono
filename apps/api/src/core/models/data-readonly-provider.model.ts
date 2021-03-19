import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { OptionalId } from 'mongodb';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { ApiBaseEntity } from '@entities';

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
export abstract class DataReadOnlyService<
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

  /**
   * Findall documents in collection
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

}
