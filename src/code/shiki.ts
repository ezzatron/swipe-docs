import mdx from "@shikijs/langs/mdx";
import {
  bundledLanguages,
  bundledThemes,
  createdBundledHighlighter,
  createOnigurumaEngine,
  createSingletonShorthands,
  type BundledLanguage,
  type BundledTheme,
  type SpecialLanguage,
} from "shiki";

export { bundledLanguagesInfo } from "shiki";

export const { codeToHast } = createSingletonShorthands<
  BundledLanguage,
  BundledTheme
>(async (...args) => {
  const factory = await createdBundledHighlighter({
    langs: bundledLanguages,
    themes: bundledThemes,
    engine: () => createOnigurumaEngine(import("shiki/wasm")),
  });

  const highlighter = await factory(...args);

  // Pre-load all the MDX lazily embedded langs
  // See https://github.com/shikijs/shiki/issues/887
  for (const { embeddedLangsLazy } of mdx) {
    await highlighter.loadLanguage(...(embeddedLangsLazy as Language[]));
  }

  return highlighter;
});

export type Language = BundledLanguage | SpecialLanguage;
