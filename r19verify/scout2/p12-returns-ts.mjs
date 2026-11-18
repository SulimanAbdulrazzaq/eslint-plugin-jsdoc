import {run} from './lib.mjs';

run({
  'A declare assertion function': `
/**
 * Asserts a string.
 * @param val Value.
 */
export declare function assertIsString(val: unknown): asserts val is string;`,
  'B overload signature with assertion': `
/**
 * Asserts a string.
 * @param val Value.
 */
export function assertIsString(val: unknown): asserts val is string;
export function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') throw new TypeError('x');
}`,
  'C control: type guard (returns boolean)': `
/**
 * Checks a string.
 * @param val Value.
 */
export declare function isString(val: unknown): val is string;`,
  'D declare function Promise<void>': `
/**
 * Saves.
 * @param val Value.
 */
export declare function save(val: unknown): Promise<void>;`,
  'E control: async implementation without return': `
/**
 * Saves.
 * @param val Value.
 */
export async function save(val: unknown): Promise<void> {
  await write(val);
}`,
  'F declare function returning undefined union': `
/**
 * Maybe.
 * @param val Value.
 */
export declare function maybe(val: unknown): void | undefined;`,
}, {'jsdoc/require-returns': 'error'}, {ts: true});

run({
  'G returns-check: declared assertion with @returns? (n/a)': `
/**
 * Asserts.
 * @param val Value.
 * @returns {asserts val is string}
 */
function assertIsString(val) {
  if (typeof val !== 'string') throw new TypeError('x');
}`,
}, {'jsdoc/require-returns-check': 'error'});
