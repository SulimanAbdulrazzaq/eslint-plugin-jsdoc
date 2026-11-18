import {run} from './lib.mjs';

// Same options as the require-jsdoc test "Encourage documenting React prop types"
const rules = {
  'jsdoc/require-jsdoc': ['error', {
    contexts: [
      'VariableDeclaration',
      'TSTypeAliasDeclaration',
      'TSPropertySignature',
      'TSInterfaceDeclaration',
      'TSMethodSignature',
      'TSEnumDeclaration',
    ],
    enableFixer: true,
    publicOnly: {
      esm: true,
    },
    require: {
      ArrowFunctionExpression: true,
      ClassDeclaration: true,
      ClassExpression: true,
      FunctionDeclaration: true,
      FunctionExpression: true,
      MethodDefinition: true,
    },
  }],
};

run({
  'undocumented exported component with local state': `
export function Button({label}: {label: string}) {
  const [open, setOpen] = useState(false);
  const text = label.trim();
  return text;
}`,
  'documented exported component with local state': `
/** A button. */
export function Button({label}: {label: string}) {
  const [open, setOpen] = useState(false);
  const text = label.trim();
  return text;
}`,
  'undocumented exported arrow component': `
export const Button = ({label}: {label: string}) => {
  const text = label.trim();
  return text;
};`,
}, rules, {ts: true});

const ancestorsOnly = {
  'jsdoc/require-jsdoc': ['error', {
    contexts: ['VariableDeclaration'],
    publicOnly: {ancestorsOnly: true},
  }],
};
run({
  'ancestorsOnly: undocumented exported fn local const': `
export function make(input) {
  const trimmed = input.trim();
  return trimmed;
}`,
  'ancestorsOnly: documented exported fn local const': `
/** Doc. */
export function make(input) {
  const trimmed = input.trim();
  return trimmed;
}`,
}, ancestorsOnly);
