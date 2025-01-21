// @ts-check
import { all, createStarryNight } from "@wooorm/starry-night";

/**
 * @returns {ReturnType<typeof createStarryNight>}
 */
export function createHighlighter() {
  return (globalThis.highlighter ??= createStarryNight(all));
}
