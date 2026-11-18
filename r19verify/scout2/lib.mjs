// Shared probe helper for scout2.
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
import tseslint from '../../node_modules/typescript-eslint/dist/index.js';

export const tsParser = tseslint.parser;

const linter = new Linter({configType: 'flat'});

/**
 * @param {Record<string, string>} cases
 * @param {object} rules
 * @param {{ts?: boolean, settings?: object, sourceType?: string}} [opts]
 */
export const run = (cases, rules, opts = {}) => {
  const config = [{
    files: ['**/*.ts', '**/*.js'],
    plugins: {jsdoc},
    rules,
    ...(opts.settings ? {settings: {jsdoc: opts.settings}} : {}),
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: opts.sourceType ?? 'module',
      ...(opts.ts ? {parser: tseslint.parser} : {}),
    },
  }];
  for (const [name, code] of Object.entries(cases)) {
    const messages = linter.verify(code, config, opts.ts ? 'x.ts' : 'x.js');
    console.log(`${name}: ${messages.length ? messages.map((m) => `[${m.ruleId}] line ${m.line}: ${m.message}`).join(' | ') : 'no report'}`);
  }
};

export const fix = (code, rules, opts = {}) => {
  const config = [{
    files: ['**/*.ts', '**/*.js'],
    plugins: {jsdoc},
    rules,
    ...(opts.settings ? {settings: {jsdoc: opts.settings}} : {}),
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: opts.sourceType ?? 'module',
      ...(opts.ts ? {parser: tseslint.parser} : {}),
    },
  }];
  return linter.verifyAndFix(code, config, opts.ts ? 'x.ts' : 'x.js');
};
