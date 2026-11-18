import {report} from '../harness.mjs';

const crlf = (s) => s.replaceAll('\n', '\r\n');

report('empty-tags (utils.setTag)', crlf(`/**
 * Desc.
 * @abstract foo
 */
function f() {}`), {'jsdoc/empty-tags': ['error']});

report('escape-inline-tags (utils.setBlockDescription)', crlf(`/**
 * Supports @yearly and
 * @monthly shorthands.
 * Second line.
 */
function f() {}`), {'jsdoc/escape-inline-tags': ['error', {enableFixer: true}]});

report('no-blank-block-descriptions (utils.setBlockDescription)', crlf(`/**
 *
 * Desc line one.
 * Desc line two.
 * @param a The a
 */
function f(a) {}`), {'jsdoc/no-blank-block-descriptions': ['error']});

report('sort-tags linesBetween (emptyLine)', crlf(`/**
 * Desc.
 * @param a The a
 * @returns {string} r
 */
function f(a) { return a; }`), {'jsdoc/sort-tags': ['error', {linesBetween: 1, tagSequence: [{tags: ['param']}, {tags: ['returns']}]}]});

report('convert-to-jsdoc-comments (getCommentOpening)', crlf(`// Line one
// line two
function f() {}
`), {'jsdoc/convert-to-jsdoc-comments': ['error']});

report('lines-before-block (insertTextAfter)', crlf(`const a = 1;
/**
 * Doc.
 */
function f() {}
`), {'jsdoc/lines-before-block': ['error']});
