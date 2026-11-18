import {report} from '../harness.mjs';

report('type-formatting: multi-line type, name and description on the last type line', `/**
 * @param {{a: string,
 *   b: number}} obj The obj
 */
function f(obj) {}`, {'jsdoc/type-formatting': ['error']});

report('type-formatting: one-line type, name and description on the next line', `/**
 * @param {Array<string>}
 *   foo The foo description
 */
function f(foo) {}`, {'jsdoc/type-formatting': ['error']});

report('type-formatting: @returns with a multi-line type', `/**
 * @returns {{a: string,
 *   b: number}} The result object
 */
function f() {}`, {'jsdoc/type-formatting': ['error']});

report('ts-prefer-function-type', `/**
 * @param {{
 *   (): void}} cb The callback
 */
function f(cb) {}`, {'jsdoc/ts-prefer-function-type': ['error']});

report('ts-method-signature-style', `/**
 * @param {{
 *   m(): void}} obj The obj
 */
function f(obj) {}`, {'jsdoc/ts-method-signature-style': ['error']});

report('ts-no-unnecessary-template-expression', '/**\n * @param {`${Foo}` |\n *   string} x The x\n */\nfunction f(x) {}', {'jsdoc/ts-no-unnecessary-template-expression': ['error']});
