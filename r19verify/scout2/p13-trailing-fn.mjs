import {run} from './lib.mjs';

run({
  'A false positive: every path returns, helper declared last': `
/**
 * @returns {string} The parsed value.
 */
function parse(input) {
  try {
    return strict(input);
  } catch {
    return loose(input);
  }

  function strict(text) {
    return JSON.parse(text);
  }

  function loose(text) {
    if (text) {
      log(text);
    }
  }
}`,
  'B control: same without trailing helpers': `
/**
 * @returns {string} The parsed value.
 */
function parse(input) {
  try {
    return strict(input);
  } catch {
    return loose(input);
  }
}`,
  'C false negative: one path falls off, helper (ending in return) declared last': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  if (kind) {
    return format(kind);
  }

  function format(k) {
    return String(k);
  }
}`,
  'D control: same path falls off, no trailing helper': `
/**
 * @returns {string} The label.
 */
function label(kind) {
  if (kind) {
    return format(kind);
  }
}`,
}, {'jsdoc/require-returns-check': 'error'});
