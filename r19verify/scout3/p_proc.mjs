// Where do @example messages land in the source file? Uses the real Linter + the `examples` config.
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc, {getJsdocProcessorPlugin} from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const makeConfig = (opts) => {
  return [
    {
      files: ['**/*.js'],
      plugins: {examples: getJsdocProcessorPlugin(opts)},
      processor: 'examples/examples',
    },
    {
      files: ['**/*.md/*.js'],
      rules: {'no-alert': 'error', 'no-debugger': 'error'},
    },
  ];
};

const show = (name, code, opts = {}) => {
  const msgs = linter.verify(code, makeConfig(opts), {filename: 'file.js'});
  const lines = code.split('\n');
  console.log(`--- ${name}`);
  for (const m of msgs) {
    const srcLine = lines[m.line - 1] ?? '';
    const pointed = srcLine.slice(m.column - 1, m.column + 9);
    console.log(`  ${m.line}:${m.column}-${m.endLine}:${m.endColumn}  ${m.message}`);
    console.log(`    line text: ${JSON.stringify(srcLine)}  -> text at column: ${JSON.stringify(pointed)}`);
  }
  if (!msgs.length) {
    console.log('  no messages');
  }
};

show('code on the next line (control)', `/**
 * @example
 * alert('a');
 */
function f () {}
`);

show('code on the @example line', `/**
 * @example alert('a');
 */
function f () {}
`);

show('message on the 3rd code line (endLine)', `/**
 * @example
 * const x = 1;
 * const y = 2;
 * alert('a');
 */
function f () {}
`);

show('paddedIndent: 4', `/**
 * @example
 *     const x = 1;
 *     alert('a');
 */
function f () {}
`, {paddedIndent: 4});

show('caption, code on same line', `/**
 * @example <caption>Title</caption> alert('a');
 */
function f () {}
`);

show('indented comment in class', `class A {
    /**
     * @example
     * debugger;
     */
    m () {}
}
`);

show('CRLF', '/**\r\n * @example\r\n * const x = 1;\r\n * alert(\'a\');\r\n */\r\nfunction f () {}\r\n');

show('two examples', `/**
 * @example
 * alert('a');
 * @example
 * debugger;
 */
function f () {}
`);
