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

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function assertInstanceof<T>(x: unknown, clas: Constructor<T>): T;
export function assertInstanceof<T1, T2>(x: unknown, classes: [Constructor<T1>, Constructor<T2>]): T1 | T2;
export function assertInstanceof(x: unknown, classes: Constructor | Constructor[]) {
  if (!Array.isArray(classes)) {
    classes = [classes];
  }
  if (!classes.some((clas) => x instanceof clas)) {
    throw new TypeError(`Value is instance of neither ${classes.map((clas) => `'${clas.name}'`).join(' nor ')}`);
  }
  return x;
}

export function delegateFocus(el?: Element, { upFrom, downFrom }: { upFrom?: Element, downFrom?: Element } = {}) {
  if (isNotDefined(el)) {
    return;
  }

  let elementsToTry = [el, ...el.querySelectorAll('*')];

  if (isDefined(upFrom)) {
    elementsToTry.reverse();
    downFrom = upFrom;
  }

  if (isDefined(downFrom)) {
    let hasEncountered = false;
    elementsToTry = elementsToTry.filter((el) => {
      if (el === downFrom) {
        hasEncountered = true;
        return false;
      }
      return hasEncountered;
    });
  }

  for (const el of elementsToTry) {
    // try to focus
    (el as HTMLElement).focus?.();

    // check if focus succeeded
    const rootNode = assertInstanceof(el.getRootNode(), [Document, ShadowRoot]);
    if (el === rootNode.activeElement) {
      break;
    }
  }
}
