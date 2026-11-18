import {report} from '../harness.mjs';

report('tag-lines always: single-line block', `/** @param x */
function f(x) {}`, {'jsdoc/tag-lines': ['error', 'always']});

report('tag-lines always: last tag on the closing line', `/**
 * Desc.
 * @param {string} a The a */
function f(a) {}`, {'jsdoc/tag-lines': ['error', 'always']});

report('tag-lines tags.param.lines always: last tag on the closing line', `/**
 * Desc.
 * @param {string} a The a */
function f(a) {}`, {'jsdoc/tag-lines': ['error', 'any', {tags: {param: {lines: 'always'}}}]});

report('control: last tag on its own line', `/**
 * Desc.
 * @param {string} a The a
 */
function f(a) {}`, {'jsdoc/tag-lines': ['error', 'always']});
