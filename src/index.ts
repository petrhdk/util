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

/**
 * find the currently focused element inside the dom tree that is given by some random `referenceElement` of that dom tree
 */
export function getFocusedElement(referenceElement: Element) {
  const documentRoot = referenceElement.getRootNode();
  if (
    !(documentRoot instanceof Document) &&
    !(documentRoot instanceof ShadowRoot)
  ) {
    throw new TypeError(`The given reference element is not inside a document tree`);
  }
  return documentRoot.activeElement ?? undefined;
}

/**
 * tries to focus the given elements until it finds the first that works
 */
export function tryToFocus(elements: Element[]) {
  for (const el of elements) {
    // try to focus
    (el as HTMLElement).focus?.();

    // if focus was successful, we're done
    if (el === getFocusedElement(el)) {
      break;
    }
  }
}

/**
 * delegates focus to the next focusable child element inside a given container,
 * useful for keyboard navigation
 */
export function focusMenuItem(containerEl: Element, target: 'first' | 'previous' | 'next') {
  const menuItems = [...containerEl.children];

  if (target === 'first') {
    tryToFocus(menuItems);
  }

  if (target === 'previous' || target === 'next') {
    const documentRoot = assertInstanceof(containerEl.getRootNode(), [Document, ShadowRoot]);
    const activeElement = documentRoot.activeElement;

    // currently active element must at least be inside the container
    if (isNotDefined(activeElement) || !containerEl.contains(activeElement) || containerEl === activeElement) {
      throw new Error(`Can not navigate to ${target} menu item because no menu item currently has focus`);
    }

    // if currently active element is not immediate child yet, traverse upwards until we hit a child, and then re-focus that child, if possible
    if (activeElement.parentElement !== containerEl) {
      let el = activeElement;
      while (el.parentElement !== containerEl) {
        el = el.parentElement!;
      }
      tryToFocus([el]);
    }
    // otherwise we can just focus the previous/next menu item(s), if possible
    else {
      if (target === 'previous') {
        tryToFocus(
          menuItems.slice(0, menuItems.indexOf(activeElement)).toReversed(),
        );
      }
      if (target === 'next') {
        tryToFocus(
          menuItems.slice(menuItems.indexOf(activeElement) + 1),
        );
      }
    }
  }
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
