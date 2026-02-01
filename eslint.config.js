import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommendedTypeChecked,
  nextVitals,
  nextTs,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "eslint.config.js",
            "postcss.config.js",
            "src/example/*.jsx",
            "src/example/*.tsx",
          ],
        },
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/example/*.jsx", "src/example/*.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  globalIgnores([".content-collections", ".github", ".makefiles", "artifacts"]),
]);
