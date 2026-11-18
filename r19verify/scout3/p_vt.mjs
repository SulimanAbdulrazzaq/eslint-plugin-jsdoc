import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
const linter = new Linter({configType: 'flat'});
const tags = {set1: ['callback', 'event', 'external', 'name'], set2: ['class', 'function', 'namespace', 'mixin', 'member'], set3: ['alias', 'lends', 'memberof', 'mixes', 'requires'], set4: ['listens', 'fires', 'emits']};
for (const mode of ['typescript', 'jsdoc']) {
  for (const val of [undefined, false, true]) {
    const out = [];
    for (const [set, ts] of Object.entries(tags)) {
      for (const t of ts) {
        const msgs = linter.verify(`/**\n * @${t}\n */\nfunction quux () {}\n`, [{plugins: {jsdoc}, rules: {'jsdoc/valid-types': val === undefined ? 'error' : ['error', {allowEmptyNamepaths: val}]}, settings: {jsdoc: {mode}}}]);
        out.push(`${set}:@${t}=${msgs.length ? 'R' : '-'}`);
      }
    }
    console.log(`${mode} allowEmptyNamepaths=${val}: ${out.join(' ')}`);
  }
}
