// default-expressions: two @param defaults on different lines of an indented comment
import {Linter} from '../../node_modules/eslint/lib/api.js';
import {getJsdocProcessorPlugin} from '../../src/index.js';

const linter = new Linter({configType: 'flat'});
const config = [
  {files: ['**/*.js'], plugins: {examples: getJsdocProcessorPlugin({checkDefaults: true, checkParams: true, checkProperties: true})}, processor: 'examples/examples'},
  {files: ['**/*.jsdoc-defaults', '**/*.jsdoc-params', '**/*.jsdoc-properties'], rules: {'no-alert': 'error', 'no-debugger': 'error'}},
];
const code = `class A {
  /**
   * Desc.
   *
   * @param [a=alert('a')] First.
   * @param [b=confirm('b')] Second.
   */
  m (a, b) {}
}
`;
const lines = code.split('\n');
for (const m of linter.verify(code, config, {filename: 'file.js', filterCodeBlock: () => true})) {
  console.log(`  ${m.line}:${m.column}-${m.endLine}:${m.endColumn} ${m.message}  -> line text: ${JSON.stringify(lines[m.line - 1])}`);
}
