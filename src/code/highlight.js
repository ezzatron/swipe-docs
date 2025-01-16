// @ts-check
import { all, createStarryNight } from "@wooorm/starry-night";

const highlighter = await createStarryNight(all);

/**
 * @param {string | undefined} flag
 * @param {string} source
 * @returns {[string | undefined, import("hast").Root]}
 */
export function highlight(flag, source) {
  const scope = flag && highlighter.flagToScope(flag);

  if (!scope) {
    return [
      scope,
      { type: "root", children: [{ type: "text", value: source }] },
    ];
  }

  return [scope, highlighter.highlight(source, scope)];
}
