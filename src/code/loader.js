// @ts-check
import { highlight } from "./highlight.js";

export default function codeLoader(source) {
  const [scope, tree] = highlight(this.resourcePath, source);
  const result = {
    filename: this.resourcePath,
    scope,
    tree,
    lineNumbers: true,
  };

  return `export default ${JSON.stringify(result)};`;
}
