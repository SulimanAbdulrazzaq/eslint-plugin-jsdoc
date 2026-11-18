import {fix, run} from './lib.mjs';

const rules = {
  'jsdoc/check-param-names': 'error',
  'jsdoc/require-param': 'error',
};

const code1 = `
/**
 * Handles it.
 * @param this The context.
 * @param root0 Options.
 * @param root0.a A.
 */
export function f(this: Window, {a}: Opts) {}`;

const out1 = fix(code1, {'jsdoc/require-param': 'error'}, {ts: true});
console.log('--- fix output (require-param only) ---');
console.log(out1.output);
console.log('remaining:', out1.messages.map((m) => m.message));
run({'after fix, both rules': out1.output}, rules, {ts: true});

const variants = {
  'documented this + two plain params (control)': `
/**
 * Handles it.
 * @param this The context.
 * @param a A.
 * @param b B.
 */
export function f(this: Window, a: string, b: string) {}`,
  'documented this, destructured second root named options': `
/**
 * Handles it.
 * @param this The context.
 * @param options Options.
 * @param options.a A.
 */
export function f(this: Window, {a}: Opts) {}`,
  'documented this, two destructured': `
/**
 * Handles it.
 * @param this The context.
 * @param root0 Options.
 * @param root0.a A.
 * @param root1 Other.
 * @param root1.b B.
 */
export function f(this: Window, {a}: Opts, {b}: Other) {}`,
  'this: void documented + destructured, method': `
class A {
  /**
   * Handles it.
   * @param this Ctx.
   * @param root0 Options.
   * @param root0.a A.
   */
  m(this: A, {a}: Opts) {}
}`,
};
run(variants, rules, {ts: true});

const code2 = `
/**
 * Handles it.
 * @param a A.
 */
export function f(this: {count: number}, a: string) {}`;
const out2 = fix(code2, rules, {ts: true});
console.log('--- fix output this literal ---');
console.log(out2.output);
console.log('remaining:', out2.messages.map((m) => m.message));
