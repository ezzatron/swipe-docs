import {
  bundledLanguages,
  bundledThemes,
  createdBundledHighlighter,
  createOnigurumaEngine,
  createSingletonShorthands,
  type BundledLanguage,
  type BundledTheme,
  type LanguageRegistration,
  type SpecialLanguage,
} from "shiki";

export { bundledLanguagesInfo } from "shiki";

export const { codeToHast } = createSingletonShorthands(
  createdBundledHighlighter<BundledLanguage, BundledTheme>({
    langs: {
      ...bundledLanguages,
      mdx: () => import("./grammar/mdx.json") as Promise<LanguageRegistration>,
    },
    themes: bundledThemes,
    engine: () => createOnigurumaEngine(import("shiki/wasm")),
  }),
);

export type Language = BundledLanguage | SpecialLanguage;
