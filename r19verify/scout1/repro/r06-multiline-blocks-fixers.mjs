import {report} from '../harness.mjs';

const mb = (o) => ({'jsdoc/multiline-blocks': ['error', o]});

report('noMultilineBlocks: multi-line type', `/**
 * @type {{a: string,
 *   b: number}}
 */
const x = {};`, mb({multilineTags: [], noMultilineBlocks: true}));

report('noMultilineBlocks: type on the tag line, name on the next line', `/**
 * @param {string}
 *   a The a
 */
function f(a) {}`, mb({multilineTags: [], noMultilineBlocks: true}));

report('control: noMultilineBlocks with a multi-line description', `/**
 * @param a The a
 *   and more about a
 */
function f(a) {}`, mb({multilineTags: [], noMultilineBlocks: true}));

report('noZeroLineText: two-line block', `/** Reported up here
 */
function f() {}`, mb({}));

report('control: noZeroLineText with a middle line (as in the tests)', `/** Reported up here
 * because the rest is multiline
 */
function f() {}`, mb({}));
