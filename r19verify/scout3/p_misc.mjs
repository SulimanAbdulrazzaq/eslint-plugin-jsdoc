// match-description message choice; valid-types allowEmptyNamepaths default
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const run = (name, code, rules, settings = {}) => {
  const config = [{plugins: {jsdoc}, rules, settings: {jsdoc: settings}}];
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} [${m.ruleId}] ${m.message}`));
};

// The rule's own documented example config
run('match-description: documented mainDescription object + tags true', `/**
 * Does a thing.
 * @param foo lower-case param description
 */
function f (foo) {}
`, {'jsdoc/match-description': ['error', {
  mainDescription: {
    message: 'Capitalize first word of JSDoc block descriptions',
    match: '[A-Z].*\\.',
  },
  tags: {
    param: true,
    returns: true,
  },
}]});

run('valid-types: no options, @callback without a name', `/**
 * @callback
 */
function quux () {}
`, {'jsdoc/valid-types': 'error'});

run('valid-types: allowEmptyNamepaths true', `/**
 * @callback
 */
function quux () {}
`, {'jsdoc/valid-types': ['error', {allowEmptyNamepaths: true}]});

run('valid-types: set 2 (@class) and set 4 (@fires) empty, allowEmptyNamepaths false', `/**
 * @class
 * @fires
 */
function Quux () {}
`, {'jsdoc/valid-types': ['error', {allowEmptyNamepaths: false}]});

run('valid-types: set 3 (@memberof) empty, allowEmptyNamepaths true', `/**
 * @memberof
 */
function quux () {}
`, {'jsdoc/valid-types': ['error', {allowEmptyNamepaths: true}]});
