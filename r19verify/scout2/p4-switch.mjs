import {run} from './lib.mjs';

const cases = {
  'A control: case without braces, break, falls off': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a':
    log(kind);
    break;
  default:
    return 'other';
  }
}`,
  'B same with braces around the case body': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a': {
    log(kind);
    break;
  }
  default:
    return 'other';
  }
}`,
  'C last case has no return, falls off': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a':
    return 'A';
  default:
    log(kind);
  }
}`,
  'D break inside an if in a case': `
/**
 * @returns {string} The label.
 */
function label(kind, x) {
  switch (kind) {
  case 'a':
    if (x) {
      break;
    }
    return 'A';
  default:
    return 'other';
  }
}`,
  'E control: braces, all return': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a': {
    const v = 'A';
    return v;
  }
  default: {
    return 'other';
  }
  }
}`,
  'F braces with empty return': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a': {
    return;
  }
  default:
    return 'other';
  }
}`,
  'G control: empty return without braces': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  switch (kind) {
  case 'a':
    return;
  default:
    return 'other';
  }
}`,
};

run(cases, {'jsdoc/require-returns-check': 'error'});
