import { bundledLanguagesInfo } from "shiki";

const langByAlias: Record<string, string> = {};

for (const { aliases, id } of bundledLanguagesInfo) {
  if (aliases) for (const alias of aliases) langByAlias[alias] = id;
}

export function normalizeLanguage(lang: string): string {
  return langByAlias[lang] ?? lang;
}
