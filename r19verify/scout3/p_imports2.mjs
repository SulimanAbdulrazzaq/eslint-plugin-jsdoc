import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
process.chdir(new URL('./proj/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/v, '$1'));
const linter = new Linter({configType: 'flat'});
const config = [{plugins: {jsdoc}, rules: {'jsdoc/imports-as-dependencies': 'error'}}];
console.log('@import tag of a non-dependency:', linter.verify("/** @import {X} from 'not-a-dep' */\n/** @type {X} */\nlet a;", config).map((m) => m.message));
console.log('import() of the same non-dependency:', linter.verify("/** @type {import('not-a-dep').X} */\nlet a;", config).map((m) => m.message));
