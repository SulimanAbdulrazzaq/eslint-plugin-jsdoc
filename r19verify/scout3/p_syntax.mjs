// no-missing-syntax / no-restricted-syntax with settings.jsdoc.contexts instead of the option
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, rules, settings = {}) => {
  const config = [{plugins: {jsdoc}, rules, settings: {jsdoc: settings}}];
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} [${m.ruleId}] ${m.message}`));
};

const code = `/**
 * @implements {Bar}
 */
class Quux {}
`;

const ctx = [{comment: 'JsdocBlock:has(JsdocTag[tag="implements"])', context: 'ClassDeclaration'}];

run('no-missing-syntax: contexts as rule option (control)', code, {'jsdoc/no-missing-syntax': ['error', {contexts: ctx}]});
run('no-missing-syntax: same contexts via settings.jsdoc.contexts', code, {'jsdoc/no-missing-syntax': 'error'}, {contexts: ctx});
run('no-missing-syntax: string context via settings', `/** Desc. */
function quux () {}
`, {'jsdoc/no-missing-syntax': 'error'}, {contexts: ['FunctionDeclaration']});
run('no-restricted-syntax: contexts as rule option (control)', code, {'jsdoc/no-restricted-syntax': ['error', {contexts: ctx}]});
run('no-restricted-syntax: same contexts via settings.jsdoc.contexts', code, {'jsdoc/no-restricted-syntax': 'error'}, {contexts: ctx});
