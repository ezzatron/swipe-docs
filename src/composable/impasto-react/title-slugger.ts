import type { ReactNode } from "react";
import slugify from "react-slugify";

export type TitleSlugger = (title: ReactNode) => string | undefined;

export function createTitleSlugger(prefix: string = ""): TitleSlugger {
  const usedSlugs: Record<string, boolean> = {};

  return (title) => {
    let slug = slugify(title);

    if (!slug) return undefined;

    if (prefix) slug = `${prefix}-${slug}`;

    const slugWithPrefix = slug;
    let count = 0;

    while (usedSlugs[slug]) slug = `${slugWithPrefix}-${++count}`;
    usedSlugs[slug] = true;

    return slug;
  };
}
