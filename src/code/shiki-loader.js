import { callbackify } from "node:util";
import { codeToHast } from "shiki";
import { normalizeLanguage } from "./shiki-language.js";
import { shikiOptions } from "./shiki-options.js";

export default function shikiLoader(source) {
  callbackify(async () => {
    const params = new URLSearchParams(this.resourceQuery);
    const lang = normalizeLanguage(params.get("lang") ?? "text");

    source = source.replace(/\n+$/g, "");
    const tree = await codeToHast(source, { ...shikiOptions, lang });

    return `export default ${JSON.stringify({ lang, source, tree })};`;
  })(this.async());
}
