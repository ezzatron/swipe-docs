import type { Root } from "hast";
export type Mode = "strip" | "retain" | "ignore";
export type Options = {
    mode?: Mode;
};
export declare function transform(tree: Root, { mode }?: Options): Root;
