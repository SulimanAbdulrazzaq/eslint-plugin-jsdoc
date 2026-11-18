import {report} from '../harness.mjs';

const c = {'jsdoc/convert-to-jsdoc-comments': ['error']};

report('trailing comment of the previous statement', `doSomething(); // done for the side effect
function f() {}`, c);

report('trailing comment after the previous function', `function g() {} // end of g
function f() {}`, c);

report('inside a function body', `function outer() {
  call(); // the call
  function inner() {}
}`, c);

report('control: comment on its own line', `doSomething();
// Does a thing
function f() {}`, c);
