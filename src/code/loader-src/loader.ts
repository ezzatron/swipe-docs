import type { Root } from "hast";
import { callbackify } from "node:util";
import type { LoaderDefinitionFunction } from "webpack";
import { createHighlighter } from "./highlighter.js";
import { type Mode } from "./mode.js";
import { transform } from "./transform.js";

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
    const params = new URLSearchParams(this.resourceQuery);
    const annotations = (params.get("annotations") ?? undefined) as
      | Mode
      | undefined;

    const result: LoadedCode = {
      tree: transform(highlighter.highlight(source, scope), {
        mode: annotations,
      }),
      scope,
      filename: this.resourcePath,
      lineNumbers: true,
    };

    return `export default ${JSON.stringify(result)};`;
  })(this.async());
};

export default codeLoader;
