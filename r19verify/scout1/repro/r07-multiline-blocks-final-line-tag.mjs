import {report} from '../harness.mjs';

const mb = {'jsdoc/multiline-blocks': ['error']};

report('noFinalLineText: tag and name, no description, on the final line', `/**
 * Desc.
 * @param a */
function f(a) {}`, mb);

report('noFinalLineText: tag and type on the final line', `/**
 * Desc.
 * @returns {string} */
function f() { return ''; }`, mb);

report('noFinalLineText: bare tag on the final line', `/**
 * Desc.
 * @readonly */
const x = 1;`, mb);

report('control: tag with description on the final line', `/**
 * Desc.
 * @param a The a */
function f(a) {}`, mb);
