import {report} from '../harness.mjs';

const st = {'jsdoc/sort-tags': ['error']};

report('sort-tags: continuation of the last tag shares the closing line', `/**
 * @returns {string} r
 * @param a The a
 *   more about a */
function f(a) { return a; }`, st);

report('sort-tags: last tag on the closing line', `/**
 * Desc.
 * @returns {string} r
 * @param a The a */
function f(a) { return a; }`, st);

report('control: check-param-names order fix on the same shape (calls moveClosingDelimiterToOwnLine)', `/**
 * @param b The b
 * @param a The a
 *   more about a */
function f(a, b) {}`, {'jsdoc/check-param-names': ['error', {enableFixer: true}]});
