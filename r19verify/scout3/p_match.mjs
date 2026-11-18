// match-name without `match`; require-tags with unusual tag names
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, rules, settings = {}) => {
  const config = [{plugins: {jsdoc}, rules, settings: {jsdoc: settings}}];
  console.log(`--- ${name}`);
  try {
    console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} [${m.ruleId}] ${m.message}`));
  } catch (error) {
    console.log('  THROWS:', String(error.message).split('\n').slice(0, 3).join(' | '));
  }
};

run('match-name with no options', `/**
 * @param foo
 */
function quux (foo) {}
`, {'jsdoc/match-name': 'error'});

run('require-tags with memberof!', `/**
 * @memberof! Foo
 */
function quux () {}
`, {'jsdoc/require-tags': ['error', {tags: ['memberof!']}]});

run('require-tags with a tag containing a dot', `/**
 * Desc.
 */
function quux () {}
`, {'jsdoc/require-tags': ['error', {tags: ['vue.prop']}]});

run('require-tags with a tag containing a colon', `/**
 * Desc.
 */
function quux () {}
`, {'jsdoc/require-tags': ['error', {tags: ['ns:tag']}]});
