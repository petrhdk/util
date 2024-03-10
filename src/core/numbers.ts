export function formatDecimals(number: number, numberofDecimals: number) {
  return Math.round(number * 10 ** numberofDecimals) / 10 ** numberofDecimals;
}
