// tagNamePreference: blocking a tag with `false` - what happens to its aliases?
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, settings, rules = {'jsdoc/check-tag-names': 'error'}) => {
  const config = [{plugins: {jsdoc}, rules, settings: {jsdoc: settings}}];
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} ${m.message}${m.fix ? ' [fixable]' : ''}`));
  const out = linter.verifyAndFix(code, config);
  console.log('  fixed output:\n' + out.output.replace(/^/gmv, '    '));
  console.log('  after fix:', out.messages.map((m) => `${m.line}:${m.column} ${m.message}`));
};

run('description blocked, @desc used', `/**
 * @desc Does a thing.
 */
function f () {}
`, {tagNamePreference: {description: false}});

run('file blocked with message, @fileoverview used', `/**
 * @fileoverview Module.
 */
`, {tagNamePreference: {file: {message: 'No file overviews here.'}}});

run('control: description blocked, @description used', `/**
 * @description Does a thing.
 */
function f () {}
`, {tagNamePreference: {description: false}});

run('check-tag-names: prose mentions the alias before the real tag', `/**
 * Unlike \`@return\`, this documents the value.
 * @return {string} The value.
 */
function f () { return ''; }
`, {});
