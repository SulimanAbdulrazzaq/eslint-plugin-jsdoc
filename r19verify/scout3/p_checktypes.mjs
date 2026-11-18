// check-types fixer: does it edit the right tag?
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, ruleOpts, settings = {}) => {
  const config = [{
    plugins: {jsdoc},
    rules: {'jsdoc/check-types': ['error', ...ruleOpts]},
    settings: {jsdoc: settings},
  }];
  const before = linter.verify(code, config);
  console.log(`--- ${name}`);
  console.log('  reports:', before.map((m) => `${m.line}:${m.column} ${m.message}${m.fix ? ' [fixable]' : ''}`));
  const out = linter.verifyAndFix(code, config);
  console.log('  fixed output:\n' + out.output.replace(/^/gmv, '    '));
  console.log('  remaining:', out.messages.map((m) => `${m.line}:${m.column} ${m.message}`));
};

run('exempt typedef, property must change', `/**
 * @typedef {object} Options
 * @property {object} extra
 */
`, [{exemptTagContexts: [{tag: 'typedef', types: ['object']}]}], {
  preferredTypes: {object: 'Record<string, unknown>'},
});

run('same type text in the description', `/**
 * Converts a {String} value.
 * @param {String} value
 */
function f (value) {}
`, []);

run('multi-line type', `/**
 * @param {{
 *   a: String
 * }} value
 */
function f (value) {}
`, []);
