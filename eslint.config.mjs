import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },

      sourceType: 'module',
    },

    rules: {
      indent: ['error', 2],
      semi: ['error', 'always'],
    },
  },
  eslintConfigPrettier,
);
