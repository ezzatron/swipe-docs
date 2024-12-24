// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    ignores: [".github", ".makefiles", ".next", "artifacts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettierConfig,
];

export default config;
