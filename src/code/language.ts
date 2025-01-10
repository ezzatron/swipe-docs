import { bundledLanguagesInfo, type Language } from "./shiki";

const langByExtension: Record<string, string> = {
  mk: "make",
};

const langByAlias: Record<string, string> = {};

for (const { aliases, id } of bundledLanguagesInfo) {
  if (aliases) for (const alias of aliases) langByAlias[alias] = id;
}

export function normalizeLanguage(lang: string): Language {
  return (langByAlias[lang] ?? lang) as Language;
}

export function extensionToLanguage(ext: string): Language {
  return (langByExtension[ext] ?? normalizeLanguage(ext)) as Language;
}
