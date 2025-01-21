// @ts-check
import { callbackify } from "node:util";
import { createHighlighter } from "./highlighter.js";

/**
 * @this {import("webpack").LoaderContext<object>}
 */
export default function codeLoader(source) {
  callbackify(async () => {
    const highlighter = await createHighlighter();
    const scope = highlighter.flagToScope(this.resourcePath);

    const result = {
      tree: highlighter.highlight(source, scope),
      scope,
      filename: this.resourcePath,
      lineNumbers: true,
    };

    return `export default ${JSON.stringify(result)};`;
  })(this.async());
}
