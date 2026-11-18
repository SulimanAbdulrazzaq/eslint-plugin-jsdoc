import {loop, report} from '../harness.mjs';

const rule = {'jsdoc/check-line-alignment': ['error', 'always', {wrapIndent: '  '}]};
const code = `/**
 * @param {{a: string,
 *   b: number}} obj The obj
 */
function f(obj) {}`;

report('check-line-alignment always + wrapIndent, multi-line type', code, rule);

const r = loop(code, rule);
for (const [i, p] of r.passes.entries()) {
  console.log(`pass ${i + 1}: ${JSON.stringify(p.output.split('\n')[2])}`);
}

report('control: same block without wrapIndent', code, {'jsdoc/check-line-alignment': ['error', 'always']});
