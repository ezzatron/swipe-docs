import type { Root } from "hast";
import type { Mode } from "./mode.js";
export type Options = {
    mode?: Mode;
};
export declare function transform(tree: Root, { mode }?: Options): Root;
