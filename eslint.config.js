import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';


export default defineConfig([
  globalIgnores(["**/*.spec.ts", "assets/**/*", "dist/**/*"]),
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      }
    }
  },
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    plugins: { '@stylistic': stylistic },
    rules: {
      "@stylistic/semi": "error",
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
      "@typescript-eslint/no-unused-vars": "warn",
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: ["return"] },
        { blankLine: "always", prev: ["block-like"], next: "*" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "@stylistic/indent": ["error", 2],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
    }
  }
]);
