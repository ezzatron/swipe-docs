import type { Root } from "hast";
export type Options = {
    noAnnotations?: boolean;
};
export declare function transform(tree: Root, { noAnnotations }?: Options): Root;
