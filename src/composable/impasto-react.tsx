import { createContext, useContext, type ReactNode } from "react";
import slugify from "react-slugify";

const context = createContext<{ id?: string }>({ id: undefined });

type Props = {
  id?: string;
  children: ReactNode;
};

export function CodeBlockProvider({ id, children }: Props) {
  return <context.Provider value={{ id }}>{children}</context.Provider>;
}

export function useCodeBlockId(): string | undefined {
  return useContext(context).id;
}

export type TitleSlugger = (title: ReactNode) => string | undefined;

export function createTitleSlugger(prefix: string = ""): TitleSlugger {
  const slugCounts: Record<string, number> = {};

  return (title) => {
    const slug = slugify(title);

    if (!slug) return undefined;

    const count = slugCounts[slug] ?? 0;
    slugCounts[slug] = count + 1;

    const parts = prefix ? [prefix, slug] : [slug];
    if (count > 0) parts.push(count.toString());

    return parts.join("-");
  };
}
