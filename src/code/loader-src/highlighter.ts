import { all, createStarryNight } from "@wooorm/starry-night";
import type { Root } from "hast";

export type Highlighter = Awaited<ReturnType<typeof createStarryNight>> & {
  flagToScope: (flag: string | undefined) => string | undefined;
  highlight: (value: string, scope: string | undefined) => Root;
};

declare global {
  // eslint-disable-next-line no-var
  var highlighter: Promise<Highlighter> | undefined;
}

export function createHighlighter(): Promise<Highlighter> {
  if (!globalThis.highlighter) {
    globalThis.highlighter = createStarryNight(all).then((highlighter) => ({
      ...highlighter,

      // Add support for undefined flags
      flagToScope(flag) {
        return flag && highlighter.flagToScope(flag);
      },

      // Add support for undefined scopes
      highlight(value, scope) {
        return scope == null
          ? { type: "root", children: [{ type: "text", value }] }
          : highlighter.highlight(value, scope);
      },
    }));
  }

  return globalThis.highlighter;
}
