import {report} from '../harness.mjs';

const nma = {'jsdoc/no-multi-asterisks': ['error']};

report('false positive: bare tag on the closing line', `/**
 * Desc.
 * @readonly */
const x = 1;`, nma);

report('false positive: @param name on the closing line', `/**
 * Desc.
 * @param a */
function f(a) {}`, nma);

report('false positive: @returns type on the closing line', `/**
 * Desc.
 * @returns {string} */
function f() { return ''; }`, nma);

report('control: description on the closing line', `/**
 * Desc.
 * @param a The a */
function f(a) {}`, nma);

report('true positive, but the fix drops the line star: text then **/', `/**
 * foo **/
function f() {}`, nma);
