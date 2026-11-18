// Fixer sweep for type rules with multi-line types
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
  ['prefer-import-tag', ['error']],
];

const types = [
  ['{', '  a: String,', '  b(): void', '}'],
  ['{', '  (): void', '}'],
  ['{', '  a: `${string}`', '}'],
  ['{', '  a: import("./x.js").Foo', '}'],
  ['{', '  a: {', '    (x: number): void', '  }', '}'],
  ['Array<', '  String', '>'],
];

let problems = 0;
for (const [rule, opts] of rules) {
  for (const typeLines of types) {
    const typeText = typeLines.map((l, i) => (i ? ` * ${l}` : l)).join('\n');
    const code = `/**\n * Desc.\n * @param {${typeText}} foo Desc.\n */\nfunction quux (foo) {}\n`;
    const config = [{plugins: {jsdoc}, rules: {[`jsdoc/${rule}`]: opts}}];
    const before = linter.verify(code, config);
    if (!before.length) {
      continue;
    }
    const out = linter.verifyAndFix(code, config);
    const after = linter.verify(out.output, config);
    const fixableBefore = before.filter((m) => m.fix);
    if (after.length && fixableBefore.length || !out.fixed && fixableBefore.length) {
      problems++;
      console.log(`--- ${rule} ${JSON.stringify(opts.slice(1))}`);
      console.log('  input:\n' + code.replace(/^/gmv, '    '));
      console.log('  before:', before.map((m) => `${m.line}:${m.column} ${m.message}${m.fix ? ' [fixable]' : ''}`));
      console.log('  output:\n' + out.output.replace(/^/gmv, '    '));
      console.log('  still reported:', after.map((m) => `${m.line}:${m.column} ${m.message}`));
    }
  }
}
console.log('problems:', problems);
