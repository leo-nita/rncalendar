import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. Base JavaScript Rules
  js.configs.recommended,

  // 2. TypeScript Rules
  ...tseslint.configs.recommended,

  // 3. React Rules
  pluginReact.configs.flat.recommended,

  // 4. Your Environment Setup
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // 5. YOUR CUSTOM RULES GO HERE 👇
  {
    rules: {
      'no-console': 'warn', // Warns you if you leave console.log in code
      'prefer-const': 'error', // Throws an error if a let variable is never reassigned
      'react/react-in-jsx-scope': 'off', // Turns off the old React import rule (not needed in modern React)
      '@typescript-eslint/no-explicit-any': 'warn', // Warns instead of errors when using 'any'
    },
  },
]);
