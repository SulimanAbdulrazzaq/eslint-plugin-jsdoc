import {run} from './lib.mjs';

const rules = {'jsdoc/require-file-overview': 'error'};

run({
  'A code at offset 0, @file later': `import a from 'a';

/** @file Overview */

export default a;
`,
  'B same with one leading newline (control)': `
import a from 'a';

/** @file Overview */

export default a;
`,
  'C code at offset 0, @file attached to the next statement': `foo();
/** @file Overview */
bar();
`,
  'C2 same with one leading newline (control)': `
foo();
/** @file Overview */
bar();
`,
  'D control: @file first': `/** @file Overview */

import a from 'a';
`,
  'E use strict at offset 0': `'use strict';

/** @file Overview */

module.exports = {};
`,
  'E2 same with one leading newline (control)': `
'use strict';

/** @file Overview */

module.exports = {};
`,
}, rules, {sourceType: 'commonjs'});
