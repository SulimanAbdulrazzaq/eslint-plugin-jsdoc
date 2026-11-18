// empty-tags fixer on multi-line content
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, rules = {'jsdoc/empty-tags': 'error'}, settings = {}) => {
  const config = [{plugins: {jsdoc}, rules, settings: {jsdoc: settings}}];
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} ${m.message}${m.fix ? ' [fixable]' : ''}`));
  const out = linter.verifyAndFix(code, config);
  console.log('  fixed output:\n' + out.output.replace(/^/gmv, '    '));
  console.log('  after fix:', out.messages.map((m) => `${m.line}:${m.column} ${m.message}`));
};

run('two-line content', `/**
 * @private Some text
 *   continuing here.
 */
function f () {}
`);

run('content only on the next line', `/**
 * @abstract
 *   Should be implemented.
 */
function f () {}
`);

run('type plus name', `/**
 * @readonly {string} x
 */
let x;
`);

run('on the closing line', `/** @async Something */
function f () {}
`);
