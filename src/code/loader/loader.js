import { callbackify } from "node:util";
import { createHighlighter } from "./highlighter.js";
import { transform } from "./transform.js";
const codeLoader = function codeLoader(source) {
    callbackify(async () => {
        const highlighter = await createHighlighter();
        const scope = highlighter.flagToScope(this.resourcePath);
        const params = new URLSearchParams(this.resourceQuery);
        const annotations = (params.get("annotations") ?? undefined);
        const result = {
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
//# sourceMappingURL=loader.js.map