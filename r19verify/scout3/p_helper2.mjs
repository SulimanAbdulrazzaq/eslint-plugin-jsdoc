// Real-world shape: two jsdoc() entries for different folders.
import {Linter} from '../../node_modules/eslint/lib/api.js';
import {jsdoc} from '../../src/index.js';

const config = [
  jsdoc({
    config: 'flat/recommended-error',
    files: ['src/**/*.js'],
    name: 'jsdoc/src',
    rules: {'jsdoc/require-description': 'error'},
  }),
  jsdoc({
    config: 'flat/recommended-error',
    files: ['test/**/*.js'],
    name: 'jsdoc/test',
    rules: {'jsdoc/require-jsdoc': 'off'},
  }),
];

console.log('entries are the same object:', config[0] === config[1]);
console.log('entry 0:', config[0].name, config[0].files, 'require-description =', config[0].rules['jsdoc/require-description']);

const linter = new Linter({configType: 'flat', cwd: '/proj'});
const code = 'export function undocumented () {}\n\n/** @param a */\nexport function noDescription (a) {}\n';
for (const file of ['/proj/src/a.js', '/proj/test/a.js']) {
  const msgs = linter.verify(code, config, {filename: file});
  console.log(`${file}:`, msgs.map((m) => `${m.line}:${m.column} ${m.ruleId}`));
}
