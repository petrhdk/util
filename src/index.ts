/**
 * returns `true` if value is anything but `undefined` or `null`
 */
export function isDefined<T>(value: T): value is Exclude<T, null | undefined> {
  return value !== undefined && value !== null;
}

/**
 * returns `true` if value is `undefined` or `null`
 */
export function isNotDefined(value: any): value is undefined | null {
  return value === undefined || value === null;
}

/**
 * generate a random number in the given number interval
 */
export function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * round the given number to a maximum number of decimals
 */
export function roundToDecimals(number: number, numberOfDecimals: number) {
  return Math.round(number * 10 ** numberOfDecimals) / 10 ** numberOfDecimals;
}

/**
 * convert the number to string with fixed number of decimals (filled with zeros if necessary)
 */
export function formatFixedDecimals(number: number, numberOfDecimals: number) {
  const wholeNumber = Math.round(number);
  const decimals = Math.abs(
    Math.round((number - wholeNumber) * 10 ** numberOfDecimals),
  )
    .toString()
    .padEnd(numberOfDecimals, '0');
  return `${wholeNumber}.${decimals}`;
}

/**
 * utility function to assert exhaustiveness of `switch` or `if` statements
 *
 * example:
 *  ```
 *  switch(value) {
 *    case 1: break;
 *    case 2: break;
 *    default: assertThatIsNeverCalled(value);
 *  }
 *  ```
 */
export function assertThatIsNeverCalled(_: never) {}

export type Constructor<T = unknown, A = unknown> = new (...args: A[]) => T;

export function assertInstanceof<T>(x: unknown, clas: Constructor<T>) {
  if (!(x instanceof clas)) {
    throw new TypeError(`Value is not of instance '${clas.name}'`);
  }
  return x;
}
