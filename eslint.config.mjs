import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },
  {
    rules: {
      semi: 'error',
      'no-unused-vars': 'error',
      'space-before-blocks': ['error', 'always'],
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
