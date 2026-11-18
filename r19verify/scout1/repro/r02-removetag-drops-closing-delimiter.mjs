import {report} from '../harness.mjs';

report('check-tag-names typed (as in flat/recommended-typescript), @readonly on the closing line', `class A {
  /**
   * The count.
   * @readonly */
  count = 1;
}`, {'jsdoc/check-tag-names': ['error', {typed: true}]}, {ts: true});

report('check-tag-names typed, @abstract on the closing line', `class A {
  /**
   * Desc.
   * @abstract */
  m() {}
}`, {'jsdoc/check-tag-names': ['error', {typed: true}]}, {ts: true});

report('implements-on-classes fix: remove, @implements on the closing line', `/**
 * Desc.
 * @implements {Foo} */
function f() {}`, {'jsdoc/implements-on-classes': ['error', {fix: 'remove'}]});

report('control: the same tag on its own line', `class A {
  /**
   * The count.
   * @readonly
   */
  count = 1;
}`, {'jsdoc/check-tag-names': ['error', {typed: true}]}, {ts: true});

report('without removeEmptyBlock (check-param-names extraParams): leaves **/', `/**
 * @param a The a
 * @param x The x */
function f(a) {}`, {'jsdoc/check-param-names': ['error', {enableFixer: true, extraParams: true}]});

report('without removeEmptyBlock, single-line block: leaves /***/', `/** @param x The x */
function f() {}`, {'jsdoc/check-param-names': ['error', {enableFixer: true, extraParams: true}]});
