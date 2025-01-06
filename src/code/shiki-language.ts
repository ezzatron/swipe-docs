import {
  bundledLanguagesInfo,
  type BundledLanguage,
  type SpecialLanguage,
} from "shiki";

const langByAlias: Record<string, string> = {};

for (const { aliases, id } of bundledLanguagesInfo) {
  if (aliases) for (const alias of aliases) langByAlias[alias] = id;
}

export function normalizeLanguage(
  lang: string,
): BundledLanguage | SpecialLanguage {
  return (langByAlias[lang] ?? lang) as BundledLanguage | SpecialLanguage;
}
