import type { Root } from "hast";
import { callbackify } from "node:util";
import type { LoaderDefinitionFunction } from "webpack";
import { createHighlighter } from "./highlighter.js";

export type LoadedCode = {
  tree: Root;
  scope: string | undefined;
  filename: string;
  lineNumbers: true;
};

const codeLoader: LoaderDefinitionFunction = function codeLoader(source) {
  callbackify(async () => {
    const highlighter = await createHighlighter();
    const scope = highlighter.flagToScope(this.resourcePath);

    const result: LoadedCode = {
      tree: highlighter.highlight(source, scope),
      scope,
      filename: this.resourcePath,
      lineNumbers: true,
    };

    return `export default ${JSON.stringify(result)};`;
  })(this.async());
};

export default codeLoader;
