// Does jsdoc({config, rules, files, name, settings}) mutate the shared index.configs entry?
import jsdocPlugin, {jsdoc} from '../../src/index.js';

const shared = jsdocPlugin.configs['flat/recommended'];
console.log('before: name=', shared.name, 'files=', shared.files, 'check-values=', JSON.stringify(shared.rules['jsdoc/check-values']), 'settings=', JSON.stringify(shared.settings));

const a = jsdoc({
  config: 'flat/recommended',
  files: ['src/**/*.js'],
  name: 'my-src-config',
  rules: {'jsdoc/check-values': 'off'},
  settings: {mode: 'jsdoc'},
});
console.log('returned object is the shared object:', a === shared);
console.log('after: name=', shared.name, 'files=', shared.files, 'check-values=', JSON.stringify(shared.rules['jsdoc/check-values']), 'settings=', JSON.stringify(shared.settings));

// A second, independent call with no overrides now inherits the first call's overrides.
const b = jsdoc({config: 'flat/recommended'});
console.log('second plain call: name=', b.name, 'files=', b.files, 'check-values=', JSON.stringify(b.rules['jsdoc/check-values']));
console.log('a === b:', a === b);
