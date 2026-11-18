import {run} from './lib.mjs';

const rules = {
  'jsdoc/require-jsdoc': ['error', {
    publicOnly: true,
    require: {
      ArrowFunctionExpression: true,
      ClassDeclaration: true,
      FunctionDeclaration: true,
      FunctionExpression: true,
      MethodDefinition: true,
    },
  }],
};

const esm = {
  'ESM control: export {foo} after declaration': `
function foo() {}
export {foo};`,
  'ESM: export {foo} before function declaration': `
export {foo};
function foo() {}`,
  'ESM: export {foo} before const arrow': `
export {foo};
const foo = () => {};`,
  'ESM control: const arrow then export {foo}': `
const foo = () => {};
export {foo};`,
  'ESM: export default foo before declaration': `
export default foo;
function foo() {}`,
  'ESM: export {foo as bar} after declaration (control)': `
function foo() {}
export {foo as bar};`,
  'ESM: class nested in exported function': `
export function make() {
  class Inner {}
  return new Inner();
}`,
  'ESM: let reassigned later': `
let handler = () => {};
handler = () => {};
export {handler};`,
  'ESM: exported class with method, not exported class (control)': `
class Hidden {
  method() {}
}`,
  'ESM: exported const object with arrow prop': `
export const api = {
  get: () => {},
};`,
  'ESM: exported class then method of another class': `
export class A {}
class B {
  method() {}
}`,
  'ESM: function used as value of export const': `
function impl() {}
export const api = {impl};`,
  'ESM: function exported via export const alias': `
function impl() {}
export const alias = impl;`,
};

run(esm, rules);

const cjs = {
  'CJS control: module.exports after declarations': `
function parse() {}
module.exports = {parse};`,
  'CJS: module.exports before function declarations (hoisted)': `
module.exports = {parse};
function parse() {}`,
  'CJS: module.exports = parse before declaration': `
module.exports = parse;
function parse() {}`,
  'CJS: exports.parse = parse before declaration': `
exports.parse = parse;
function parse() {}`,
  'CJS: module.exports.parse = function after (control)': `
module.exports.parse = function () {};`,
  'CJS: Object.assign(module.exports, {...})': `
function parse() {}
Object.assign(module.exports, {parse});`,
  'CJS: module.exports = class with method': `
module.exports = class Parser {
  parse() {}
};`,
  'CJS: module.exports = new instance': `
class Parser {
  parse() {}
}
module.exports = new Parser();`,
};

run(cjs, rules, {sourceType: 'commonjs'});
