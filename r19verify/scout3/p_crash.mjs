// Crash sweep: run every rule (with defaults) on odd inputs in every mode, JS and TS parsers.
import {Linter} from '../../node_modules/eslint/lib/api.js';
import jsdoc from '../../src/index.js';
import ts from '../../node_modules/typescript-eslint/dist/index.js';

const linter = new Linter({configType: 'flat'});

const skip = new Set(['check-examples', 'no-unnecessary-type-assertion']);
const ruleNames = Object.keys(jsdoc.rules).filter((r) => !skip.has(r));

const jsCases = {
  emptyBlock: '/***/\nfunction a () {}',
  emptyBlock2: '/** */\nfunction a () {}',
  eofBlock: 'function a () {}\n/** */',
  eofBlock2: 'function a () {}\n/***/',
  onlyStar: '/**\n *\n */\nfunction a (b) {}',
  unterminatedType: '/**\n * @param {string b\n */\nfunction a (b) {}',
  openBrace: '/**\n * @param {\n */\nfunction a (b) {}',
  eqType: '/**\n * @param {=} b\n * @returns {=}\n */\nfunction a (b) {}',
  dotsType: '/**\n * @param {...} b\n * @type {...}\n * @returns {...}\n */\nfunction a (...b) {}',
  emptyType: '/**\n * @param {} b\n * @returns {}\n * @type {}\n * @typedef {} X\n * @template {} T\n */\nfunction a (b) {}',
  braces: '/**\n * @param {{}} b\n * @returns {{}}\n * @throws {}\n * @yields {}\n */\nfunction * a (b) {}',
  unicode: '/**\n * @param {Ünï} ñame Déscription.\n * @returns {日本} 戻り値\n */\nfunction a (ñame) { return ñame; }',
  exportDefault: '/**\n * Desc.\n * @param b\n */\nexport default function (b) {}',
  exportDefaultArrow: '/**\n * Desc.\n * @param b\n */\nexport default (b) => b;',
  exportDefaultClass: '/**\n * Desc.\n */\nexport default class {\n  /** @param x */\n  m (x) {}\n}',
  staticBlock: 'class A {\n  /** Desc. */\n  static {\n    /** @type {number} */\n    const x = 1;\n  }\n}',
  privateField: 'class A {\n  /** @type {number} */\n  #x = 1;\n  /** @param y */\n  #m (y) {}\n  /** @returns {number} */\n  get #g () { return 1; }\n}',
  jsx: '/**\n * @param props\n */\nfunction A (props) { return <div a={1}>{props.x}</div>; }',
  longLine: '/**\n * ' + 'x'.repeat(5000) + '\n * @param {' + 'A|'.repeat(500) + 'B} b\n */\nfunction a (b) {}',
  tagOnly: '/** @ */\nfunction a () {}',
  tagOnly2: '/**\n * @\n * @param\n * @returns\n */\nfunction a (b) {}',
  nameEq: '/**\n * @param [b=] \n * @param [=c]\n * @param []\n */\nfunction a (b, c) {}',
  inline: '/**\n * {@link} {@link } {@see x} {@}\n * @see {@link}\n */\nfunction a () {}',
  bomEnd: '/**\n * @param b */ function a (b) {}',
  nested: '/** /** @param b */\nfunction a (b) {}',
  getterSetter: 'const o = {\n  /** @returns {number} */\n  get x () { return 1; },\n  /** @param v */\n  set x (v) {}\n};',
  asyncGen: '/**\n * @yields {number}\n * @returns {AsyncGenerator}\n */\nasync function * g () { yield 1; }',
  optionalChain: '/**\n * @param a\n */\nconst f = (a) => a?.b?.();',
  defaultParams: '/**\n * @param {object} [root]\n * @param {string} [root.a]\n */\nfunction f ({a = 1, ...rest} = {}, [x, ...y] = []) {}',
  tabs: '\t/**\n\t * @param\t{string}\tb\tDesc\n\t */\n\tfunction a (b) {}',
  crlf: '/**\r\n * @param {string} b Desc\r\n * @returns {number}\r\n */\r\nfunction a (b) { return 1; }\r\n',
  noStars: '/**\n @param {string} b\n @returns {number}\n*/\nfunction a (b) { return 1; }',
  importTag: '/**\n * @import {A} from \'a\'\n * @import * as B from \'b\'\n * @import\n */\n/** @type {A} */\nlet x;',
  callbackTag: '/**\n * @callback\n * @callback CB\n * @param\n */\n/** @type {CB} */\nlet y;',
  fileOverview: '/** @file */\n/** @file */\n/** @fileoverview */\nconst z = 1;',
};

