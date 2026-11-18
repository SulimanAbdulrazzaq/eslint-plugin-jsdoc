import {run} from './lib.mjs';

const nextCases = {
  'A control: const x = yield': `
/**
 * @yields {number} Count.
 * @next {string} Command.
 */
function * counter() {
  let n = 0;
  while (true) {
    const command = yield n++;
    if (command === 'stop') {
      return;
    }
  }
}`,
  'B assignment: command = yield': `
/**
 * @yields {number} Count.
 * @next {string} Command.
 */
function * counter() {
  let n = 0;
  let command;
  while (command !== 'stop') {
    command = yield n++;
  }
}`,
  'C comparison: if ((yield n) === stop)': `
/**
 * @yields {number} Count.
 * @next {string} Command.
 */
function * counter() {
  let n = 0;
  while (true) {
    if ((yield n++) === 'stop') {
      return;
    }
  }
}`,
  'D argument: items.push(yield)': `
/**
 * @yields {undefined} Nothing.
 * @next {string} Item.
 */
function * collect(items) {
  while (true) {
    items.push(yield);
  }
}`,
  'E destructuring: const {value} = yield': `
/**
 * @yields {number} Count.
 * @next {{value: string}} Command.
 */
function * counter() {
  while (true) {
    const {value} = yield 1;
    log(value);
  }
}`,
};

run(nextCases, {
  'jsdoc/require-yields-check': ['error', {next: true}],
  'jsdoc/require-yields': ['error', {next: true}],
});

const yieldCases = {
  'F yield as callee object: (yield x).foo()': `
/**
 * Doc.
 */
function * g() {
  (yield 1).toString();
}`,
  'G yield inside new: new Box(yield 1)': `
/**
 * Doc.
 */
function * g() {
  return new Box(yield 1);
}`,
  'H yield inside throw': `
/**
 * Doc.
 */
function * g() {
  throw yield 1;
}`,
  'I yield inside await in async generator': `
/**
 * Doc.
 */
async function * g() {
  await (yield 1);
}`,
  'J yield inside class field initialiser? (yield in template)': `
/**
 * Doc.
 */
function * g() {
  log(\`\${yield 1}\`);
}`,
};

run(yieldCases, {'jsdoc/require-yields': 'error'});
