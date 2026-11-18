// Fixer sweep for type rules: does the fix converge, keep the code parseable, and keep types valid?
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const rules = [
  ['check-types', ['error']],
  ['type-formatting', ['error']],
  ['ts-method-signature-style', ['error']],
  ['ts-method-signature-style', ['error', 'method']],
  ['ts-prefer-function-type', ['error']],
  ['ts-no-unnecessary-template-expression', ['error']],
  ['ts-no-empty-object-type', ['error']],
  ['prefer-import-tag', ['error']],
];

const types = [
  '{(): void}',
  '{(a: string): number} | null',
  '{(): void}[]',
  'Array<{(): void}>',
  '{new (): Foo}',
  '{a(): void}',
  '{a: () => void}',
  '{readonly a: () => void}',
  '{"quoted"(): void}',
  '{a?(): void}',
  '{a(): void; b(): void}',
  '{<T>(x: T): T}',
  '`${string}`',
  '`a${"b"}c`',
  '`${Foo}`',
  '{}',
  'Object',
  'Array.<String>',
  'Object<string, Number>',
  'import("./a.js").Foo',
  'import("eslint").Rule.RuleModule',
  'typeof import("x")',
  'keyof {a: String}',
  '{[key: string]: Boolean}',
  '(String|Number)[]',
  '?String',
  'String=',
  '...String',
  'function(String): Number',
  'Promise<Boolean>',
  'Map<String,Set<Number>>',
  '{a:string,b:number}',
  '{ a: string }',
  'string | number',
  'string|number',
  '[string,number]',
  "'single'",
  '"double"',
];

let problems = 0;
for (const [rule, opts] of rules) {
  for (const type of types) {
    const code = `/**\n * @param {${type}} foo Desc.\n * @returns {${type}} Desc.\n */\nfunction quux (foo) {}\n`;
    const config = [{plugins: {jsdoc}, rules: {[`jsdoc/${rule}`]: opts}}];
    const validConfig = [{plugins: {jsdoc}, rules: {'jsdoc/valid-types': 'error'}}];
    let out;
    try {
      out = linter.verifyAndFix(code, config);
    } catch (error) {
      console.log(`THROW ${rule} ${JSON.stringify(opts.slice(1))} ${type}: ${error.message.split('\n')[0]}`);
      problems++;
      continue;
    }
    if (!out.fixed) {
      continue;
    }
    const after = linter.verify(out.output, config);
    const fatal = after.find((m) => m.fatal);
    const validBefore = linter.verify(code, validConfig).length;
    const validAfter = linter.verify(out.output, validConfig);
    if (fatal || after.length || validAfter.length > validBefore) {
      problems++;
      console.log(`--- ${rule} ${JSON.stringify(opts.slice(1))} type ${type}`);
      console.log('  output:\n' + out.output.replace(/^/gmv, '    '));
      console.log('  still reported:', after.map((m) => `${m.line}:${m.column} ${m.message}`));
      if (validAfter.length > validBefore) {
        console.log('  valid-types after fix:', validAfter.map((m) => m.message));
      }
    }
  }
}
console.log('problems:', problems);
