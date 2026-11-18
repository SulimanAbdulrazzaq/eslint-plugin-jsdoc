import {linter, makeConfig, report} from '../harness.mjs';
import {parseComment} from '@es-joy/jsdoccomment';

const tags = (t) => JSON.stringify(parseComment({value: t.slice(t.indexOf('/**') + 2, t.indexOf('*/'))}).tags.map(({tag, name, description}) => ({tag, name, description})));
const others = makeConfig({'jsdoc/require-param': 'error', 'jsdoc/check-param-names': 'error', 'jsdoc/require-param-name': 'error'});

for (const [name, code] of [
  ['no-types: multi-line type, name on the last type line', `/**
 * Desc.
 * @param {{a: string,
 *   b: number}} obj The obj
 */
function f(obj) {}`],
  ['no-types: type on the tag line, name on the next line', `/**
 * @param {string}
 *   foo The foo
 */
function f(foo) {}`],
]) {
  console.log('tags before:', tags(code));
  const r = report(name, code, {'jsdoc/no-types': ['error']});
  console.log('tags after:', tags(r.text));
  console.log('require-param / check-param-names / require-param-name on the output:', linter.verify(r.text, others, 'x.js').map((m) => `L${m.line} ${m.ruleId}: ${m.message}`));
}
