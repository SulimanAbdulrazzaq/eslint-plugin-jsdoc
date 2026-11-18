import {report} from '../harness.mjs';

report('lines: 2 with one blank line already', `const a = 1;

/**
 * Doc.
 */
function f() {}`, {'jsdoc/lines-before-block': ['error', {lines: 2}]});

report('lines: 3 with two blank lines already', `const a = 1;


/**
 * Doc.
 */
function f() {}`, {'jsdoc/lines-before-block': ['error', {lines: 3}]});

report('ignoreSameLine false, top level (indent assumes one space)', `const a = 1; /**
 * Doc.
 */
function f() {}`, {'jsdoc/lines-before-block': ['error', {ignoreSameLine: false}]});
