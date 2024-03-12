export * from './numbers';

/** returns `true` if value is everything but `null` or `undefined` */
export function isDefined<T>(value: T): value is Exclude<T, null | undefined> {
  return value !== undefined && value !== null;
}

/** returns `true` if value is `null` or `undefined` */
export function isNotDefined(value: any): value is undefined | null {
  return value === undefined || value === null;
}

/* utility function to assert exhaustiveness of switch statements */
export function assertThatIsNeverCalled(_: never) {}