const tsCases = {
  enum: '/** Desc. */\nenum E {\n  /** A */\n  A = 1,\n}',
  namespace: '/** Desc. */\nnamespace N {\n  /** @param a */\n  export function f (a: string) {}\n}',
  declareModule: '/** Desc. */\ndeclare module \'m\' {\n  /** @param a */\n  export function f (a: string): void;\n}',
  decorators: 'class A {\n  /** @param a */\n  @dec() m (@inject() a: string) {}\n  /** @type {string} */\n  @prop() p = \'\';\n}',
  abstract: 'abstract class A {\n  /** @param a @returns {number} */\n  abstract m (a: string): number;\n}',
  overloads: '/** @param a */\nfunction f (a: string): void;\n/** @param a */\nfunction f (a: number): void;\nfunction f (a: any) {}',
  iface: '/** Desc. */\ninterface I {\n  /** @param a */\n  m (a: string): void;\n  /** @returns {number} */\n  (): number;\n  /** @param k */\n  [k: string]: any;\n  new (a: string): I;\n}',
  typeAlias: '/** @template T */\ntype T<X> = X extends string ? `a${X}` : never;\n/** @param a */\ntype Fn = (a: string) => void;',
  thisParam: '/** @param a */\nfunction f (this: Window, a: string) {}',
  paramProps: 'class A {\n  /** @param a */\n  constructor (private readonly a: string, public b?: number) {}\n}',
  exportAssign: '/** @param a */\nexport = function (a: string) {};',
  satisfiesFn: '/** @param a */\nconst f = ((a: string) => a) satisfies (a: string) => string;',
  accessor: 'class A {\n  /** @type {number} */\n  accessor x = 1;\n}',
  genericFn: '/** @template T @param {T} a @returns {T} */\nfunction f<T extends object = {}>(a: T): T { return a; }',
  declareGlobal: 'declare global {\n  /** @param a */\n  function g (a: string): void;\n}',
  tsTypeCast: 'const x = /** @type {number} */ (y as any);',
  emptyBlock: '/***/\nexport {};',
};

const modes = ['typescript', 'jsdoc', 'closure', 'permissive'];
const crashes = new Map();
let totalMsgs = 0;

const runAll = (cases, languageOptions, label) => {
  for (const mode of modes) {
    for (const [caseName, code] of Object.entries(cases)) {
      for (const rule of ruleNames) {
        const config = [{
          files: ['**/*.*'],
          languageOptions,
          plugins: {jsdoc},
          rules: {[`jsdoc/${rule}`]: 'error'},
          settings: {jsdoc: {mode}},
        }];
        try {
          const msgs = linter.verify(code, config, {filename: label === 'ts' ? 'x.tsx' : 'x.jsx'});
          totalMsgs += msgs.length;
          const fatal = msgs.find((m) => m.fatal);
          if (fatal && !crashes.has(`parse:${label}:${caseName}`)) {
            crashes.set(`parse:${label}:${caseName}`, fatal.message);
          }
          linter.verifyAndFix(code, config, {filename: label === 'ts' ? 'x.tsx' : 'x.jsx'});
        } catch (error) {
          const key = `${rule} | ${label}:${caseName}`;
          const msg = String(error.message).split('\n')[0];
          const prev = crashes.get(key);
          crashes.set(key, prev ? (prev.includes(mode) ? prev : prev + `, ${mode}`) : `[${mode}] ${msg}`);
        }
      }
    }
  }
};

runAll(jsCases, {parserOptions: {ecmaFeatures: {jsx: true}}}, 'js');
runAll(tsCases, {parser: ts.parser}, 'ts');
runAll(Object.fromEntries(Object.entries(jsCases).filter(([k]) => !['jsx'].includes(k))), {parser: ts.parser}, 'ts-js');

for (const [k, v] of crashes) {
  console.log(`${k}: ${v}`);
}
console.log(`total: ${crashes.size}, messages: ${totalMsgs}`);
