import {run} from './lib.mjs';

const cases = {
  'A control: async throw, no try': `
/**
 * Loads it.
 */
async function load() {
  throw new Error('x');
}`,
  'B async throw in try with finally only (escapes)': `
/**
 * Loads it.
 */
async function load(conn) {
  try {
    throw new Error('not ready');
  } finally {
    conn.release();
  }
}`,
  'C sync function returns Promise.reject inside try/finally': `
/**
 * Loads it.
 */
function load(conn) {
  try {
    return Promise.reject(new Error('x'));
  } finally {
    conn.release();
  }
}`,
  'D sync function returns conditional reject': `
/**
 * Validates it.
 */
function validate(value) {
  return value ? Promise.resolve(value) : Promise.reject(new Error('empty'));
}`,
  'E lodash reject (not a promise)': `
import {reject} from 'lodash-es';
/**
 * Removes inactive users.
 */
function activeUsers(users) {
  return reject(users, 'inactive');
}`,
  'F executor with renamed reject param': `
/**
 * Waits.
 */
function wait(ms) {
  return new Promise((resolve, fail) => {
    if (ms < 0) {
      fail(new RangeError('negative'));
    }
    setTimeout(resolve, ms);
  });
}`,
  'G control executor with reject': `
/**
 * Waits.
 */
function wait(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new RangeError('negative'));
    }
    setTimeout(resolve, ms);
  });
}`,
  'H async: await Promise.reject': `
/**
 * Loads it.
 */
async function load() {
  await Promise.reject(new Error('x'));
}`,
  'I async: throw inside a declared but uncalled helper': `
/**
 * Loads it.
 */
async function load() {
  function fail() {
    throw new Error('x');
  }
  return 1;
}`,
  'J reject called on local variable named reject (not executor)': `
/**
 * Filters.
 */
function filter(list) {
  const reject = (x) => x.bad;
  return list.filter((x) => !reject(x));
}`,
};

run(cases, {'jsdoc/require-rejects': 'error'});
