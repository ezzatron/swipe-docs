// @ts-check
import { all, createStarryNight } from "@wooorm/starry-night";

/**
 * @returns {NonNullable<typeof globalThis.highlighter>}
 */
export function createHighlighter() {
  if (!globalThis.highlighter) {
    globalThis.highlighter = createStarryNight(all).then((highlighter) => ({
      ...highlighter,

      // Add support for undefined flags
      flagToScope(flag) {
        return flag && highlighter.flagToScope(flag);
      },

      // Add support for undefined scopes
      highlight(value, scope) {
        if (scope != null) return highlighter.highlight(value, scope);

        /** @type {import("hast").Root} */
        const tree = { type: "root", children: [{ type: "text", value }] };

        return tree;
      },
    }));
  }

  return globalThis.highlighter;
}
