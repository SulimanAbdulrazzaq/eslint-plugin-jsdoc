import {run} from './lib.mjs';

const cases = {
  'helper declared after if/else returns': `
/**
 * @returns {number} The value.
 */
function f(x) {
  if (x) {
    return 1;
  } else {
    return 2;
  }

  function helper() {
    log();
  }
}`,
  'switch: case with nested block containing break': `
/**
 * @returns {number} The value.
 */
function f(x) {
  switch (x) {
  case 1: {
    doThing();
    break;
  }
  default:
    return 2;
  }
}`,
  'switch: break inside if in case': `
/**
 * @returns {number} The value.
 */
function f(x) {
  switch (x) {
  case 1:
    if (x > 0) break;
    return 1;
  default:
    return 2;
  }
}`,
  'switch: case with no return, falls off end': `
/**
 * @returns {number} The value.
 */
function f(x) {
  switch (x) {
  case 1:
    return 1;
  default:
    doSomething();
  }
}`,
  'try returns, catch rethrows': `
/**
 * @returns {number} The value.
 */
function f(x) {
  try {
    return compute(x);
  } catch (e) {
    throw new Error('bad', {cause: e});
  }
}`,
  'return in finally after try with no return': `
/**
 * @returns {number} The value.
 */
function f(x) {
  try {
    doIt();
  } finally {
    cleanup();
  }
  return 1;
}`,
  'labeled block with break, then fall off': `
/**
 * @returns {number} The value.
 */
function f(x) {
  block: {
    if (x) break block;
    return 1;
  }
}`,
  'if/else-if with no final else': `
/**
 * @returns {number} The value.
 */
function f(x) {
  if (x === 1) {
    return 1;
  } else if (x === 2) {
    return 2;
  }
}`,
  'return of conditional, trailing empty statement': `
/**
 * @returns {number} The value.
 */
function f(x) {
  return x ? 1 : 2;;
}`,
  'class method getter returning in both branches': `
class A {
  /**
   * @returns {number} The value.
   */
  get v() {
    if (this.x) {
      return 1;
    }
    return 2;
  }
}`,
  'arrow: expression body void operator': `
/**
 * @returns {number} The value.
 */
const f = () => void doIt();`,
  'return inside switch inside for-of with default fallthrough': `
/**
 * @returns {string} The value.
 */
function f(items) {
  for (const item of items) {
    switch (item) {
    case 'a':
      return 'A';
    default:
      continue;
    }
  }
  return 'none';
}`,
  'switch default only throw': `
/**
 * @returns {string} The value.
 */
function f(kind) {
  switch (kind) {
  case 'a':
    return 'A';
  case 'b':
    return 'B';
  default:
    throw new TypeError('bad');
  }
}`,
  'switch nested case blocks all returning': `
/**
 * @returns {string} The value.
 */
function f(kind) {
  switch (kind) {
  case 'a': {
    const v = 'A';
    return v;
  }
  default: {
    return 'B';
  }
  }
}`,
};

run(cases, {'jsdoc/require-returns-check': 'error'});
