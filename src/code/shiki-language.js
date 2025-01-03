import { bundledLanguagesInfo } from "shiki";

const langByAlias = {};

for (const { aliases, id } of bundledLanguagesInfo) {
  if (aliases) for (const alias of aliases) langByAlias[alias] = id;
}

export function normalizeLanguage(lang) {
  return langByAlias[lang] ?? lang;
}
