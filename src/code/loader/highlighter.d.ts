import { createStarryNight } from "@wooorm/starry-night";
import type { Root } from "hast";
export type Highlighter = Awaited<ReturnType<typeof createStarryNight>> & {
    flagToScope: (flag: string | undefined) => string | undefined;
    highlight: (value: string, scope: string | undefined) => Root;
};
declare global {
    var highlighter: Promise<Highlighter> | undefined;
}
export declare function createHighlighter(): Promise<Highlighter>;
