// Fix-loop harness: runs one rule pass by pass (like ESLint's verifyAndFix),
// reports parse errors, non-convergence and the final output.
import {createRequire} from 'node:module';
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
import tseslint from '../../node_modules/typescript-eslint/dist/index.js';

const require = createRequire(import.meta.url);
const SourceCodeFixer = require('../../node_modules/eslint/lib/linter/source-code-fixer.js');

export const linter = new Linter({configType: 'flat'});

export const makeConfig = (rules, {settings = {}, ts = false} = {}) => {
  return [{
    files: ['**/*.js', '**/*.ts'],
    plugins: {jsdoc},
    rules,
    settings: {jsdoc: settings},
    ...(ts ? {languageOptions: {parser: tseslint.parser}} : {}),
  }];
};

const show = (s) => s.replaceAll('\r', '\\r');

export const loop = (code, rules, opts = {}) => {
  const config = makeConfig(rules, opts);
  const filename = opts.ts ? 'x.ts' : 'x.js';
  let text = code;
  const passes = [];
  let first;
  for (let i = 0; i < 10; i++) {
    const msgs = linter.verify(text, config, filename);
    if (i === 0) first = msgs;
    const fatal = msgs.find((m) => m.fatal);
    if (fatal) {
      return {first, passes, text, fatal, converged: false};
    }
    if (!msgs.some((m) => m.fix)) {
      return {first, passes, text, remaining: msgs, converged: true};
    }
    const r = SourceCodeFixer.applyFixes(text, msgs, true);
    passes.push({msgs, output: r.output});
    if (r.output === text) {
      return {first, passes, text, remaining: msgs, converged: false, noop: true};
    }
    text = r.output;
  }
  const msgs = linter.verify(text, config, filename);
  const fatal = msgs.find((m) => m.fatal);
  return {first, passes, text, remaining: msgs, fatal, converged: !msgs.some((m) => m.fix)};
};

export const report = (name, code, rules, opts = {}) => {
  const r = loop(code, rules, opts);
  console.log(`\n===== ${name}`);
  console.log('--- input');
  console.log(show(code));
  console.log('--- first messages: ' + (r.first.length ? r.first.map((m) => `L${m.line}${m.fix ? '(fix)' : ''}: ${m.message}`).join(' | ') : 'none'));
  console.log(`--- passes: ${r.passes.length}${r.converged ? ' converged' : ' NOT CONVERGED'}${r.noop ? ' (no-op fix)' : ''}${r.fatal ? ' PARSE ERROR: ' + r.fatal.message : ''}`);
  if (r.text !== code) {
    console.log('--- output');
    console.log(show(r.text));
  } else {
    console.log('--- output unchanged');
  }
  if (r.remaining?.length) {
    console.log('--- remaining: ' + r.remaining.map((m) => `L${m.line}${m.fix ? '(fix)' : ''}: ${m.message}`).join(' | '));
  }
  return r;
};
