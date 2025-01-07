import {
  bundledLanguagesInfo,
  type BundledLanguage,
  type SpecialLanguage,
} from "shiki";

const langByExtension: Record<string, string> = {
  mk: "make",
};

const langByAlias: Record<string, string> = {};

for (const { aliases, id } of bundledLanguagesInfo) {
  if (aliases) for (const alias of aliases) langByAlias[alias] = id;
}

export function normalizeLanguage(
  lang: string,
): BundledLanguage | SpecialLanguage {
  return (langByAlias[lang] ?? lang) as BundledLanguage | SpecialLanguage;
}

export function extensionToLanguage(
  ext: string,
): BundledLanguage | SpecialLanguage {
  return (langByExtension[ext] ?? ext) as BundledLanguage | SpecialLanguage;
}
