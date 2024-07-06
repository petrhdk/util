/** */
export function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/** */
export function roundToDecimals(number: number, numberOfDecimals: number) {
  return Math.round(number * 10 ** numberOfDecimals) / 10 ** numberOfDecimals;
}

/** */
export function formatFixedDecimals(number: number, numberOfDecimals: number) {
  const wholeNumber = Math.round(number);
  const decimals = Math.abs(
    Math.round((number - wholeNumber) * 10 ** numberOfDecimals),
  )
    .toString()
    .padEnd(numberOfDecimals, '0');
  return `${wholeNumber}.${decimals}`;
}
