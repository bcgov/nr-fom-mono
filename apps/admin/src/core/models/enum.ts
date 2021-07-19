/**
 *
 * @summary - this is a module of generic types to carry out different tasks
 */

export type ConfigType<T> = { [P in keyof T]?: T[P] };

export type ValuesWithKeys<T, K extends keyof T> = T[K];
export type Values<T> = ValuesWithKeys<T, keyof T>;

export type EnumLiteralsOf<T extends object> = T[keyof T];
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// TODO: fix this generic array function
export type ArrayValue<T, K extends readonly T[]> = K[number];
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean };
