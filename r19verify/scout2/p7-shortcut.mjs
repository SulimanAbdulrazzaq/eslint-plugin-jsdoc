import {fix, run} from './lib.mjs';

const varRules = {
  'jsdoc/require-jsdoc': ['error', {
    contexts: ['VariableDeclaration'],
    publicOnly: true,
  }],
};

run({
  'local consts inside UNdocumented exported function': `
export function make(input) {
  const trimmed = input.trim();
  const parts = trimmed.split(',');
  return parts;
}`,
  'same, function documented': `
/** Doc. */
export function make(input) {
  const trimmed = input.trim();
  return trimmed;
}`,
  'local const inside undocumented export default function': `
export default function (input) {
  const trimmed = input.trim();
  return trimmed;
}`,
  'local const inside undocumented exported class method': `
export class A {
  m(input) {
    const trimmed = input.trim();
    return trimmed;
  }
}`,
}, varRules);

const classRules = {
  'jsdoc/require-jsdoc': ['error', {
    publicOnly: true,
    require: {ClassDeclaration: true, FunctionDeclaration: false},
  }],
};
run({
  'local class inside undocumented exported function': `
export function createStore() {
  class Store {}
  return new Store();
}`,
}, classRules);

const code = `
export function make(input) {
  const trimmed = input.trim();
  return trimmed;
}`;
const out = fix(code, {
  'jsdoc/require-jsdoc': ['error', {
    contexts: ['VariableDeclaration'],
    publicOnly: true,
    require: {FunctionDeclaration: true},
  }],
});
console.log('--- fix output ---');
console.log(out.output);
console.log('remaining:', out.messages.map((m) => `${m.line}: ${m.message}`));
