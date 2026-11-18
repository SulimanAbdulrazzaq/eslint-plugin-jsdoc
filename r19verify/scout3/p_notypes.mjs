// no-types fixer on multi-line types
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
import ts from '../../node_modules/typescript-eslint/dist/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, rules = {'jsdoc/no-types': 'error'}) => {
  const config = [{files: ['**/*.ts'], languageOptions: {parser: ts.parser}, plugins: {jsdoc}, rules}];
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config, {filename: 'x.ts'}).map((m) => `${m.line}:${m.column} [${m.ruleId}] ${m.message}${m.fix ? ' [fixable]' : ''}`));
  const out = linter.verifyAndFix(code, config, {filename: 'x.ts'});
  console.log('  fixed output:\n' + out.output.replace(/^/gmv, '    '));
  console.log('  after fix:', out.messages.map((m) => `${m.line}:${m.column} [${m.ruleId}] ${m.message}`));
};

run('multi-line object type', `/**
 * @param {{
 *   a: string
 * }} opts The options.
 */
function f (opts: {a: string}) {}
`);

run('multi-line type, then check names', `/**
 * @param {{
 *   a: string
 * }} opts The options.
 * @returns {{
 *   b: number
 * }} The result.
 */
function f (opts: {a: string}): {b: number} { return {b: 1}; }
`, {'jsdoc/no-types': 'error', 'jsdoc/check-param-names': 'error', 'jsdoc/require-param': 'error'});
