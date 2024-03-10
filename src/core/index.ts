export * from './numbers';

/** Check value against `undefined` and `null`. */
export function isDefined<T>(value: T): value is Exclude<T, null | undefined> {
  return value !== undefined && value !== null;
}
