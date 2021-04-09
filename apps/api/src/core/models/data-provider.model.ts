import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { snakeCase, camelCase } from 'typeorm/util/StringUtils';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ApiBaseEntity } from '@entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Function to recursively map a dto or entity structure's keys.
 * We use this to either camelCase properties when mapping an entity to a DTO,
 * or snake_case properties when mapping a DTO to an entity.
 * @param originalObject
 * @param callback
 * @param mapDates
 */
function deepMapKeys(
  originalObject,
  callback,
  mapDate = (timeValue) => timeValue
) {
  if (typeof originalObject !== 'object') {
    return originalObject;
  }

  return Object.keys(originalObject || {}).reduce((newObject, key) => {
    const newKey = callback(key);
    const originalValue = originalObject[key];
    let newValue = originalValue;
    if (Array.isArray(originalValue)) {
      newValue = originalValue.map((item) => deepMapKeys(item, callback));
    } else if (
      typeof originalValue === 'object' &&
      originalValue &&
      Object.keys(originalValue).length > 0
    ) {
      newValue = deepMapKeys(originalValue, callback);
    } else if (originalValue && originalValue instanceof Date) {
      newValue = mapDate(originalValue);
    }

    return {
      ...newObject,
      [newKey]: newValue,
    };
  }, {});
}

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

  protected mapToEntity(dto, entity) {
    Object.keys(dto).map((dtoKey, idx) => {
      // Convert to snake_case here!
      // TypeORM model properties need to be snake_case when using with Postgres
      // - TypeORM prefers a camelCase naming convention by default
      // - https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md namingStrategy won't handle our needs
      // - TypeORM won't handle @RelationId decorator properly if the relation id is not suffixed with _id
      //   eg. forest_client_number instead of forest_client_id
      const modelKey = snakeCase(dtoKey);
      entity[modelKey] = dto[dtoKey];
    });

    // We might not need to deep map keys here...
    // return deepMapKeys(entity, (key) => snakeCase(key));
    return entity;
  }

  protected mapFromEntity(entity, dto) {
    Object.keys(entity).map((modelKey, idx) => {
      // Convert to camelCase here!
      // TypeORM model properties need to be snake_case when using with Postgres
      // - TypeORM prefers a camelCase naming convention by default
      // - https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md namingStrategy won't handle our needs
      // - TypeORM won't handle @RelationId decorator properly if the relation id is not suffixed with _id
      //   eg. forest_client_number instead of forest_client_id
      const dtoKey = camelCase(modelKey);
      dto[dtoKey] = entity[modelKey];
    });

    return deepMapKeys(
      dto,
      (key) => camelCase(key),
      (value: Date) => value.toISOString()
    );
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

    dto.createUser = 'FAKED USER';
    dto.revisionCount = 0;
    dto.updateUser = null;
    dto.updateTimestamp = null;

    const model = this.entity.factory(this.mapToEntity(dto as C, {} as E));
    const created = await this.repository.save(model);

    this.logger.info(`${this.constructor.name}.create result`, created);

    const createdDto = {} as C;
    return this.mapFromEntity(created, createdDto);
  }

  /**
   * Find a record by Id
   *
   * @param {string} id
   * @param {FindOneOptions} options
   * @return {*}
   * @memberof DataService
   */
  async findOne<C>(id: number | string, options?: FindOneOptions<E> | undefined): Promise<C> {
    this.logger.info(`${this.constructor.name}findOne props`, id);

    try {
      const record = await this.repository.findOne(id, options);

      this.logger.info('${this.constructor.name}findOne result', record);

      const dto = {} as C;
      return this.mapFromEntity(record, dto);
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
        await this.repository.update(id, this.mapToEntity(dto, model));
        updated = await this.repository.findOne(id);
      }

      this.logger.info('update result', updated);

      const updatedDto = {} as U;
      return this.mapFromEntity(updated, updatedDto);
    } catch (error) {
      this.logger.error(`${this.constructor.name}.update ${error}`);
    }
  }
  w;
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
      this.logger.info('findAll result', findAll);

      return findAll.map((r) => this.mapFromEntity(r, {} as C));
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
