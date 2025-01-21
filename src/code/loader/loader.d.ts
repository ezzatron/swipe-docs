import type { Root } from "hast";
import type { LoaderDefinitionFunction } from "webpack";
export type LoadedCode = {
    tree: Root;
    scope: string | undefined;
    filename: string;
    lineNumbers: true;
};
declare const codeLoader: LoaderDefinitionFunction;
export default codeLoader;
