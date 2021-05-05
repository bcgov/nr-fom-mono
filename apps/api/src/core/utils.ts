import { camelCase, snakeCase } from 'typeorm/util/StringUtils';

/**
 * Function to recursively map a dto or entity structure's keys.
 * We use this to either camelCase properties when mapping an entity to a DTO,
 * or snake_case properties when mapping a DTO to an entity.
 * @param originalObject
 * @param callback
 * @param mapDate
 */
export const deepMapKeys = (
  originalObject,
  callback,
  mapDate = (timeValue) => timeValue
) => {
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
};

export const mapToEntity = (dto, entity) => {
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
};

export const mapFromEntity = (entity, dto) => {
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
};

  // flat multidimensional array down to 1d array
  export const flatDeep = (arr, d = 1) => {
    return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                 : arr.slice();
  };
