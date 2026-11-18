// captionRequired: where does the "Caption is expected" message land when another example is linted?
import {Linter} from '../../node_modules/eslint/lib/api.js';
import {getJsdocProcessorPlugin} from '../../src/index.js';

const linter = new Linter({configType: 'flat'});

const config = [
  {
    files: ['**/*.js'],
    plugins: {examples: getJsdocProcessorPlugin({captionRequired: true})},
    processor: 'examples/examples',
  },
  {
    files: ['**/*.md/*.js'],
    rules: {'no-alert': 'error'},
  },
];

const show = (name, code) => {
  const msgs = linter.verify(code, config, {filename: 'file.js'});
  console.log(`--- ${name}`);
  for (const m of msgs) {
    console.log(`  ${m.line}:${m.column}  [${m.ruleId}] ${m.message}`);
  }
  if (!msgs.length) {
    console.log('  no messages');
  }
};

show('only a captionless example (control)', `/**
 * @example
 * alert('a');
 */
function f () {}
`);

show('captionless example first, captioned example second', `/**
 * @example
 * foo();
 * @example <caption>Second</caption>
 * bar();
 */
function f () {}
`);

show('captionless example in a later comment than a captioned one', `/**
 * @example <caption>First</caption>
 * foo();
 */
function f () {}

/**
 * @example
 * bar();
 */
function g () {}
`);
