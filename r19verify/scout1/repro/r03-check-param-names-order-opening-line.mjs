import {report} from '../harness.mjs';

const cpn = {'jsdoc/check-param-names': ['error', {enableFixer: true}]};

report('check-param-names order fix, first @param on the opening line', `/** @param b The b
 * @param a The a
 */
function f(a, b) {}`, cpn);

report('control: first @param on its own line', `/**
 * @param b The b
 * @param a The a
 */
function f(a, b) {}`, cpn);

report('sort-tags on the same shape (fixed in #1840)', `/** @returns {string} r
 * @param a The a
 */
function f(a) { return a; }`, {'jsdoc/sort-tags': ['error']});
