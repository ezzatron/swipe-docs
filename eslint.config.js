// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    ignores: [".github", ".makefiles", "artifacts", "src/code/loader"],
  },
  ...compat.config({
    extends: [
      "eslint:recommended",
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
    ],
  }),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default config;
