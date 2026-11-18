// imports-as-dependencies: scoped package whose types come from DefinitelyTyped (@types/scope__name)
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

// The rule reads package.json and node_modules from process.cwd()
process.chdir(new URL('./proj/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/v, '$1'));
console.log('cwd:', process.cwd());

const linter = new Linter({configType: 'flat'});
const config = [{plugins: {jsdoc}, rules: {'jsdoc/imports-as-dependencies': 'error'}}];

for (const [name, code] of Object.entries({
  'unscoped package without own types, @types/lodash installed (control)': `/** @type {import('lodash').Dictionary<string>} */
let a;`,
  'scoped package without own types, @types/babel__core installed': `/** @type {import('@babel/core').TransformOptions} */
let b;`,
})) {
  console.log(`--- ${name}`);
  console.log('  reports:', linter.verify(code, config).map((m) => `${m.line}:${m.column} ${m.message}`));
}
