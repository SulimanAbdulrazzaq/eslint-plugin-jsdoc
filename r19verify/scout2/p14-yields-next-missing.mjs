import {run} from './lib.mjs';

run({
  'A control: const command = yield (no @next)': `
/**
 * @yields {number} Count.
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
  'B command = yield (no @next)': `
/**
 * @yields {number} Count.
 */
function * counter() {
  let n = 0;
  let command;
  while (command !== 'stop') {
    command = yield n++;
  }
}`,
}, {'jsdoc/require-yields': ['error', {next: true}]});
