import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Attempts belong to the human and are never linted (CLAUDE.md).
    "src/app/challenges/*/deliverable/attempt-*/**",
    "src/app/challenges/_template/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
