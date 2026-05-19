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
    settings: {
      react: {
        version: 'detect', // Automatically detects your React 19 version
      },
    },
  },

  // 5. YOUR CUSTOM RULES GO HERE 👇
  {
    rules: {
      'no-console': 'error',
      'prefer-const': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 6. TARGETING TEST FILES ONLY 🎯
  {
    // This tells ESLint to ONLY apply the rules below to test files
    files: ['**/*.test.tsx', '**/*.test.ts'],
    rules: {
      // You can turn off or tweak rules specifically for tests here:
      'no-console': 'off', // e.g., allowing console logs inside your tests
      '@typescript-eslint/no-explicit-any': 'off', // e.g., allowing 'any' in test mocks
    },
  },
]);
