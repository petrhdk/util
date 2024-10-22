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
 *    default: assertThatIsNeverReached(value);
 *  }
 *  ```
 */
export function assertThatIsNeverReached(_: never) {}

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function assertInstanceof<T>(x: unknown, clas: Constructor<T>): T;
export function assertInstanceof<T1, T2>(x: unknown, classes: [Constructor<T1>, Constructor<T2>]): T1 | T2;
export function assertInstanceof(x: unknown, classes: Constructor | Constructor[]) {
  if (!Array.isArray(classes)) {
    classes = [classes];
  }
  if (!classes.some((clas) => x instanceof clas)) {
    throw new TypeError(`Value is not instance of ${classes.map((clas) => `'${clas.name}'`).join(' or ')}`);
  }
  return x;
}

/**
 * find the currently focused element inside the page.
 * automatically traverses into shadow doms
 */
export function focusedElement() {
  let focusedEl: Element | undefined = window.document.activeElement ?? undefined;

  while (isDefined(focusedEl?.shadowRoot?.activeElement)) {
    focusedEl = focusedEl.shadowRoot.activeElement;
  }

  return focusedEl;
}

/**
 * tries to focus the given elements until it finds the first that works
 */
export function tryToFocus(elements: Element[]) {
  for (const el of elements) {
    // try to focus
    (el as HTMLElement).focus?.();

    // if focus was successful, we're done
    if (el === focusedElement()) {
      return true;
    }
  }

  return false;
}

/**
 * delegates focus to the desired menu item (useful for keyboard navigation)
 */
export function focusMenuItem(menuItems: Element[], target: 'first' | 'previous' | 'next') {
  if (menuItems.length === 0) {
    return false;
  }

  const focusedEl = focusedElement();

  if (target === 'previous' || target === 'next') {
    if (isNotDefined(focusedEl) || !menuItems.includes(focusedEl)) {
      target = 'first';
    }
  }

  if (target === 'first') {
    return tryToFocus(menuItems);
  }

  if (target === 'previous') {
    return tryToFocus(menuItems.slice(0, menuItems.indexOf(focusedEl!)).toReversed());
  }

  if (target === 'next') {
    return tryToFocus(menuItems.slice(menuItems.indexOf(focusedEl!) + 1));
  }

  assertThatIsNeverReached(target);
  return false;
}

/**
 * returns the dom element that contains all the given elements, which can be one of the elements itself,
 * elements must be in the same document tree
 */
export function findCommonParent(elements: Element[]) {
  if (!elements.length) {
    throw new Error(`Can't find common parent element of zero nodes`);
  }

  let parent = elements[0];

  do {
    if (elements.every((element) => parent.contains(element))) {
      return parent;
    }
  }
  while (isDefined(parent = parent.parentElement!));

  throw new Error(`Nodes are not within the same document tree`);
}
