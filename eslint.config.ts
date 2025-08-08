import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextPlugin from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      tailwindcss,
      "@next/next": nextPlugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        React: "readonly",
        JSX: "readonly"
      }
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    },
    rules: {
      // Allow explicit any and unused vars
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  {
    // Playwright-specific overrides (matching Biome config)
    files: ["playwright/**/*.{js,ts}"],
    rules: {
      "no-empty-pattern": "off"
    }
  },
  {
    // Ignore patterns (matching Biome config)
    ignores: [
      "**/pnpm-lock.yaml",
      "lib/db/migrations/**",
      "node_modules/**",
      ".next/**",
      "public/**",
      ".vercel/**",
      "tailwind.config.ts"
    ]
  }
];
