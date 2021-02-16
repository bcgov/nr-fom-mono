const PRIMITIVE_KEY_VALUES = ['string', 'number', 'boolean'] as const;
export const [STRING, NUMBER, BOOLEAN] = PRIMITIVE_KEY_VALUES;

export type PrimitiveKeyType = typeof PRIMITIVE_KEY_VALUES[number];

const isString = (key: PrimitiveKeyType) => key === 'string';

const isBoolean = (key: PrimitiveKeyType) => key === 'boolean';

const isNumber = (key: PrimitiveKeyType) => key === 'number';

export { isString, isBoolean, isNumber };
