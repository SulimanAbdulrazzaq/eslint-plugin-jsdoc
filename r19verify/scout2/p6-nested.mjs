import {run} from './lib.mjs';

run({
  'local const inside exported function (VariableDeclaration context)': `
/**
 * Doc.
 */
export function make() {
  const local = 1;
  return local;
}`,
  'control: exported const': `
export const value = 1;`,
  'control: not exported const': `
const value = 1;`,
}, {
  'jsdoc/require-jsdoc': ['error', {
    contexts: ['VariableDeclaration'],
    publicOnly: true,
  }],
});

run({
  'local class inside exported function': `
/**
 * Doc.
 */
export function createStore() {
  class Store {}
  return new Store();
}`,
  'local class inside exported arrow': `
/**
 * Doc.
 */
export const createStore = () => {
  class Store {}
  return new Store();
};`,
  'control: local class inside non-exported function': `
function createStore() {
  class Store {}
  return new Store();
}`,
}, {
  'jsdoc/require-jsdoc': ['error', {
    publicOnly: true,
    require: {ClassDeclaration: true},
  }],
});

run({
  'TS: local interface inside exported function': `
/**
 * Doc.
 */
export function make(): void {
  interface Local { a: string }
  const x: Local = {a: ''};
}`,
}, {
  'jsdoc/require-jsdoc': ['error', {
    contexts: ['TSInterfaceDeclaration', 'TSPropertySignature'],
    publicOnly: true,
  }],
}, {ts: true});

// require-description publicOnly (new in #1852)
run({
  'require-description: local function documented inside exported function': `
/**
 * Doc.
 */
export function outer() {
  /**
   * @param a A.
   */
  function inner(a) {}
  return inner;
}`,
  'require-description: documented exported fn missing desc (control)': `
/**
 * @param a A.
 */
export function outer(a) {}`,
  'require-description: documented non-exported fn (control)': `
/**
 * @param a A.
 */
function outer(a) {}`,
  'require-description: exported via export {} before decl': `
export {outer};
/**
 * @param a A.
 */
function outer(a) {}`,
  'require-description: documented local class method in exported function': `
/**
 * Doc.
 */
export function outer() {
  class Inner {
    /**
     * @param a A.
     */
    m(a) {}
  }
  return Inner;
}`,
}, {
  'jsdoc/require-description': ['error', {publicOnly: true}],
});
