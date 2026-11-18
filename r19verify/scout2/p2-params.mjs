import {run} from './lib.mjs';

const cases = {
  'documented this + destructured param': `
/**
 * Handles it.
 * @param this The context.
 * @param root0 Options.
 * @param root0.a A.
 */
export function f(this: Window, {a}: Opts) {}`,
  'undocumented this + destructured param (control)': `
/**
 * Handles it.
 * @param root0 Options.
 * @param root0.a A.
 */
export function f(this: Window, {a}: Opts) {}`,
  'this with type literal': `
/**
 * Handles it.
 * @param a A.
 */
export function f(this: {count: number}, a: string) {}`,
  'this with type literal documented': `
/**
 * Handles it.
 * @param this Ctx.
 * @param a A.
 */
export function f(this: {count: number}, a: string) {}`,
  'param with inline type literal': `
/**
 * Handles it.
 * @param opts Options.
 */
export function f(opts: {a: string; b: number}) {}`,
  'destructured, annotation has extra prop': `
/**
 * Handles it.
 * @param root0 Options.
 * @param root0.a A.
 */
export function f({a}: {a: string; b: number}) {}`,
  'destructured with rename and type literal': `
/**
 * Handles it.
 * @param root0 Options.
 * @param root0.a A.
 */
export function f({a: alias}: {a: string}) {}`,
  'parameter property': `
class A {
  /**
   * Builds it.
   * @param x X.
   * @param y Y.
   */
  constructor(private readonly x: number, public y = 2) {}
}`,
  'parameter property destructured not allowed; optional': `
class A {
  /**
   * Builds it.
   * @param x X.
   */
  constructor(protected x?: number) {}
}`,
  'overload declarations + impl': `
/**
 * One.
 * @param a A.
 */
export function f(a: string): void;
/**
 * Two.
 * @param a A.
 * @param b B.
 */
export function f(a: string, b: number): void;
export function f(a: string, b?: number): void {}`,
  'class field arrow': `
class A {
  /**
   * Handles it.
   * @param e Event.
   */
  onClick = (e: Event) => {};
}`,
  'class field arrow missing param': `
class A {
  /**
   * Handles it.
   */
  onClick = (e: Event) => {};
}`,
  'nested destructuring with defaults': `
/**
 * Handles it.
 * @param root0 Options.
 * @param root0.a A.
 * @param root0.a.b B.
 * @param root0.c C.
 */
export function f({a: {b} = {}, c = 1} = {}) {}`,
  'array destructure in object': `
/**
 * Handles it.
 * @param root0 Options.
 * @param root0.list List.
 */
export function f({list: [first, second]}) {}`,
  'this documented only': `
/**
 * Handles it.
 * @param this Ctx.
 */
export function f(this: Window) {}`,
  'this + rest': `
/**
 * Handles it.
 * @param args Args.
 */
export function f(this: Window, ...args: string[]) {}`,
  'documented this + rest': `
/**
 * Handles it.
 * @param this Ctx.
 * @param args Args.
 */
export function f(this: Window, ...args: string[]) {}`,
  'type literal method member': `
/**
 * Handles it.
 * @param opts Opts.
 * @param opts.onDone Callback.
 */
export function f(opts: {onDone(): void}) {}`,
  'type literal string key': `
/**
 * Handles it.
 * @param opts Opts.
 * @param opts.'data-id' Id.
 */
export function f(opts: {'data-id': string}) {}`,
};

run(cases, {
  'jsdoc/require-param': 'error',
  'jsdoc/check-param-names': 'error',
}, {ts: true});
