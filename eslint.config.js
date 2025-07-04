import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';


export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  { files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    plugins: { '@stylistic': stylistic },
    rules: {
      "@stylistic/semi": "error",
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
      "@typescript-eslint/no-unused-vars": "warn",
    }
  }
]);
