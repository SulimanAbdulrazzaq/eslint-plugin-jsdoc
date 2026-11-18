// Locations for default-expression blocks (@default, @param [a=...])
import {Linter} from '../../node_modules/eslint/lib/api.js';
import {getJsdocProcessorPlugin} from '../../src/index.js';

const linter = new Linter({configType: 'flat'});
const config = [
  {
    files: ['**/*.js'],
    plugins: {examples: getJsdocProcessorPlugin({checkDefaults: true, checkParams: true, checkProperties: true})},
    processor: 'examples/examples',
  },
  {
    files: ['**/*.jsdoc-defaults', '**/*.jsdoc-params', '**/*.jsdoc-properties'],
    rules: {'no-alert': 'error'},
  },
];

for (const [name, code] of Object.entries({
  '@param default': `/**
 * @param [foo=alert('a')] Desc.
 */
function f (foo) {}
`,
  '@default': `/**
 * @default alert('a')
 */
const x = 1;
`,
})) {
  const lines = code.split('\n');
  console.log(`--- ${name}`);
  for (const m of linter.verify(code, config, {filename: 'file.js', filterCodeBlock: () => true})) {
    console.log(`  ${m.line}:${m.column}-${m.endLine}:${m.endColumn} ${m.message}  -> text at column: ${JSON.stringify((lines[m.line - 1] ?? '').slice(m.column - 1, m.column + 9))}`);
  }
}
