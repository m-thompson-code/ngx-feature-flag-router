/**
 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#alternatives
 *
 * Creates a new array with all sub-array elements concatenated into it recursively up to a single depth
 *
 * @param array {T[][]} multi dimensional array of T
 *
 * @returns new array with type T[]
 */
export const flattened = <T>(array: T[][]): T[] => ([] as T[]).concat(...array);
