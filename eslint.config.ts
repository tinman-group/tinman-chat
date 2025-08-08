import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      tailwindcss,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Matching Biome's recommended rules and custom configurations
      
      // A11y rules (matching Biome config)
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/scope': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'off',
      'jsx-a11y/role-supports-aria-props': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      
      // Complexity rules
      'no-useless-concat': 'warn',
      
      // Correctness rules
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-new-symbol': 'warn',
      'react/jsx-key': 'off', // Biome has this off
      'react-hooks/exhaustive-deps': 'off', // Biome has this off
      'no-continue': 'off',
      
      // Security rules
      'react/no-danger': 'off', // Biome has dangerouslySetInnerHTML off
      
      // Style rules  
      'react/jsx-fragments': ['warn', 'syntax'],
      'yoda': 'warn',
      'default-param-last': 'warn',
      'prefer-exponentiation-operator': 'off',
      'no-else-return': 'off',
      
      // Suspicious rules
      '@typescript-eslint/no-explicit-any': 'off',
      
      // Import rules
      'import/no-unused-modules': 'off',
      
      // Tailwind rules
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
      
      // Additional rules from Next.js
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      
      // Disable some default TypeScript rules that conflict
      'no-unused-vars': 'off', // Use TypeScript version instead
    },
  },
  {
    // Playwright-specific overrides (matching Biome config)
    files: ['playwright/**/*.{js,ts}'],
    rules: {
      'no-empty-pattern': 'off',
    },
  },
  {
    // Ignore patterns (matching Biome config)
    ignores: [
      '**/pnpm-lock.yaml',
      'lib/db/migrations/**',
      'lib/editor/react-renderer.tsx',
      'node_modules/**',
      '.next/**',
      'public/**',
      '.vercel/**',
      '**/components/ui/**', // Keep existing ignore
    ],
  },
];