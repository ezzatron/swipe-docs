import { all, createStarryNight } from "@wooorm/starry-night";

export async function createHighlighter(): Promise<Highlighter> {
  return (globalThis.highlighter ??= createStarryNight(all));
}

type Highlighter = Awaited<ReturnType<typeof createStarryNight>>;

declare global {
  // eslint-disable-next-line no-var
  var highlighter: Promise<Highlighter> | undefined;
}
